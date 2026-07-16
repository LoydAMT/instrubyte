import Anthropic from "npm:@anthropic-ai/sdk";
import { corsHeaders, jsonResponse } from "./cors.ts";
import { SYSTEM_PROMPT, SUBMIT_LEAD_TOOL, filterPriceLeak } from "./prompt.ts";
import { checkRateLimit, insertLead } from "./db.ts";
import { PUBLISHABLE_KEYS } from "./keys.ts";

const MAX_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_IMAGES_PER_MESSAGE = 1;
const MAX_IMAGE_BASE64_LENGTH = 6_000_000; // ~4.4MB raw -- well under Anthropic's per-image limit
const ALLOWED_IMAGE_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const REQUEST_TIMEOUT_MS = 25_000;

// Override via `supabase secrets set ANTHROPIC_MODEL=claude-opus-4-8` (or claude-sonnet-5)
// for higher-quality replies at a higher price. claude-haiku-4-5 is the cheapest model
// that still supports vision, which is why it's the default. It does NOT support
// `thinking` or `output_config.effort` (400s if sent) -- those are only added below when
// the configured model is a non-Haiku tier.
const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-haiku-4-5";
const SUPPORTS_THINKING_AND_EFFORT = !MODEL.includes("haiku");

function modelTierParams(): Record<string, unknown> {
  return SUPPORTS_THINKING_AND_EFFORT
    ? { thinking: { type: "adaptive" }, output_config: { effort: "medium" } }
    : {};
}

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

interface ChatImage {
  mediaType: string;
  data: string; // raw base64, no `data:` prefix
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: ChatImage[];
}

interface LeadInput {
  category?: string;
  specs?: string;
  contact_name?: string;
  contact_email?: string;
  contact_company?: string;
  urgency_note?: string;
}

interface ChatRequestBody {
  action?: "chat" | "escalate";
  messages?: ChatMessage[];
  lead?: LeadInput;
}

function toAnthropicContent(m: ChatMessage): string | Anthropic.ContentBlockParam[] {
  if (!m.images || m.images.length === 0) return m.content;

  const blocks: Anthropic.ContentBlockParam[] = m.images.map((img) => ({
    type: "image",
    source: { type: "base64", media_type: img.mediaType as "image/jpeg" | "image/png" | "image/webp", data: img.data },
  }));
  if (m.content) blocks.push({ type: "text", text: m.content });
  return blocks;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin);
  }

  // Deployed with --no-verify-jwt (Supabase's gateway JWT check doesn't understand the
  // new publishable/secret key format), so this function does its own apikey check --
  // it's not meaningful security (publishable keys are public by design, same as the old
  // anon key), just a floor to keep completely blind scanners off the endpoint. The
  // per-IP rate limit below is the actual abuse control.
  const apiKey = req.headers.get("apikey") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!apiKey || !PUBLISHABLE_KEYS.includes(apiKey)) {
    return jsonResponse({ error: "Unauthorized" }, 401, origin);
  }

  const clientIp = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const withinBudget = await checkRateLimit(clientIp);
  if (!withinBudget) {
    return jsonResponse(
      { error: "Too many messages. Please try again later or use the contact form." },
      429,
      origin,
    );
  }

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400, origin);
  }

  return body.action === "escalate" ? handleEscalate(body, origin) : handleChat(body, origin);
});

async function handleEscalate(body: ChatRequestBody, origin: string | null): Promise<Response> {
  const lead = body.lead ?? {};
  if (!lead.contact_name || !lead.contact_email) {
    return jsonResponse({ error: "Name and email are required to reach a human." }, 400, origin);
  }

  const transcript = Array.isArray(body.messages) ? body.messages.slice(0, MAX_MESSAGES) : [];

  await insertLead({
    category: lead.category ?? null,
    specs: lead.specs ?? null,
    contact_name: lead.contact_name,
    contact_email: lead.contact_email,
    contact_company: lead.contact_company ?? null,
    urgency_note: lead.urgency_note ?? null,
    transcript,
    escalated_early: true,
  });

  return jsonResponse({ leadReady: true, lead }, 200, origin);
}

async function handleChat(body: ChatRequestBody, origin: string | null): Promise<Response> {
  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: "messages is required" }, 400, origin);
  }
  if (messages.length > MAX_MESSAGES) {
    return jsonResponse(
      { error: "This conversation has gotten long — please use the contact form instead." },
      400,
      origin,
    );
  }
  if (messages[0]?.role !== "user") {
    return jsonResponse({ error: "First message must be from the user" }, 400, origin);
  }
  for (const m of messages) {
    if (
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length > MAX_MESSAGE_LENGTH ||
      (m.content.length === 0 && !m.images?.length)
    ) {
      return jsonResponse({ error: "Invalid message in conversation" }, 400, origin);
    }
    if (m.images) {
      if (m.role !== "user" || m.images.length > MAX_IMAGES_PER_MESSAGE) {
        return jsonResponse({ error: "Invalid image attachment" }, 400, origin);
      }
      for (const img of m.images) {
        if (
          !ALLOWED_IMAGE_MEDIA_TYPES.has(img.mediaType) ||
          typeof img.data !== "string" ||
          img.data.length === 0 ||
          img.data.length > MAX_IMAGE_BASE64_LENGTH
        ) {
          return jsonResponse({ error: "Invalid image attachment" }, 400, origin);
        }
      }
    }
  }

  const anthropicMessages = messages.map((m) => ({ role: m.role, content: toAnthropicContent(m) }));

  try {
    const first = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 2048,
        ...modelTierParams(),
        system: SYSTEM_PROMPT,
        tools: [SUBMIT_LEAD_TOOL],
        messages: anthropicMessages,
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );

    const toolUse = first.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    if (!toolUse) {
      const text = first.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return jsonResponse(
        { reply: filterPriceLeak(text || "Could you tell me a bit more about what you're looking for?"), leadReady: false },
        200,
        origin,
      );
    }

    const lead = toolUse.input as LeadInput;

    const second = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 768,
        ...modelTierParams(),
        system: SYSTEM_PROMPT,
        messages: [
          ...anthropicMessages,
          { role: "assistant", content: first.content },
          {
            role: "user",
            content: [
              { type: "tool_result", tool_use_id: toolUse.id, content: "Lead recorded successfully." },
            ],
          },
        ],
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );

    const closingText = second.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    const reply = filterPriceLeak(
      closingText || "Thanks — I've noted your inquiry and our team will follow up with a formal quotation.",
    );

    await insertLead({
      category: lead.category ?? null,
      specs: lead.specs ?? null,
      contact_name: lead.contact_name ?? null,
      contact_email: lead.contact_email ?? null,
      contact_company: lead.contact_company ?? null,
      urgency_note: lead.urgency_note ?? null,
      transcript: [...messages, { role: "assistant", content: reply }],
      escalated_early: false,
    });

    return jsonResponse({ reply, leadReady: true, lead }, 200, origin);
  } catch (err) {
    console.error("chat function error", err);
    return jsonResponse(
      { error: "Something went wrong. Please try again or use the contact form." },
      500,
      origin,
    );
  }
}

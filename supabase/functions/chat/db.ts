// Talks to this project's own PostgREST endpoint with the project's secret key.
// Kept as plain `fetch` calls (no @supabase/supabase-js dependency) to keep this
// function's dependency surface small and avoid guessing at a Deno import specifier.

import { SECRET_KEY } from "./keys.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour
const RATE_LIMIT_MAX_PER_WINDOW = 20; // messages per IP per hour

async function restFetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SECRET_KEY,
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function hashKey(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Returns true if the caller is still within the per-IP hourly message budget. */
export async function checkRateLimit(clientIp: string): Promise<boolean> {
  const key = await hashKey(clientIp);
  const res = await restFetch("/rest/v1/rpc/check_and_increment_rate_limit", {
    method: "POST",
    body: JSON.stringify({
      p_key: key,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      p_limit: RATE_LIMIT_MAX_PER_WINDOW,
    }),
  });
  if (!res.ok) {
    // If the rate-limit check itself fails, fail open rather than breaking the chat
    // entirely on a transient DB issue -- but log it so it's visible.
    console.error("rate limit check failed", res.status, await res.text());
    return true;
  }
  return (await res.json()) as boolean;
}

export interface ChatLeadRow {
  category: string | null;
  specs: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_company: string | null;
  urgency_note: string | null;
  transcript: unknown;
  escalated_early: boolean;
}

export async function insertLead(row: ChatLeadRow): Promise<void> {
  const res = await restFetch("/rest/v1/chat_leads", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error("failed to persist chat lead", res.status, await res.text());
  }
}

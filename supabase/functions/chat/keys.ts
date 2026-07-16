// Supabase auto-injects the new-style project keys as JSON dictionaries
// (`{"default": "sb_secret_...", ...}`), not flat strings, plus (for projects that still
// have them) the legacy flat JWT keys. Parse defensively so this works regardless of
// which key system the linked project ends up using.

function parseKeyDict(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.values(parsed).filter((v): v is string => typeof v === "string" && v.length > 0);
  } catch {
    return [];
  }
}

const secretCandidates = [
  ...parseKeyDict(Deno.env.get("SUPABASE_SECRET_KEYS")),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
].filter((v): v is string => Boolean(v));

/** The project's privileged key (bypasses RLS) -- new-style secret key or legacy service_role. */
export const SECRET_KEY = secretCandidates[0] ?? "";

/** Every publishable/anon key configured on this project -- new-style + legacy, for validating inbound requests. */
export const PUBLISHABLE_KEYS = [
  ...parseKeyDict(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")),
  Deno.env.get("SUPABASE_ANON_KEY"),
].filter((v): v is string => Boolean(v));

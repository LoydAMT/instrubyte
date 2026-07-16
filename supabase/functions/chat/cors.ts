const ALLOWED_ORIGINS = new Set([
  "https://www.instrubyte.com.ph",
  "https://instrubyte.com.ph",
]);

// Vite picks whatever port is free (5173, 5174, ...) and `vite preview` does the same
// starting from 4173, so match any localhost/127.0.0.1 port rather than a fixed list.
const LOCALHOST_ORIGIN_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function isAllowedOrigin(origin: string | null): origin is string {
  return Boolean(origin) && (ALLOWED_ORIGINS.has(origin!) || LOCALHOST_ORIGIN_PATTERN.test(origin!));
}

export function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = isAllowedOrigin(origin) ? origin : "https://www.instrubyte.com.ph";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

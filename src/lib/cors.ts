const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "https://mobila-one.vercel.app",
]);

function resolveOrigin(request?: Request) {
  const origin = request?.headers.get("origin") ?? "";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  return "https://mobila-one.vercel.app";
}

export function buildCorsHeaders(request?: Request) {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(request),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export const corsHeaders = buildCorsHeaders();

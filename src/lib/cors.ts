const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mobila-one.vercel.app",
  process.env.ADMIN_URL ?? "",
].filter(Boolean));

function isAllowedOrigin(origin: string) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Allow Vercel preview/prod domains for admin/frontend apps.
  return origin.endsWith(".vercel.app");
}

function resolveOrigin(request?: Request) {
  const origin = request?.headers.get("origin") ?? "";
  if (isAllowedOrigin(origin)) return origin;
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

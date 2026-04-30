const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mobila-one.vercel.app",
  "https://mobila-production.up.railway.app",
  process.env.NEXT_PUBLIC_SITE_URL ?? "",
  process.env.ADMIN_URL ?? "",
].filter(Boolean));

function resolveOrigin(request?: Request): string {
  const origin = request?.headers.get("origin") ?? "";
  if (!origin) return "*";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  if (origin.endsWith(".vercel.app") || origin.endsWith(".railway.app")) return origin;
  return "*";
}

export function buildCorsHeaders(request?: Request) {
  const origin = resolveOrigin(request);
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...(origin !== "*" ? { "Access-Control-Allow-Credentials": "true" } : {}),
    Vary: "Origin",
  };
}

export const corsHeaders = buildCorsHeaders();

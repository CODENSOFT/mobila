const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const RAILWAY_API_URL = "https://mobila-production.up.railway.app";

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return trimTrailingSlash(envUrl.trim());
  }
  return trimTrailingSlash(RAILWAY_API_URL);
}

export function toApiUrl(pathname: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return pathname;
  if (pathname.startsWith("/")) return `${baseUrl}${pathname}`;
  return `${baseUrl}/${pathname}`;
}

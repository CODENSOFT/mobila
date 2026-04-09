const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export function getApiBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  return publicUrl ? trimTrailingSlash(publicUrl) : "";
}

export function toApiUrl(pathname: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return pathname;
  if (pathname.startsWith("/")) return `${baseUrl}${pathname}`;
  return `${baseUrl}/${pathname}`;
}

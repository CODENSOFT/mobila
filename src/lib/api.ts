const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export function getApiBaseUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL ?? "");
}

export function toApiUrl(pathname: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return pathname;
  if (pathname.startsWith("/")) return `${baseUrl}${pathname}`;
  return `${baseUrl}/${pathname}`;
}

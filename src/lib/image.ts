const DEFAULT_IMAGE = "/images/categories/dormitor.png";

function isAbsoluteHttpUrl(value: string) {
  return value.startsWith("https://") || value.startsWith("http://");
}

export function getSafeImageSrc(rawSrc: unknown, fallback = DEFAULT_IMAGE): string {
  if (typeof rawSrc !== "string") return fallback;

  const src = rawSrc.trim();
  if (!src) return fallback;

  if (src.startsWith("/")) {
    const localPath = src.split("?")[0];
    return localPath || fallback;
  }

  if (isAbsoluteHttpUrl(src)) {
    return encodeURI(src);
  }

  return fallback;
}

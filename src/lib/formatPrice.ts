/**
 * Integer price display for MDL. Fixed locales avoid SSR/client hydration mismatches
 * from `toLocaleString()` without arguments (Node vs browser default locale).
 */
export function formatPriceInteger(amount: number, lang: string = "ro"): string {
  const locale = lang === "ru" ? "ru-RU" : "ro-RO";
  return Number(amount).toLocaleString(locale, { maximumFractionDigits: 0 });
}

const DISCOUNT_BADGE: Record<string, string> = {
  ro: "REDUCERE",
  ru: "СКИДКА",
};

export function discountBadgeText(lang: string): string {
  return DISCOUNT_BADGE[lang] ?? DISCOUNT_BADGE.ro;
}

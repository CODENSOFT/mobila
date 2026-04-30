import "server-only";

export type Locale = "ro" | "ru";

export const LOCALES: Locale[] = ["ro", "ru"];
export const DEFAULT_LOCALE: Locale = "ro";

const dictionaries = {
  ro: () => import("./dictionaries/ro.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export type CustomCategory = {
  _id: string;
  key: string;
  label: string;
  grup: string;
  hidden?: boolean;
};

export async function fetchCustomCategories(): Promise<CustomCategory[]> {
  try {
    const res = await fetch("/api/categorii", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (c): c is CustomCategory =>
        c != null &&
        typeof (c as CustomCategory)._id === "string" &&
        typeof (c as CustomCategory).key === "string" &&
        typeof (c as CustomCategory).label === "string" &&
        typeof (c as CustomCategory).grup === "string"
    ).map((c) => ({ ...c, hidden: Boolean((c as { hidden?: unknown }).hidden) }));
  } catch {
    return [];
  }
}

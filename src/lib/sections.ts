export type Section = {
  _id: string;
  title: string;
  image: string;
  ordine: number;
  hidden?: boolean;
};

export async function fetchSections(): Promise<Section[]> {
  try {
    const res = await fetch("/api/sectiuni", { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (s): s is Section =>
          s != null &&
          typeof (s as Section)._id === "string" &&
          typeof (s as Section).title === "string"
      )
      .map((s) => {
        const raw = s as { image?: unknown; ordine?: unknown; hidden?: unknown };
        return {
          _id: s._id,
          title: s.title,
          image: typeof raw.image === "string" ? raw.image : "",
          ordine: typeof raw.ordine === "number" ? raw.ordine : 0,
          hidden: Boolean(raw.hidden),
        };
      });
  } catch {
    return [];
  }
}

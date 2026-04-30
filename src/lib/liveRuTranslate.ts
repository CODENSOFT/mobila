/**
 * Traducere RO→RU în browser, cu cache în memorie + sessionStorage.
 * Folosește /api/translate (Google GTX pe server).
 */

const memory = new Map<string, string>();

function fnv1a32(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function cacheKey(romanian: string): string {
  const t = romanian.trim();
  return `${t.length}:${fnv1a32(t)}`;
}

function readSession(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* quota */
  }
}

export async function translateRoToRuCached(romanian: string): Promise<string | null> {
  const text = romanian.trim();
  if (!text) return "";

  const key = cacheKey(text);
  if (memory.has(key)) {
    return memory.get(key)!;
  }

  const sk = `mobila_tr_ru_${key}`;
  const cached = readSession(sk);
  if (cached != null && cached.length > 0) {
    memory.set(key, cached);
    return cached;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source: "ro", target: "ru" }),
    });
    const data = (await res.json()) as {
      translated?: unknown;
      translation?: unknown;
      error?: string;
    };
    if (!res.ok) {
      console.warn("[liveRuTranslate]", data.error ?? res.status);
      return null;
    }
    const raw = data.translated ?? data.translation;
    const out =
      typeof raw === "string" ? raw.trim() : raw != null ? String(raw).trim() : "";
    if (!out) return null;
    memory.set(key, out);
    writeSession(sk, out);
    return out;
  } catch (e) {
    console.error("[liveRuTranslate]", e);
    return null;
  }
}

/**
 * Traducere prin endpoint-ul public neoficial Google Translate (client=gtx).
 * Nu folosește chei API; poate fi restricționat sau schimbat de Google fără notificare.
 */

export type LocalTranslateOutcome =
  | { ok: true; text: string }
  | { ok: false; error: string };

/** Lungime maximă aproximativă per cerere (URL + encodare). */
const CHUNK = 800;

function chunkByLength(text: string, size: number): string[] {
  if (!text) return [];
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    parts.push(text.slice(i, i + size));
  }
  return parts;
}

function parseGtxResponse(data: unknown): string | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0];
  if (!Array.isArray(first)) return null;
  const pieces: string[] = [];
  for (const item of first) {
    if (Array.isArray(item) && item.length > 0 && typeof item[0] === "string") {
      pieces.push(item[0]);
    }
  }
  if (pieces.length === 0) return null;
  return pieces.join("");
}

async function translateOneChunk(
  chunk: string,
  source: string,
  target: string
): Promise<LocalTranslateOutcome> {
  if (!chunk) {
    return { ok: true, text: "" };
  }

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?" +
      new URLSearchParams({
        client: "gtx",
        sl: source,
        tl: target,
        dt: "t",
        q: chunk,
      }).toString();

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json,text/plain,*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Google Translate a răspuns cu HTTP ${res.status}. Încearcă din nou peste câteva secunde.`,
      };
    }

    const data: unknown = await res.json();
    const out = parseGtxResponse(data);
    if (out == null || out === "") {
      return { ok: false, error: "Răspuns Google Translate neașteptat (structură JSON)." };
    }
    return { ok: true, text: out };
  } catch (err) {
    console.error("[translate:gtx]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: `Traducere eșuată: ${msg}` };
  }
}

export async function translateText(
  text: string,
  source = "ro",
  target = "ru"
): Promise<LocalTranslateOutcome> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: true, text: "" };
  }

  const parts = chunkByLength(trimmed, CHUNK);
  const pieces: string[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 120));
    }
    const r = await translateOneChunk(parts[i]!, source, target);
    if (!r.ok) return r;
    pieces.push(r.text);
  }

  return { ok: true, text: pieces.join("") };
}

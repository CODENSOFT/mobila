import { corsHeaders } from "../../../lib/cors";

const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/k5c7p72wc3kvcd0yptw5wgncf32ijdm5";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return Response.json(
        { message: "Campul 'message' este obligatoriu." },
        { status: 400, headers: corsHeaders }
      );
    }

    const session_id: string =
      typeof body?.session_id === "string" && body.session_id.length > 0
        ? body.session_id
        : crypto.randomUUID();

    console.log("[chat] Trimit la Make.com — mesaj:", message, "session_id:", session_id);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let makeResponse: Response;
    try {
      makeResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mesaj: message, session_id, canal: "website" }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    console.log("[chat] Status HTTP Make.com:", makeResponse.status);

    if (!makeResponse.ok) {
      const errBody = await makeResponse.text();
      console.error("[chat] Make.com error — status:", makeResponse.status, "body:", errBody);
      return Response.json(
        { message: "Eroare la procesarea mesajului." },
        { status: 502, headers: corsHeaders }
      );
    }

    const rawText = await makeResponse.text();
    console.log("[chat] Raw response from Make.com:", rawText);

    const match = rawText.match(
      /"raspuns":\s*"([\s\S]*?)(?=##COMANDA##|"[\s\n]*\})/
    );
    let raspuns: string | null = null;
    if (match && match[1]) {
      raspuns = match[1]
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .trim();
    } else {
      const simpleMatch = rawText.match(/"raspuns":\s*"([^"]+)"/);
      if (simpleMatch && simpleMatch[1]) {
        raspuns = simpleMatch[1].trim();
      }
    }

    console.log("[chat] Raspuns extras:", raspuns);

    if (!raspuns) {
      console.error("[chat] Nu am putut extrage raspunsul. Raw:", rawText);
      return Response.json(
        { error: "Raspuns invalid de la Make.com" },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json({ raspuns, session_id }, { status: 200, headers: corsHeaders });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[chat] Make.com timeout");
      return Response.json(
        { message: "Raspunsul a intarziat. Incearca din nou." },
        { status: 504, headers: corsHeaders }
      );
    }
    console.error("POST /api/chat error:", error);
    return Response.json(
      { message: "A aparut o eroare." },
      { status: 500, headers: corsHeaders }
    );
  }
}

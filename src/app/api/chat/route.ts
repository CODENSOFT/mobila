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

    const rawText = await makeResponse.text();

    if (!makeResponse.ok) {
      console.error("[chat] Make.com error — status:", makeResponse.status, "body:", rawText);
      return Response.json(
        { message: "Eroare la procesarea mesajului." },
        { status: 502, headers: corsHeaders }
      );
    }

    let data: { raspuns?: string };
    try {
      data = JSON.parse(rawText) as { raspuns?: string };
      console.log("[chat] JSON primit de la Make.com:", data);
    } catch (parseError) {
      console.error("[chat] Eroare parsare JSON:", parseError, "body brut:", rawText);
      return Response.json(
        { message: "Raspuns invalid de la Make.com." },
        { status: 502, headers: corsHeaders }
      );
    }

    console.log("[chat] Valoare raspuns extrasă:", data.raspuns);

    return Response.json(
      { response: data.raspuns ?? "", session_id },
      { status: 200, headers: corsHeaders }
    );
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

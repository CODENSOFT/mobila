import { corsHeaders } from "../../../lib/cors";
import { translateText } from "../../../lib/translateLocal";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: string;
      source?: string;
      target?: string;
    };

    const text = typeof body.text === "string" ? body.text : "";
    if (!text.trim()) {
      return Response.json({ error: "Text is required" }, { status: 400, headers: corsHeaders });
    }

    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim() : "ro";
    const target = typeof body.target === "string" && body.target.trim() ? body.target.trim() : "ru";

    const outcome = await translateText(text.trim(), source, target);

    if (outcome.ok === false) {
      return Response.json({ error: outcome.error }, { status: 502, headers: corsHeaders });
    }

    return Response.json(
      { translated: outcome.text, translation: outcome.text },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("POST /api/translate error:", err);
    return Response.json({ error: "Translation failed" }, { status: 500, headers: corsHeaders });
  }
}

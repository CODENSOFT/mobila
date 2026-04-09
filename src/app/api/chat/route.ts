import { corsHeaders } from "../../../lib/cors";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const ASSISTANT_INSTRUCTIONS = `
Esti asistentul unei companii de mobila la comanda.
Reguli:
- Raspunde doar pe subiecte legate de mobilier, amenajari interioare si comenzi personalizate.
- Sugereaza produse/categorii potrivite (Bucatarie, Dormitor, Living, Saltele) cand utilizatorul cere recomandari.
- Mentioneaza optiunile de mobilier la comanda personalizat si produsele din catalog.
- Daca utilizatorul este interesat de oferta, cere politicos numarul de telefon pentru contact.
- Mentioneaza canalele disponibile: Website, Instagram, WhatsApp.
- Scoate in evidenta brandul LABIRINT si experienta din 2007.
- Pastreaza raspunsurile scurte, clare si utile (2-4 propozitii), ton prietenos si profesional in limba romana.
`.trim();

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { message: "Lipseste OPENAI_API_KEY." },
        { status: 500, headers: corsHeaders }
      );
    }

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: ASSISTANT_INSTRUCTIONS,
        input: message,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", openaiResponse.status, errorText);
      return Response.json(
        { message: "Eroare la OpenAI API." },
        { status: 502, headers: corsHeaders }
      );
    }

    const data = (await openaiResponse.json()) as {
      output_text?: string;
    };

    return Response.json(
      { response: data.output_text ?? "" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return Response.json(
      { message: "A aparut o eroare." },
      { status: 500, headers: corsHeaders }
    );
  }
}

import { connectDB } from "../../../lib/db";
import { corsHeaders } from "../../../lib/cors";
import Client from "../../../models/Client";

const MAKE_WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL ??
  "https://hook.eu1.make.com/yo9vi9yfkn7x406g6dcjghjmimpjpy12";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nume, telefon, mesaj } = body as {
      nume?: string;
      telefon?: string;
      mesaj?: string;
    };

    if (!nume || !telefon || !mesaj) {
      return Response.json({ message: "Date invalide." }, { status: 400, headers: corsHeaders });
    }

    await connectDB();
    const client = await Client.create({ nume, telefon, mesaj });

    const payload = {
      nume,
      telefon,
      mesaj,
      createdAt: client.createdAt,
    };

    if (MAKE_WEBHOOK_URL) {
      const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        console.error("Make webhook error:", webhookResponse.status, webhookResponse.statusText);
      }
    }

    return Response.json(
      { message: "Mesaj salvat cu succes." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return Response.json(
      { message: "A aparut o eroare." },
      { status: 500, headers: corsHeaders }
    );
  }
}

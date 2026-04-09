import { connectDB } from "../../../lib/db";
import { corsHeaders } from "../../../lib/cors";
import Client from "../../../models/Client";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    await connectDB();
    const clienti = await Client.find().sort({ createdAt: -1 }).lean();

    return Response.json(clienti, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/clienti error:", error);
    return Response.json(
      { message: "Nu s-au putut incarca clientii." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { nume, telefon, mesaj } = body as {
      nume?: string;
      telefon?: string;
      mesaj?: string;
    };

    if (!nume || !telefon || !mesaj) {
      return Response.json({ message: "Date invalide." }, { status: 400, headers: corsHeaders });
    }

    const status = body?.status;
    const allowedStatuses = ["new", "contacted", "closed"];

    const client = await Client.create({
      nume,
      telefon,
      mesaj,
      status: allowedStatuses.includes(status) ? status : "new",
    });
    return Response.json(client, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("POST /api/clienti error:", error);
    return Response.json(
      { message: "Nu s-a putut crea clientul." },
      { status: 500, headers: corsHeaders }
    );
  }
}

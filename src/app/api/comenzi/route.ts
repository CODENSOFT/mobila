import { isValidObjectId, Types } from "mongoose";

import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import { sendOrderConfirmation } from "@/src/lib/email/sendOrderConfirmation";
import Order from "@/src/models/Order";
import Product from "@/src/models/Product";

type CreateOrderBody = {
  client: {
    prenume: string;
    nume: string;
    email: string;
    telefon: string;
    strada: string;
    numar: string;
    oras: string;
    judet: string;
    codPostal: string;
  };
  produse: Array<{
    id: string;
    nume: string;
    imagine: string;
    pret: number;
    cantitate: number;
    slug: string;
  }>;
  subtotal: number;
  transport: number;
  reducere: number;
  total: number;
  codReducere?: string;
  metodaPlata: "card" | "ramburs" | "transfer";
  metodaLivrare: "standard" | "express" | "showroom";
  nota?: string;
};

function orderNumberFromCount(count: number) {
  const year = new Date().getFullYear();
  return `#ORD-${year}-${String(count + 1).padStart(4, "0")}`;
}

type LooseOrderBody = Partial<CreateOrderBody> & {
  nume?: string;
  telefon?: string;
  adresa?: string;
  email?: string;
  oras?: string;
  judet?: string;
  codPostal?: string;
};

function normalizeOrderBody(body: LooseOrderBody): CreateOrderBody | null {
  if (!Array.isArray(body.produse) || body.produse.length === 0) return null;

  const hasClientObject = !!body.client;
  const client = hasClientObject
    ? body.client
    : {
        prenume: "",
        nume: body.nume ?? "",
        email: body.email ?? "no-reply@labirint.local",
        telefon: body.telefon ?? "",
        strada: body.adresa ?? "",
        numar: "-",
        oras: body.oras ?? "Chișinău",
        judet: body.judet ?? "Chișinău",
        codPostal: body.codPostal ?? "MD-2001",
      };

  if (!client || !client.nume || !client.telefon) {
    return null;
  }

  const subtotal = Number(body.subtotal ?? body.total ?? 0);
  const transport = Number(body.transport ?? 0);
  const reducere = Number(body.reducere ?? 0);
  const total = Number(body.total ?? subtotal + transport - reducere);
  if (!Number.isFinite(total) || total <= 0) return null;

  const normalizedProducts = body.produse.map((p) => ({
    id: p.id ?? "",
    nume: p.nume ?? "Produs",
    imagine: p.imagine ?? "/images/categories/dormitor.png",
    pret: Number(p.pret ?? 0),
    cantitate: Number(p.cantitate ?? 1),
    slug: p.slug ?? "",
  }));

  return {
    client,
    produse: normalizedProducts,
    subtotal,
    transport,
    reducere,
    total,
    codReducere: body.codReducere ?? "",
    metodaPlata: body.metodaPlata ?? "ramburs",
    metodaLivrare: body.metodaLivrare ?? "standard",
    nota: body.nota ?? "",
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !isValidObjectId(id)) {
      return Response.json(
        { message: "ID comandă invalid." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }
    const comanda = await Order.findById(id).lean();
    if (!comanda) {
      return Response.json(
        { message: "Comanda nu a fost găsită." },
        { status: 404, headers: buildCorsHeaders(request) }
      );
    }
    return Response.json(comanda, { headers: buildCorsHeaders(request) });
  } catch (error) {
    console.error("GET /api/comenzi error", error);
    return Response.json(
      { message: "Eroare server." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return Response.json(
        { message: "Body JSON invalid." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    console.log("[orders] req.body:", rawBody);
    const body = normalizeOrderBody(rawBody as LooseOrderBody);

    if (!body || !body.client || !Array.isArray(body.produse) || body.produse.length === 0) {
      return Response.json(
        { message: "Date incomplete" },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    const productIds = body.produse
      .map((p) => p.id)
      .filter((id) => isValidObjectId(id))
      .map((id) => new Types.ObjectId(id));

    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    const byId = new Map(dbProducts.map((p) => [String(p._id), p]));

    for (const item of body.produse) {
      if (!isValidObjectId(item.id)) continue;
      const db = byId.get(item.id);
      if (!db) {
        return Response.json(
          { message: `Produs indisponibil: ${item.nume}` },
          { status: 409, headers: buildCorsHeaders(request) }
        );
      }
      const stock = Number((db as { stoc?: unknown }).stoc);
      if (Number.isFinite(stock) && stock < item.cantitate) {
        return Response.json(
          {
            message: `Stoc insuficient pentru ${item.nume}. Disponibil: ${stock}.`,
            productId: item.id,
          },
          { status: 409, headers: buildCorsHeaders(request) }
        );
      }
    }

    if (body.metodaPlata === "card") {
      const timeout = Math.random() < 0.03;
      if (timeout) {
        return Response.json(
          { message: "Timeout la procesarea plății cu cardul. Te rugăm să reîncerci." },
          { status: 408, headers: buildCorsHeaders(request) }
        );
      }
    }

    const count = await Order.countDocuments();
    const orderNumber = orderNumberFromCount(count);

    const created = await Order.create({
      orderNumber,
      client: {
        nume: `${body.client.prenume} ${body.client.nume}`.trim(),
        email: body.client.email,
        telefon: body.client.telefon,
        adresa: `${body.client.strada} ${body.client.numar}`.trim(),
        oras: body.client.oras,
        judet: body.client.judet,
        codPostal: body.client.codPostal,
      },
      produse: body.produse.map((item) => ({
        produsId: isValidObjectId(item.id) ? new Types.ObjectId(item.id) : undefined,
        nume: item.nume,
        imagine: item.imagine,
        pret: item.pret,
        cantitate: item.cantitate,
      })),
      subtotal: body.subtotal,
      transport: body.transport,
      reducere: body.reducere,
      total: body.total,
      codReducere: body.codReducere ?? "",
      metodaPlata: body.metodaPlata,
      metodaLivrare: body.metodaLivrare,
      notaInterna: body.nota ?? "",
      status: "noua",
      statusHistory: [{ status: "noua", changedAt: new Date(), changedBy: "Sistem" }],
      updatedAt: new Date(),
    });

    await sendOrderConfirmation({
      orderNumber: created.orderNumber,
      client: body.client,
      produse: body.produse.map((item) => ({
        nume: item.nume,
        cantitate: item.cantitate,
        pret: item.pret,
      })),
      total: body.total,
      metodaLivrare: body.metodaLivrare,
    });

    return Response.json(
      { ok: true, id: String(created._id), orderNumber: created.orderNumber },
      { status: 201, headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    console.error("POST /api/comenzi error", error);
    return Response.json(
      { message: "Eroare server" },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

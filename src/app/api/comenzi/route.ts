import { isValidObjectId, Types } from "mongoose";

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

export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id || !isValidObjectId(id)) {
    return Response.json({ message: "ID comandă invalid." }, { status: 400 });
  }
  const comanda = await Order.findById(id).lean();
  if (!comanda) {
    return Response.json({ message: "Comanda nu a fost găsită." }, { status: 404 });
  }
  return Response.json(comanda);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json()) as CreateOrderBody;

    if (!body.client || !Array.isArray(body.produse) || body.produse.length === 0) {
      return Response.json({ message: "Date comandă invalide." }, { status: 400 });
    }

    const productIds = body.produse
      .map((p) => p.id)
      .filter((id) => isValidObjectId(id))
      .map((id) => new Types.ObjectId(id));

    const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
    const byId = new Map(dbProducts.map((p) => [String(p._id), p]));

    for (const item of body.produse) {
      const db = byId.get(item.id);
      if (!db) {
        return Response.json(
          { message: `Produs indisponibil: ${item.nume}` },
          { status: 409 }
        );
      }
      const stock = Number((db as { stoc?: unknown }).stoc);
      if (Number.isFinite(stock) && stock < item.cantitate) {
        return Response.json(
          {
            message: `Stoc insuficient pentru ${item.nume}. Disponibil: ${stock}.`,
            productId: item.id,
          },
          { status: 409 }
        );
      }
    }

    if (body.metodaPlata === "card") {
      const timeout = Math.random() < 0.03;
      if (timeout) {
        return Response.json(
          { message: "Timeout la procesarea plății cu cardul. Te rugăm să reîncerci." },
          { status: 408 }
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
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/comenzi error", error);
    return Response.json(
      { message: "A apărut o eroare. Te rugăm să încerci din nou." },
      { status: 500 }
    );
  }
}

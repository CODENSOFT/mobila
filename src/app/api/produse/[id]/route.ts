import { isValidObjectId } from "mongoose";

import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID produs invalid." }, { status: 400 });
    }

    const body = (await request.json()) as {
      nume?: string;
      descriere?: string;
      pret?: number;
      categorie?: string;
      imagineUrl?: string;
    };

    if (
      typeof body.nume !== "string" ||
      typeof body.descriere !== "string" ||
      typeof body.pret !== "number" ||
      typeof body.categorie !== "string" ||
      typeof body.imagineUrl !== "string"
    ) {
      return Response.json({ message: "Date invalide." }, { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        nume: body.nume.trim(),
        descriere: body.descriere.trim(),
        pret: body.pret,
        categorie: body.categorie.trim(),
        imagine: body.imagineUrl.trim(),
      },
      { new: true }
    ).lean();

    if (!updated) {
      return Response.json({ message: "Produsul nu a fost gasit." }, { status: 404 });
    }

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/produse/[id] error:", error);
    return Response.json({ message: "Nu s-a putut actualiza produsul." }, { status: 500 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID produs invalid." }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return Response.json({ message: "Produsul nu a fost gasit." }, { status: 404 });
    }

    return Response.json({ message: "Produs sters cu succes." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/produse/[id] error:", error);
    return Response.json({ message: "Nu s-a putut sterge produsul." }, { status: 500 });
  }
}

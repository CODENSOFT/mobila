import { isValidObjectId } from "mongoose";
import { revalidatePath } from "next/cache";

import { uploadImageToCloudinary } from "../../../../lib/cloudinary";
import { corsHeaders } from "../../../../lib/cors";

export const maxDuration = 60;
import { connectDB } from "../../../../lib/db";
import Product from "../../../../models/Product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return Response.json(
        { message: "ID produs invalid." },
        { status: 400, headers: corsHeaders }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";

    let nume = "";
    let numeRu = "";
    let descriere = "";
    let descriereRu = "";
    let pret = NaN;
    let categorie = "";
    let imagineUrl = "";
    let areReducere = false;
    let pretReducere: number | null = null;
    let procentReducere: number | null = null;
    let imagini: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const get = (k: string) => { const v = formData.get(k); return typeof v === "string" ? v : ""; };
      nume = get("nume");
      numeRu = get("nume_ru");
      descriere = get("descriere");
      descriereRu = get("descriere_ru");
      pret = Number(get("pret"));
      categorie = get("categorie");
      imagineUrl = get("imagineUrl");
      areReducere = get("areReducere") === "true";
      const pr = get("pretReducere"); if (pr) pretReducere = areReducere ? Number(pr) : null;
      const pcr = get("procentReducere"); if (pcr) procentReducere = areReducere ? Number(pcr) : null;

      const imaginiFiles = formData.getAll("imagini") as File[];
      const imaginiUrls = (formData.getAll("imaginiUrls") as string[]).filter((u) => u.trim());
      for (const file of imaginiFiles) {
        if (file instanceof File && file.size > 0 && file.name !== "undefined") {
          imagini.push(await uploadImageToCloudinary(file));
        }
      }
      imagini.push(...imaginiUrls);
    } else {
      const body = (await request.json()) as {
        nume?: string; nume_ru?: string; descriere?: string; descriere_ru?: string;
        pret?: number; categorie?: string; imagineUrl?: string;
        areReducere?: boolean; pretReducere?: number; procentReducere?: number;
        imagini?: string[];
      };

      if (
        typeof body.nume !== "string" ||
        typeof body.descriere !== "string" ||
        typeof body.pret !== "number" ||
        typeof body.categorie !== "string" ||
        typeof body.imagineUrl !== "string"
      ) {
        return Response.json({ message: "Date invalide." }, { status: 400, headers: corsHeaders });
      }

      nume = body.nume;
      numeRu = typeof body.nume_ru === "string" ? body.nume_ru : "";
      descriere = body.descriere;
      descriereRu = typeof body.descriere_ru === "string" ? body.descriere_ru : "";
      pret = body.pret;
      categorie = body.categorie;
      imagineUrl = body.imagineUrl;
      areReducere = body.areReducere === true;
      pretReducere = areReducere && typeof body.pretReducere === "number" ? body.pretReducere : null;
      procentReducere = areReducere && typeof body.procentReducere === "number" ? body.procentReducere : null;
      imagini = Array.isArray(body.imagini) ? body.imagini.filter((u) => typeof u === "string" && u.trim()) : [];
    }

    console.info("[PUT /api/produse]", { id, areReducere, pretReducere, procentReducere, imaginiCount: imagini.length });

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          nume: nume.trim(),
          nume_ru: numeRu.trim(),
          descriere: descriere.trim(),
          descriere_ru: descriereRu.trim(),
          pret,
          categorie: categorie.trim(),
          imagine: imagineUrl.trim(),
          areReducere,
          pretReducere,
          procentReducere,
          imagini: imagini.length > 0 ? imagini : undefined,
        },
      },
      { new: true, strict: false }
    ).lean();

    if (!updated) {
      return Response.json(
        { message: "Produsul nu a fost gasit." },
        { status: 404, headers: corsHeaders }
      );
    }

    revalidatePath("/", "layout");
    return Response.json(updated, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("PUT /api/produse/[id] error:", error);
    return Response.json(
      { message: "Nu s-a putut actualiza produsul." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return Response.json(
        { message: "ID produs invalid." },
        { status: 400, headers: corsHeaders }
      );
    }

    const deleted = await Product.findByIdAndDelete(id).lean();

    if (!deleted) {
      return Response.json(
        { message: "Produsul nu a fost gasit." },
        { status: 404, headers: corsHeaders }
      );
    }

    revalidatePath("/", "layout");
    return Response.json(
      { message: "Produs sters cu succes." },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("DELETE /api/produse/[id] error:", error);
    return Response.json(
      { message: "Nu s-a putut sterge produsul." },
      { status: 500, headers: corsHeaders }
    );
  }
}

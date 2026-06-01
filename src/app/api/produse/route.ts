import { isValidObjectId, Types, type PipelineStage } from "mongoose";
import { revalidatePath } from "next/cache";

import { uploadImageToCloudinary } from "../../../lib/cloudinary";
import { corsHeaders } from "../../../lib/cors";

export const maxDuration = 60;
import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";

const parseLimit = (raw: string | null, fallback: number, max: number) => {
  const n = raw === null ? NaN : Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
};

function normalizeUtf8Text(value: string): string {
  return Buffer.from(value, "utf8").toString("utf8");
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    console.info("[api/produse] GET called:", request.url);
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      if (!isValidObjectId(id)) {
        return Response.json(
          { message: "Produs invalid." },
          { status: 400, headers: corsHeaders }
        );
      }

      const produs = await Product.findById(id).lean();

      if (!produs) {
        return Response.json(
          { message: "Produsul nu a fost gasit." },
          { status: 404, headers: corsHeaders }
        );
      }

      return Response.json(produs, { status: 200, headers: corsHeaders });
    }

    if (searchParams.has("distinctSets")) {
      try {
        const docs = await Product.find({ set: { $exists: true } })
          .select("set")
          .lean<{ set?: unknown }[]>();
        const sets = [
          ...new Set(
            docs
              .map((d) => (typeof d.set === "string" ? d.set.trim() : ""))
              .filter((s) => s !== "")
          ),
        ].sort();
        return Response.json(sets, { status: 200, headers: corsHeaders });
      } catch {
        return Response.json([], { status: 200, headers: corsHeaders });
      }
    }

    const categorieParam = searchParams.get("categorie");
    const limitParam = searchParams.get("limit");
    const excludeParam = searchParams.get("exclude");

    if (categorieParam !== null || limitParam !== null || excludeParam !== null) {
      const limit = parseLimit(limitParam, 20, 50);
      const excludeId =
        excludeParam && isValidObjectId(excludeParam)
          ? new Types.ObjectId(excludeParam)
          : null;

      const baseMatch: Record<string, unknown> = {};
      if (excludeId) {
        baseMatch._id = { $ne: excludeId };
      }

      const sameCat = categorieParam?.trim() ?? "";
      const pipeline: PipelineStage[] = [];

      if (sameCat) {
        pipeline.push({
          $facet: {
            sameCategory: [
              { $match: { ...baseMatch, categorie: sameCat } },
              { $sort: { createdAt: -1 } },
              { $limit: limit },
            ],
            otherCategories: [
              { $match: { ...baseMatch, categorie: { $ne: sameCat } } },
              { $sort: { createdAt: -1 } },
              { $limit: limit },
            ],
          },
        });
        pipeline.push({
          $project: {
            merged: {
              $concatArrays: ["$sameCategory", "$otherCategories"],
            },
          },
        });
        pipeline.push({ $unwind: "$merged" });
        pipeline.push({ $replaceRoot: { newRoot: "$merged" } });
        pipeline.push({
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
          },
        });
        pipeline.push({ $replaceRoot: { newRoot: "$doc" } });
        pipeline.push({ $limit: limit });
      } else {
        pipeline.push({ $match: baseMatch });
        pipeline.push({ $sort: { createdAt: -1 } });
        pipeline.push({ $limit: limit });
      }

      const produse = await Product.aggregate(pipeline);
      console.info("[api/produse] Returned products (filtered):", produse.length);
      return Response.json(produse, { status: 200, headers: corsHeaders });
    }

    const produse = await Product.find().lean();
    console.info("[api/produse] Returned products:", produse.length);

    return Response.json(produse, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/produse error:", error);
    return Response.json(
      { message: "Nu s-au putut incarca produsele." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get("content-type") ?? "";

    let nume = "";
    let nume_ru = "";
    let descriere = "";
    let descriere_ru = "";
    let categorie = "";
    let pretNumber = NaN;
    let finalImageUrl = "";
    let areReducere = false;
    let pretReducereNumber = NaN;
    let procentReducereNumber = NaN;
    let imaginiFinale: string[] = [];
    let setNume = "";
    let grupNume = "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        nume?: string;
        nume_ru?: string;
        descriere?: string;
        descriere_ru?: string;
        pret?: number;
        categorie?: string;
        imagineUrl?: string;
        areReducere?: boolean;
        pretReducere?: number;
        procentReducere?: number;
        imagini?: string[];
        set?: string;
        grup?: string;
      };

      nume = typeof body.nume === "string" ? body.nume : "";
      nume_ru =
        typeof body.nume_ru === "string" ? normalizeUtf8Text(body.nume_ru) : "";
      descriere = typeof body.descriere === "string" ? body.descriere : "";
      descriere_ru =
        typeof body.descriere_ru === "string"
          ? normalizeUtf8Text(body.descriere_ru)
          : "";
      categorie = typeof body.categorie === "string" ? body.categorie : "";
      pretNumber = typeof body.pret === "number" ? body.pret : NaN;
      finalImageUrl = typeof body.imagineUrl === "string" ? body.imagineUrl.trim() : "";
      areReducere = body.areReducere === true;
      pretReducereNumber = typeof body.pretReducere === "number" ? body.pretReducere : NaN;
      procentReducereNumber = typeof body.procentReducere === "number" ? body.procentReducere : NaN;
      imaginiFinale = Array.isArray(body.imagini) ? body.imagini.filter((u) => typeof u === "string" && u.trim()) : [];
      setNume = typeof body.set === "string" ? body.set.trim() : "";
      grupNume = typeof body.grup === "string" ? body.grup.trim() : "";
    } else {
      const formData = await request.formData();

      const numeValue = formData.get("nume");
      const numeRuValue = formData.get("nume_ru");
      const descriereValue = formData.get("descriere");
      const descriereRuValue = formData.get("descriere_ru");
      const pretValue = formData.get("pret");
      const categorieValue = formData.get("categorie");
      const imagine = formData.get("imagine");
      const imagineUrl = formData.get("imagineUrl");

      nume = typeof numeValue === "string" ? numeValue : "";
      nume_ru =
        typeof numeRuValue === "string" ? normalizeUtf8Text(numeRuValue) : "";
      descriere = typeof descriereValue === "string" ? descriereValue : "";
      descriere_ru =
        typeof descriereRuValue === "string"
          ? normalizeUtf8Text(descriereRuValue)
          : "";
      categorie = typeof categorieValue === "string" ? categorieValue : "";
      pretNumber = typeof pretValue === "string" ? Number(pretValue) : NaN;

      const hasFile =
        imagine instanceof File && imagine.size > 0 && imagine.name !== "undefined";
      const hasImageUrl = typeof imagineUrl === "string" && imagineUrl.trim().length > 0;

      if (hasFile && imagine instanceof File) {
        finalImageUrl = await uploadImageToCloudinary(imagine);
      } else if (hasImageUrl && typeof imagineUrl === "string") {
        finalImageUrl = imagineUrl.trim();
      }

      const areReducereValue = formData.get("areReducere");
      areReducere = areReducereValue === "true";
      const pretReducereValue = formData.get("pretReducere");
      pretReducereNumber = typeof pretReducereValue === "string" && pretReducereValue ? Number(pretReducereValue) : NaN;
      const procentReducereValue = formData.get("procentReducere");
      procentReducereNumber = typeof procentReducereValue === "string" && procentReducereValue ? Number(procentReducereValue) : NaN;

      const setValue = formData.get("set");
      setNume = typeof setValue === "string" ? setValue.trim() : "";
      const grupValue = formData.get("grup");
      grupNume = typeof grupValue === "string" ? grupValue.trim() : "";

      const imaginiFiles = formData.getAll("imagini") as File[];
      const imaginiUrls = (formData.getAll("imaginiUrls") as string[]).filter((u) => typeof u === "string" && u.trim());
      for (const file of imaginiFiles) {
        if (file instanceof File && file.size > 0 && file.name !== "undefined") {
          const uploaded = await uploadImageToCloudinary(file);
          imaginiFinale.push(uploaded);
        }
      }
      imaginiFinale.push(...imaginiUrls);
    }

    if (
      !nume.trim() ||
      !descriere.trim() ||
      !categorie.trim() ||
      Number.isNaN(pretNumber)
    ) {
      return Response.json({ message: "Date invalide." }, { status: 400, headers: corsHeaders });
    }

    if (!finalImageUrl) {
      return Response.json(
        { message: "Adauga o imagine (fisier sau URL)." },
        { status: 400, headers: corsHeaders }
      );
    }

    const numeRuFinala = normalizeUtf8Text(nume_ru.trim());
    const descriereRuFinala = normalizeUtf8Text(descriere_ru.trim());

    const pretReducereFinal = areReducere && Number.isFinite(pretReducereNumber) ? pretReducereNumber : null;
    const procentReducereFinal = areReducere && Number.isFinite(procentReducereNumber) ? procentReducereNumber : null;

    console.info("[POST /api/produse] creating", { setNume, areReducere });

    const created = await Product.create({
      nume: nume.trim(),
      ...(numeRuFinala ? { nume_ru: numeRuFinala } : {}),
      descriere: descriere.trim(),
      ...(descriereRuFinala ? { descriere_ru: descriereRuFinala } : {}),
      pret: pretNumber,
      categorie: categorie.trim(),
      imagine: finalImageUrl,
      ...(imaginiFinale.length > 0 ? { imagini: imaginiFinale } : {}),
      areReducere,
      pretReducere: pretReducereFinal,
      procentReducere: procentReducereFinal,
    });

    // CRITICAL: Set the `set` and `grup` fields via raw MongoDB collection,
    // bypassing Mongoose entirely. This guarantees the fields are saved
    // even if the cached schema is stale or strict mode interferes.
    const extraFields: Record<string, unknown> = {};
    if (setNume) extraFields.set = setNume;
    if (grupNume) extraFields.grup = grupNume;
    if (Object.keys(extraFields).length > 0) {
      await Product.collection.updateOne(
        { _id: created._id },
        { $set: { ...extraFields, updatedAt: new Date() } }
      );
      console.info("[POST /api/produse] extra fields saved via raw collection", { id: String(created._id), extraFields });
    }

    // Read back via raw collection too, to confirm the persisted state
    const finalDoc = await Product.collection.findOne({ _id: created._id });

    revalidatePath("/", "layout");
    return Response.json(finalDoc ?? created, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("POST /api/produse error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Missing Cloudinary env vars")
    ) {
      return Response.json(
        {
          message:
            "Cloudinary nu este configurat. Completeaza CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY si CLOUDINARY_API_SECRET sau foloseste un URL de imagine.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "http_code" in error &&
      Number((error as { http_code?: unknown }).http_code) === 401
    ) {
      return Response.json(
        {
          message:
            "Configurare Cloudinary invalida (401). Verifica CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY si CLOUDINARY_API_SECRET in .env.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      { message: "Nu s-a putut crea produsul." },
      { status: 500, headers: corsHeaders }
    );
  }
}

import { isValidObjectId, Types, type PipelineStage } from "mongoose";

import { uploadImageToCloudinary } from "../../../lib/cloudinary";
import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";

const parseLimit = (raw: string | null, fallback: number, max: number) => {
  const n = raw === null ? NaN : Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
};

const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";

const corsHeaders = (origin: string | null) => {
  const isAllowed =
    Boolean(origin) &&
    (origin === allowedOrigin || origin?.endsWith(".vercel.app") === true);

  return {
    "Access-Control-Allow-Origin": isAllowed ? (origin as string) : allowedOrigin || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
};

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: Request) {
  try {
    const origin = request.headers.get("origin");
    console.info("[api/produse] GET called:", request.url);
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      if (!isValidObjectId(id)) {
        return Response.json({ message: "Produs invalid." }, { status: 400 });
      }

      const produs = await Product.findById(id).lean();

      if (!produs) {
        return Response.json(
          { message: "Produsul nu a fost gasit." },
          { status: 404 }
        );
      }

      return Response.json(produs, { status: 200, headers: corsHeaders(origin) });
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
      return Response.json(produse, { status: 200, headers: corsHeaders(origin) });
    }

    const produse = await Product.find().lean();
    console.info("[api/produse] Returned products:", produse.length);

    return Response.json(produse, { status: 200, headers: corsHeaders(origin) });
  } catch (error) {
    console.error("GET /api/produse error:", error);
    return Response.json(
      { message: "Nu s-au putut incarca produsele." },
      { status: 500, headers: corsHeaders(request.headers.get("origin")) }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const contentType = request.headers.get("content-type") ?? "";

    let nume = "";
    let descriere = "";
    let categorie = "";
    let pretNumber = NaN;
    let finalImageUrl = "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        nume?: string;
        descriere?: string;
        pret?: number;
        categorie?: string;
        imagineUrl?: string;
      };

      nume = typeof body.nume === "string" ? body.nume : "";
      descriere = typeof body.descriere === "string" ? body.descriere : "";
      categorie = typeof body.categorie === "string" ? body.categorie : "";
      pretNumber = typeof body.pret === "number" ? body.pret : NaN;
      finalImageUrl = typeof body.imagineUrl === "string" ? body.imagineUrl.trim() : "";
    } else {
      const formData = await request.formData();

      const numeValue = formData.get("nume");
      const descriereValue = formData.get("descriere");
      const pretValue = formData.get("pret");
      const categorieValue = formData.get("categorie");
      const imagine = formData.get("imagine");
      const imagineUrl = formData.get("imagineUrl");

      nume = typeof numeValue === "string" ? numeValue : "";
      descriere = typeof descriereValue === "string" ? descriereValue : "";
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
    }

    if (
      !nume.trim() ||
      !descriere.trim() ||
      !categorie.trim() ||
      Number.isNaN(pretNumber)
    ) {
      return Response.json({ message: "Date invalide." }, { status: 400 });
    }

    if (!finalImageUrl) {
      return Response.json(
        { message: "Adauga o imagine (fisier sau URL)." },
        { status: 400 }
      );
    }

    const produs = await Product.create({
      nume: nume.trim(),
      descriere: descriere.trim(),
      pret: pretNumber,
      categorie: categorie.trim(),
      imagine: finalImageUrl,
    });

    return Response.json(produs, { status: 201 });
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
        { status: 400 }
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
        { status: 400 }
      );
    }

    return Response.json(
      { message: "Nu s-a putut crea produsul." },
      { status: 500 }
    );
  }
}

import { isValidObjectId } from "mongoose";

import { PRODUCT_CATEGORY_GROUPS } from "../../../constants/categories";
import { corsHeaders } from "../../../lib/cors";
import { connectDB } from "../../../lib/db";
import CustomCategory from "../../../models/CustomCategory";
import Product from "../../../models/Product";
import SectionModel from "../../../models/Section";

export const dynamic = "force-dynamic";

// Default fallback images for the seeded sections (mirror /produse SectionCards).
const DEFAULT_SECTION_IMAGES: Record<string, string> = {
  "PENTRU DORMITOR": "/images/categories/dormitor.png",
  "SALTELE ȘI TOPPERE": "/images/categories/dormitor.png",
  "PENTRU BUCĂTĂRIE": "/images/categories/bucatarii.png",
  "PENTRU LIVING": "/images/categories/mese.png",
  "PENTRU HOL": "/images/categories/dulapuri.png",
};

let seedingDoneInThisInstance = false;

// Seed the Section collection once from the hardcoded groups if it is empty,
// preserving their original order.
async function ensureSeeded() {
  if (seedingDoneInThisInstance) return;
  try {
    const count = await SectionModel.estimatedDocumentCount();
    if (count === 0) {
      const docs = PRODUCT_CATEGORY_GROUPS.map((g, idx) => ({
        title: g.title,
        image: DEFAULT_SECTION_IMAGES[g.title] ?? "",
        ordine: idx,
        hidden: false,
      }));
      await SectionModel.insertMany(docs, { ordered: false });
      console.info("[sectiuni ensureSeeded] inserted", docs.length, "sections");
    }
  } catch (e) {
    console.warn("[sectiuni ensureSeeded] warning", e);
  }
  seedingDoneInThisInstance = true;
}

function serialize(d: {
  _id: unknown;
  title: string;
  image?: string;
  ordine?: number;
  hidden?: boolean;
}) {
  return {
    _id: String(d._id),
    title: d.title,
    image: typeof d.image === "string" ? d.image : "",
    ordine: typeof d.ordine === "number" ? d.ordine : 0,
    hidden: Boolean(d.hidden),
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    await connectDB();
    await ensureSeeded();
    const docs = await SectionModel.find().sort({ ordine: 1, title: 1 }).lean();
    return Response.json(docs.map(serialize), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/sectiuni error:", error);
    return Response.json([], { status: 200, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await ensureSeeded();
    const body = (await request.json().catch(() => ({}))) as {
      action?: unknown;
      id?: unknown;
      title?: unknown;
      image?: unknown;
      hidden?: unknown;
      orderedIds?: unknown;
    };

    const action = typeof body.action === "string" ? body.action : "create";
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : undefined;
    const hidden = typeof body.hidden === "boolean" ? body.hidden : undefined;

    // ===== REORDER =====
    if (action === "reorder") {
      const orderedIds = Array.isArray(body.orderedIds)
        ? body.orderedIds.filter((x): x is string => typeof x === "string" && isValidObjectId(x))
        : [];
      if (orderedIds.length === 0) {
        return Response.json({ message: "orderedIds invalid." }, { status: 400, headers: corsHeaders });
      }
      await Promise.all(
        orderedIds.map((oid, idx) => SectionModel.updateOne({ _id: oid }, { $set: { ordine: idx } }))
      );
      return Response.json({ ok: true, updated: orderedIds.length }, { status: 200, headers: corsHeaders });
    }

    // ===== DELETE =====
    if (action === "delete") {
      if (!id || !isValidObjectId(id)) {
        return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
      }
      const existing = await SectionModel.findById(id).lean();
      if (!existing) {
        return Response.json({ message: "Secțiune inexistentă." }, { status: 404, headers: corsHeaders });
      }
      // Block deletion while categories still reference this section, to avoid
      // orphaning them. Admin must move/remove categories first.
      const inUse = await CustomCategory.countDocuments({ grup: existing.title, hidden: { $ne: true } });
      if (inUse > 0) {
        return Response.json(
          { message: `Secțiunea conține ${inUse} categorii. Mută-le sau șterge-le mai întâi.` },
          { status: 400, headers: corsHeaders }
        );
      }
      await SectionModel.deleteOne({ _id: id });
      return Response.json({ ok: true }, { status: 200, headers: corsHeaders });
    }

    // ===== UPDATE (rename / image / hidden) =====
    if (action === "update") {
      if (!id || !isValidObjectId(id)) {
        return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
      }
      const existing = await SectionModel.findById(id).lean();
      if (!existing) {
        return Response.json({ message: "Secțiune inexistentă." }, { status: 404, headers: corsHeaders });
      }
      const update: Record<string, unknown> = {};
      if (typeof body.title === "string") {
        if (!title) {
          return Response.json({ message: "Titlul nu poate fi gol." }, { status: 400, headers: corsHeaders });
        }
        update.title = title;
      }
      if (image !== undefined) update.image = image;
      if (hidden !== undefined) update.hidden = hidden;

      // Rename cascade: keep categories and products pointing at this section.
      if (update.title && update.title !== existing.title) {
        const dup = await SectionModel.findOne({ title: update.title }).lean();
        if (dup) {
          return Response.json({ message: "Există deja o secțiune cu acest nume." }, { status: 400, headers: corsHeaders });
        }
        await Promise.all([
          CustomCategory.updateMany({ grup: existing.title }, { $set: { grup: update.title } }),
          Product.updateMany({ grup: existing.title }, { $set: { grup: update.title } }),
        ]);
      }

      const updated = await SectionModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
      return Response.json(serialize(updated!), { status: 200, headers: corsHeaders });
    }

    // ===== CREATE =====
    if (!title) {
      return Response.json({ message: "Titlul este obligatoriu." }, { status: 400, headers: corsHeaders });
    }
    const existing = await SectionModel.findOne({ title }).lean();
    if (existing) {
      return Response.json(serialize(existing), { status: 200, headers: corsHeaders });
    }
    const last = await SectionModel.find().sort({ ordine: -1 }).limit(1).lean();
    const nextOrdine = last.length > 0 && typeof last[0].ordine === "number" ? last[0].ordine + 1 : 0;
    const created = await SectionModel.create({
      title,
      image: image ?? "",
      ordine: nextOrdine,
      hidden: false,
    });
    return Response.json(serialize(created.toObject()), { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("POST /api/sectiuni error:", error);
    const message = error instanceof Error ? error.message : "Operațiunea a eșuat.";
    return Response.json({ message }, { status: 500, headers: corsHeaders });
  }
}

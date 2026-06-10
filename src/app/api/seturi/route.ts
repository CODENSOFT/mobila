import { isValidObjectId } from "mongoose";

import { corsHeaders } from "../../../lib/cors";
import { connectDB } from "../../../lib/db";
import SetModel from "../../../models/Set";

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (key) {
      const doc = await SetModel.findOne({ key: key.trim() }).lean();
      if (!doc) {
        return Response.json({ message: "Set inexistent." }, { status: 404, headers: corsHeaders });
      }
      return Response.json(
        {
          _id: String(doc._id),
          key: doc.key,
          nume: doc.nume,
          nume_ru: doc.nume_ru ?? "",
          descriere: doc.descriere ?? "",
          descriere_ru: doc.descriere_ru ?? "",
          imagine: doc.imagine ?? "",
          imagini: Array.isArray(doc.imagini) ? doc.imagini : [],
        },
        { status: 200, headers: corsHeaders }
      );
    }
    const docs = await SetModel.find().sort({ nume: 1 }).lean();
    return Response.json(
      docs.map((d) => ({
        _id: String(d._id),
        key: d.key,
        nume: d.nume,
        nume_ru: d.nume_ru ?? "",
        descriere: d.descriere ?? "",
        descriere_ru: d.descriere_ru ?? "",
        imagine: d.imagine ?? "",
        imagini: Array.isArray(d.imagini) ? d.imagini : [],
      })),
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error("GET /api/seturi error:", e);
    return Response.json([], { status: 200, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json().catch(() => ({}))) as {
      action?: unknown;
      id?: unknown;
      key?: unknown;
      nume?: unknown;
      nume_ru?: unknown;
      descriere?: unknown;
      descriere_ru?: unknown;
      imagine?: unknown;
      imagini?: unknown;
    };
    const action = typeof body.action === "string" ? body.action : "upsert";
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const keyParam = typeof body.key === "string" ? body.key.trim() : "";

    if (action === "delete") {
      if (id) {
        if (!isValidObjectId(id)) {
          return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
        }
        await SetModel.deleteOne({ _id: id });
        return Response.json({ ok: true }, { status: 200, headers: corsHeaders });
      }
      if (keyParam) {
        await SetModel.deleteOne({ key: keyParam });
        return Response.json({ ok: true }, { status: 200, headers: corsHeaders });
      }
      return Response.json({ message: "Trimite id sau key." }, { status: 400, headers: corsHeaders });
    }

    // upsert (create or update)
    const update: Record<string, unknown> = {};
    if (typeof body.nume === "string") update.nume = body.nume.trim();
    if (typeof body.nume_ru === "string") update.nume_ru = body.nume_ru.trim();
    if (typeof body.descriere === "string") update.descriere = body.descriere;
    if (typeof body.descriere_ru === "string") update.descriere_ru = body.descriere_ru;
    if (typeof body.imagine === "string") update.imagine = body.imagine.trim();
    if (Array.isArray(body.imagini)) {
      update.imagini = body.imagini.filter((x): x is string => typeof x === "string");
    }

    if (id) {
      if (!isValidObjectId(id)) {
        return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
      }
      const updated = await SetModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
      if (!updated) {
        return Response.json({ message: "Set inexistent." }, { status: 404, headers: corsHeaders });
      }
      return Response.json(
        { _id: String(updated._id), key: updated.key, ...update },
        { status: 200, headers: corsHeaders }
      );
    }
    if (!keyParam) {
      return Response.json({ message: "Trimite key pentru creare." }, { status: 400, headers: corsHeaders });
    }
    if (!update.nume) update.nume = keyParam;
    const upserted = await SetModel.findOneAndUpdate(
      { key: keyParam },
      { $set: update, $setOnInsert: { key: keyParam } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    return Response.json(
      { _id: String(upserted._id), key: upserted.key, ...update },
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error("POST /api/seturi error:", e);
    const message = e instanceof Error ? e.message : "Eroare.";
    return Response.json({ message }, { status: 500, headers: corsHeaders });
  }
}

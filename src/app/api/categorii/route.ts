import { isValidObjectId } from "mongoose";

import { PRODUCT_CATEGORY_GROUPS } from "../../../constants/categories";
import { corsHeaders } from "../../../lib/cors";
import { connectDB } from "../../../lib/db";
import CustomCategory from "../../../models/CustomCategory";

// Ensure every hardcoded default category exists in DB.
// Same key may appear in multiple groups (e.g. "Dulapuri" in DORMITOR + LIVING + HOL).
// `insertMany` with `ordered: false` skips duplicates (per compound unique key+grup).
async function ensureSeeded() {
  // Explicitly drop the OLD single-key unique index ("key_1") if it still exists.
  // It blocks inserting the same key in different groups.
  try {
    await CustomCategory.collection.dropIndex("key_1");
    console.info("[ensureSeeded] dropped legacy key_1 unique index");
  } catch {
    // Index does not exist — fine
  }

  // Reconcile indexes against schema (creates compound (key, grup) unique).
  try {
    await CustomCategory.syncIndexes();
  } catch (e) {
    console.warn("[ensureSeeded] syncIndexes warning", e);
  }

  const docs: { key: string; label: string; grup: string; hidden: boolean; ordine: number }[] = [];
  let counter = 0;
  for (const group of PRODUCT_CATEGORY_GROUPS) {
    for (const key of group.items) {
      docs.push({ key, label: key, grup: group.title, hidden: false, ordine: counter++ });
    }
  }
  if (docs.length === 0) return;
  try {
    await CustomCategory.insertMany(docs, { ordered: false });
    console.info("[ensureSeeded] inserted up to", docs.length, "categories");
  } catch {
    // Duplicate key errors are expected and harmless with ordered:false
  }
}

export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    await connectDB();
    await ensureSeeded();
    // Return ALL records (including hidden). Sidebar/form filters hidden on their side;
    // admin CategoryManager needs to see hidden ones to offer restore.
    const docs = await CustomCategory.find().sort({ grup: 1, ordine: 1, label: 1 }).lean();
    const items = docs.map((d) => ({
      _id: String(d._id),
      key: d.key,
      label: d.label,
      grup: d.grup,
      hidden: Boolean(d.hidden),
      ordine: typeof d.ordine === "number" ? d.ordine : 0,
    }));
    return Response.json(items, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("GET /api/categorii error:", error);
    return Response.json([], { status: 200, headers: corsHeaders });
  }
}

/**
 * Unified POST endpoint that handles all admin actions on categories.
 * Body must contain { action: "create" | "update" | "delete" | "restore" }
 * + the relevant payload. We consolidate everything through POST because
 * many edge/proxy setups strip bodies from DELETE/PUT requests.
 */
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json().catch(() => ({}))) as {
      action?: unknown;
      id?: unknown;
      key?: unknown;
      label?: unknown;
      grup?: unknown;
      hidden?: unknown;
      orderedIds?: unknown;
    };

    const action = typeof body.action === "string" ? body.action : "create";
    const id = typeof body.id === "string" ? body.id.trim() : "";
    const keyParam = typeof body.key === "string" ? body.key.trim() : "";
    const labelParam = typeof body.label === "string" ? body.label.trim() : "";
    const grupParam = typeof body.grup === "string" ? body.grup.trim() : "";
    const hiddenParam = typeof body.hidden === "boolean" ? body.hidden : undefined;

    console.info("[POST /api/categorii]", { action, id, keyParam, labelParam, grupParam, hiddenParam });

    // ===== RESET ALL (wipe collection and re-seed from hardcoded list) =====
    if (action === "reset-all") {
      try {
        await CustomCategory.collection.drop();
      } catch {
        // Collection may not exist — fine
      }
      try {
        await CustomCategory.collection.dropIndex("key_1");
      } catch {
        // Legacy index might not exist — fine
      }
      try {
        await CustomCategory.syncIndexes();
      } catch (e) {
        console.warn("[reset-all] syncIndexes warning", e);
      }
      const seedDocs: { key: string; label: string; grup: string; hidden: boolean }[] = [];
      for (const group of PRODUCT_CATEGORY_GROUPS) {
        for (const key of group.items) {
          seedDocs.push({ key, label: key, grup: group.title, hidden: false });
        }
      }
      const inserted = await CustomCategory.insertMany(seedDocs, { ordered: false });
      return Response.json(
        { ok: true, inserted: inserted.length },
        { status: 200, headers: corsHeaders }
      );
    }

    // ===== REORDER (update `ordine` for a batch of categories) =====
    // Body: { action: "reorder", orderedIds: ["id1", "id2", ...] }
    // Assigns ordine = 0, 1, 2, ... based on the order of the IDs.
    if (action === "reorder") {
      const orderedIds = Array.isArray(body.orderedIds)
        ? body.orderedIds.filter((x): x is string => typeof x === "string" && isValidObjectId(x))
        : [];
      if (orderedIds.length === 0) {
        return Response.json(
          { message: "orderedIds invalid sau gol." },
          { status: 400, headers: corsHeaders }
        );
      }
      await Promise.all(
        orderedIds.map((oid, idx) =>
          CustomCategory.updateOne({ _id: oid }, { $set: { ordine: idx } })
        )
      );
      return Response.json({ ok: true, updated: orderedIds.length }, { status: 200, headers: corsHeaders });
    }

    // ===== DELETE (hard delete — remove from DB completely) =====
    if (action === "delete") {
      if (id) {
        if (!isValidObjectId(id)) {
          return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
        }
        await CustomCategory.deleteOne({ _id: id });
        return Response.json({ ok: true, deleted: id }, { status: 200, headers: corsHeaders });
      }
      if (keyParam) {
        const filter: Record<string, unknown> = { key: keyParam };
        if (grupParam) filter.grup = grupParam;
        const result = await CustomCategory.deleteMany(filter);
        return Response.json(
          { ok: true, deletedCount: result.deletedCount ?? 0 },
          { status: 200, headers: corsHeaders }
        );
      }
      return Response.json(
        { message: "Trimite id sau key pentru ștergere." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ===== HARD DELETE (only for completely removing a record — used for cleanup) =====
    if (action === "hard-delete") {
      if (!id || !isValidObjectId(id)) {
        return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
      }
      const deleted = await CustomCategory.findByIdAndDelete(id).lean();
      if (!deleted) {
        return Response.json(
          { message: "Categoria nu a fost găsită." },
          { status: 404, headers: corsHeaders }
        );
      }
      return Response.json({ ok: true, deleted: String(deleted._id) }, { status: 200, headers: corsHeaders });
    }

    // ===== RESTORE =====
    if (action === "restore") {
      if (!id || !isValidObjectId(id)) {
        return Response.json({ message: "ID invalid pentru restaurare." }, { status: 400, headers: corsHeaders });
      }
      const updated = await CustomCategory.findByIdAndUpdate(
        id,
        { $set: { hidden: false } },
        { new: true }
      ).lean();
      if (!updated) {
        return Response.json(
          { message: "Categoria nu a fost găsită." },
          { status: 404, headers: corsHeaders }
        );
      }
      return Response.json(
        {
          _id: String(updated._id),
          key: updated.key,
          label: updated.label,
          grup: updated.grup,
          hidden: false,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // ===== UPDATE =====
    if (action === "update") {
      if (!labelParam || !grupParam) {
        return Response.json(
          { message: "Eticheta și grupul sunt obligatorii." },
          { status: 400, headers: corsHeaders }
        );
      }
      const updateOp: Record<string, unknown> = { label: labelParam, grup: grupParam, hidden: false };

      if (id) {
        if (!isValidObjectId(id)) {
          return Response.json({ message: "ID invalid." }, { status: 400, headers: corsHeaders });
        }
        const updated = await CustomCategory.findByIdAndUpdate(
          id,
          { $set: updateOp },
          { new: true }
        ).lean();
        if (!updated) {
          return Response.json(
            { message: "Categoria nu a fost găsită." },
            { status: 404, headers: corsHeaders }
          );
        }
        return Response.json(
          {
            _id: String(updated._id),
            key: updated.key,
            label: updated.label,
            grup: updated.grup,
            hidden: Boolean(updated.hidden),
          },
          { status: 200, headers: corsHeaders }
        );
      }
      if (keyParam) {
        const upserted = await CustomCategory.findOneAndUpdate(
          { key: keyParam },
          { $set: updateOp, $setOnInsert: { key: keyParam } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        ).lean();
        return Response.json(
          {
            _id: String(upserted._id),
            key: upserted.key,
            label: upserted.label,
            grup: upserted.grup,
            hidden: Boolean(upserted.hidden),
          },
          { status: 200, headers: corsHeaders }
        );
      }
      return Response.json(
        { message: "Trimite id sau key pentru update." },
        { status: 400, headers: corsHeaders }
      );
    }

    // ===== CREATE (default, idempotent — never returns 4xx) =====
    const finalKey = keyParam || labelParam;
    const finalLabel = labelParam || keyParam;
    const finalGrup = grupParam || PRODUCT_CATEGORY_GROUPS[0].title;

    if (!finalKey) {
      return Response.json(
        { message: "Trimite cel puțin o denumire." },
        { status: 400, headers: corsHeaders }
      );
    }

    // STEP 1: aggressively clean up any leftover unique indexes that don't include `grup`.
    // These block the new (key, grup) compound uniqueness model.
    try {
      const indexes = await CustomCategory.collection.indexes();
      for (const idx of indexes) {
        if (idx.name === "_id_") continue;
        const keys = Object.keys(idx.key ?? {});
        // Drop any unique index that's NOT the compound (key, grup) we want
        const isCompoundKeyGrup =
          keys.length === 2 && keys.includes("key") && keys.includes("grup");
        if (idx.unique && !isCompoundKeyGrup) {
          try {
            await CustomCategory.collection.dropIndex(idx.name as string);
            console.info("[CREATE] dropped legacy unique index", idx.name);
          } catch (e) {
            console.warn("[CREATE] failed dropping index", idx.name, e);
          }
        }
      }
    } catch (e) {
      console.warn("[CREATE] could not list indexes", e);
    }

    // STEP 2: ensure the compound index exists
    try {
      await CustomCategory.collection.createIndex({ key: 1, grup: 1 }, { unique: true });
    } catch (e) {
      console.warn("[CREATE] createIndex warning", e);
    }

    // STEP 3: find existing by (key, grup) — explicit check, no race with index
    const existing = await CustomCategory.findOne({ key: finalKey, grup: finalGrup }).lean();
    if (existing) {
      const updated = await CustomCategory.findByIdAndUpdate(
        existing._id,
        { $set: { label: finalLabel, hidden: false } },
        { new: true }
      ).lean();
      return Response.json(
        {
          _id: String(updated!._id),
          key: updated!.key,
          label: updated!.label,
          grup: updated!.grup,
          hidden: Boolean(updated!.hidden),
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // STEP 4: insert new (append to end of group based on max ordine).
    const lastInGroup = await CustomCategory.find({ grup: finalGrup })
      .sort({ ordine: -1 })
      .limit(1)
      .lean();
    const nextOrdine = lastInGroup.length > 0 && typeof lastInGroup[0].ordine === "number"
      ? lastInGroup[0].ordine + 1
      : 0;
    try {
      const created = await CustomCategory.create({
        key: finalKey,
        label: finalLabel,
        grup: finalGrup,
        hidden: false,
        ordine: nextOrdine,
      });
      return Response.json(
        {
          _id: String(created._id),
          key: created.key,
          label: created.label,
          grup: created.grup,
          hidden: false,
        },
        { status: 201, headers: corsHeaders }
      );
    } catch (e) {
      const isDup =
        (e as { code?: number })?.code === 11000 ||
        (e instanceof Error && /E11000|duplicate key/i.test(e.message));
      if (isDup) {
        const after = await CustomCategory.findOne({ key: finalKey, grup: finalGrup }).lean();
        if (after) {
          return Response.json(
            {
              _id: String(after._id),
              key: after.key,
              label: after.label,
              grup: after.grup,
              hidden: Boolean(after.hidden),
            },
            { status: 200, headers: corsHeaders }
          );
        }
      }
      throw e;
    }
  } catch (error) {
    console.error("POST /api/categorii error:", error);
    const message = error instanceof Error ? error.message : "Operațiunea a eșuat.";
    return Response.json({ message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const body = (await request.json().catch(() => ({}))) as {
      id?: unknown;
      key?: unknown;
      label?: unknown;
      grup?: unknown;
      hidden?: unknown;
    };
    // Accept id/key from body first (avoids URL encoding issues with diacritics),
    // then fall back to query params.
    const bodyId = typeof body.id === "string" ? body.id.trim() : "";
    const bodyKey = typeof body.key === "string" ? body.key.trim() : "";
    const id = bodyId || (searchParams.get("id") ?? "").trim();
    const keyParam = bodyKey || (searchParams.get("key") ?? "").trim();

    const labelGiven = typeof body.label === "string";
    const grupGiven = typeof body.grup === "string";
    const hiddenGiven = typeof body.hidden === "boolean";
    const label = labelGiven ? (body.label as string).trim() : "";
    const grup = grupGiven ? (body.grup as string).trim() : "";

    // Build $set dynamically — supports restoring (hidden:false) without re-sending label/grup
    const update: Record<string, unknown> = {};
    if (labelGiven) {
      if (!label) {
        return Response.json(
          { message: "Eticheta nu poate fi goală." },
          { status: 400, headers: corsHeaders }
        );
      }
      update.label = label;
    }
    if (grupGiven) {
      if (!grup) {
        return Response.json(
          { message: "Grupul nu poate fi gol." },
          { status: 400, headers: corsHeaders }
        );
      }
      update.grup = grup;
    }
    if (hiddenGiven) {
      update.hidden = body.hidden as boolean;
    } else if (labelGiven || grupGiven) {
      // Editing implicitly un-hides
      update.hidden = false;
    }

    if (Object.keys(update).length === 0) {
      return Response.json(
        { message: "Nu există modificări." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Edit by id (existing CustomCategory)
    if (id) {
      if (!isValidObjectId(id)) {
        return Response.json(
          { message: "ID invalid." },
          { status: 400, headers: corsHeaders }
        );
      }
      const updated = await CustomCategory.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true }
      ).lean();
      if (!updated) {
        return Response.json(
          { message: "Categoria nu a fost găsită." },
          { status: 404, headers: corsHeaders }
        );
      }
      return Response.json(
        {
          _id: String(updated._id),
          key: updated.key,
          label: updated.label,
          grup: updated.grup,
          hidden: Boolean(updated.hidden),
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // Override hardcoded by key (upsert). Requires label + grup on first creation.
    if (keyParam) {
      const key = keyParam.trim();
      if (!key) {
        return Response.json(
          { message: "Cheia este obligatorie." },
          { status: 400, headers: corsHeaders }
        );
      }
      // For upsert to satisfy required schema fields when creating new, ensure label/grup exist.
      const onInsert: Record<string, unknown> = { key };
      if (!labelGiven) onInsert.label = key;
      if (!grupGiven) onInsert.grup = "PENTRU DORMITOR";
      const upserted = await CustomCategory.findOneAndUpdate(
        { key },
        { $set: update, $setOnInsert: onInsert },
        { new: true, upsert: true }
      ).lean();
      return Response.json(
        {
          _id: String(upserted._id),
          key: upserted.key,
          label: upserted.label,
          grup: upserted.grup,
          hidden: Boolean(upserted.hidden),
        },
        { status: 200, headers: corsHeaders }
      );
    }

    return Response.json(
      { message: "Trimite id sau key în query." },
      { status: 400, headers: corsHeaders }
    );
  } catch (error) {
    console.error("PUT /api/categorii error:", error);
    return Response.json(
      { message: "Nu s-a putut actualiza categoria." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Read from both query and body (body takes priority). Diacritics in keys
    // can get mangled in URLs on some hosting setups, so the JSON body is the
    // primary path.
    let bodyId = "";
    let bodyKey = "";
    let bodyHard = false;
    try {
      const ct = request.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        const body = (await request.json()) as { id?: unknown; key?: unknown; hard?: unknown };
        if (typeof body.id === "string") bodyId = body.id.trim();
        if (typeof body.key === "string") bodyKey = body.key.trim();
        if (typeof body.hard === "boolean") bodyHard = body.hard;
      }
    } catch {
      // No body or malformed — fall back to query params
    }

    const id = bodyId || (searchParams.get("id") ?? "").trim();
    const keyParam = bodyKey || (searchParams.get("key") ?? "").trim();
    const hard = bodyHard || searchParams.get("hard") === "1";

    console.info("[DELETE /api/categorii]", { id, keyParam, hard, src: bodyId || bodyKey ? "body" : "query" });

    // Branch 1: by id (existing DB record)
    if (id) {
      if (!isValidObjectId(id)) {
        return Response.json(
          { message: "ID invalid." },
          { status: 400, headers: corsHeaders }
        );
      }

      if (hard) {
        const deleted = await CustomCategory.findByIdAndDelete(id).lean();
        if (!deleted) {
          return Response.json(
            { message: "Categoria nu a fost găsită." },
            { status: 404, headers: corsHeaders }
          );
        }
        return Response.json({ ok: true, hard: true }, { status: 200, headers: corsHeaders });
      }

      const updated = await CustomCategory.findByIdAndUpdate(
        id,
        { $set: { hidden: true } },
        { new: true }
      ).lean();
      if (!updated) {
        return Response.json(
          { message: "Categoria nu a fost găsită." },
          { status: 404, headers: corsHeaders }
        );
      }
      return Response.json(
        {
          _id: String(updated._id),
          key: updated.key,
          label: updated.label,
          grup: updated.grup,
          hidden: true,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // Branch 2: by key (soft-delete hardcoded categories via upsert)
    if (keyParam) {
      const upserted = await CustomCategory.findOneAndUpdate(
        { key: keyParam },
        {
          $set: { hidden: true },
          $setOnInsert: { key: keyParam, label: keyParam, grup: "PENTRU DORMITOR" },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      return Response.json(
        {
          _id: String(upserted._id),
          key: upserted.key,
          label: upserted.label,
          grup: upserted.grup,
          hidden: true,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    return Response.json(
      { message: "Trimite id sau key în query." },
      { status: 400, headers: corsHeaders }
    );
  } catch (error) {
    console.error("DELETE /api/categorii error:", error);
    const message = error instanceof Error ? error.message : "Nu s-a putut șterge categoria.";
    return Response.json({ message }, { status: 500, headers: corsHeaders });
  }
}

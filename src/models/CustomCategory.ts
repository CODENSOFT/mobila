import mongoose, { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const customCategorySchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    grup: { type: String, required: true, trim: true, index: true },
    hidden: { type: Boolean, default: false, index: true },
    ordine: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Uniqueness is per (key + grup) — same key allowed in different groups
// (e.g. "Dulapuri" in both PENTRU DORMITOR and PENTRU LIVING).
customCategorySchema.index({ key: 1, grup: 1 }, { unique: true });

export type CustomCategoryDocument = InferSchemaType<typeof customCategorySchema>;

// Bust cache only when the schema actually differs. Use mongoose.deleteModel
// (instead of `delete models[name]`) so the schema's compiled state resets too.
try {
  const cached = models.CustomCategory;
  if (cached?.schema) {
    const hasHidden = Boolean(cached.schema.path("hidden"));
    const hasOrdine = Boolean(cached.schema.path("ordine"));
    let hasCompound = false;
    try {
      const idxs = cached.schema.indexes();
      hasCompound = idxs.some((entry: unknown) => {
        if (!Array.isArray(entry) || entry.length === 0) return false;
        const def = entry[0];
        if (def == null || typeof def !== "object") return false;
        const keys = Object.keys(def as Record<string, unknown>);
        return keys.length === 2 && keys.includes("key") && keys.includes("grup");
      });
    } catch {
      hasCompound = false;
    }
    if (!hasHidden || !hasCompound || !hasOrdine) {
      try {
        mongoose.deleteModel("CustomCategory");
      } catch {
        // already deleted or doesn't exist — ignore
      }
    }
  }
} catch {
  // ignore — if introspection fails, leave cache as-is
}

const CustomCategory =
  (models.CustomCategory as Model<CustomCategoryDocument> | undefined) ??
  model<CustomCategoryDocument>("CustomCategory", customCategorySchema);

export default CustomCategory;

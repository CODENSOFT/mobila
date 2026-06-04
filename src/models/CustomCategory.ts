import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const customCategorySchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    grup: { type: String, required: true, trim: true, index: true },
    hidden: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Uniqueness is per (key + grup) — same key allowed in different groups
// (e.g. "Dulapuri" in both PENTRU DORMITOR and PENTRU LIVING).
customCategorySchema.index({ key: 1, grup: 1 }, { unique: true });

export type CustomCategoryDocument = InferSchemaType<typeof customCategorySchema>;

// Always recreate the cached model on import — schema changed (compound unique
// instead of single-key unique). Mongoose's syncIndexes() in the API will reconcile
// the actual MongoDB indexes.
if (models.CustomCategory) {
  delete (models as Record<string, unknown>).CustomCategory;
}

const CustomCategory =
  (models.CustomCategory as Model<CustomCategoryDocument> | undefined) ??
  model<CustomCategoryDocument>("CustomCategory", customCategorySchema);

export default CustomCategory;

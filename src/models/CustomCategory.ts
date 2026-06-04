import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const customCategorySchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    grup: { type: String, required: true, trim: true, index: true },
    hidden: { type: Boolean, default: false, index: true },
    ordine: { type: Number, default: 0, index: true },
  },
  { timestamps: true, strict: false }
);

// Compound unique: same key allowed in different groups
customCategorySchema.index({ key: 1, grup: 1 }, { unique: true });

export type CustomCategoryDocument = InferSchemaType<typeof customCategorySchema>;

const CustomCategory =
  (models.CustomCategory as Model<CustomCategoryDocument> | undefined) ??
  model<CustomCategoryDocument>("CustomCategory", customCategorySchema);

export default CustomCategory;

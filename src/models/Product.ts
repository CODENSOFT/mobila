import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    nume: { type: String, required: true, trim: true },
    nume_ru: { type: String, trim: true },
    descriere: { type: String, required: true, trim: true },
    descriere_ru: { type: String, trim: true },
    pret: { type: Number, required: true },
    imagine: { type: String, required: true, trim: true },
    imagini: { type: [String], default: undefined },
    categorie: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, sparse: true },
    areReducere: { type: Boolean, default: false },
    pretReducere: { type: Number },
    procentReducere: { type: Number },
    set: { type: String, trim: true, index: true },
    grup: { type: String, trim: true, index: true },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

if (
  models.Product &&
  (!models.Product.schema.path("set") || !models.Product.schema.path("grup"))
) {
  delete (models as Record<string, unknown>).Product;
}

const Product =
  (models.Product as Model<ProductDocument> | undefined) ??
  model<ProductDocument>("Product", productSchema);

export default Product;

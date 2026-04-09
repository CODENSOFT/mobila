import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    nume: { type: String, required: true, trim: true },
    descriere: { type: String, required: true, trim: true },
    pret: { type: Number, required: true },
    imagine: { type: String, required: true, trim: true },
    imagini: { type: [String], default: undefined },
    categorie: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, sparse: true },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

const Product =
  (models.Product as Model<ProductDocument> | undefined) ??
  model<ProductDocument>("Product", productSchema);

export default Product;

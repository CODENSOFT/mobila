import { model, models, Schema, type InferSchemaType } from "mongoose";

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

const Product = models.Product || model("Product", productSchema);

export default Product;

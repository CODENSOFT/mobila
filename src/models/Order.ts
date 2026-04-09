import { model, models, Schema, type InferSchemaType, type Types } from "mongoose";

const orderProductSchema = new Schema(
  {
    produsId: { type: Schema.Types.ObjectId, ref: "Product" },
    nume: { type: String, required: true, trim: true },
    imagine: { type: String, required: true, trim: true },
    pret: { type: Number, required: true, min: 0 },
    cantitate: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["noua", "procesata", "expediata", "livrata", "anulata"],
      required: true,
    },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, default: "Admin" },
    awb: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, required: true, trim: true },
    client: {
      nume: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      telefon: { type: String, required: true, trim: true },
      adresa: { type: String, required: true, trim: true },
      oras: { type: String, required: true, trim: true },
      judet: { type: String, required: true, trim: true },
      codPostal: { type: String, required: true, trim: true },
    },
    produse: { type: [orderProductSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    transport: { type: Number, required: true, min: 0, default: 0 },
    reducere: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    codReducere: { type: String, default: "" },
    metodaPlata: {
      type: String,
      enum: ["card", "ramburs", "transfer"],
      required: true,
    },
    metodaLivrare: {
      type: String,
      enum: ["standard", "express", "showroom"],
      default: "standard",
      required: true,
    },
    status: {
      type: String,
      enum: ["noua", "procesata", "expediata", "livrata", "anulata"],
      default: "noua",
      index: true,
    },
    plataStatus: {
      type: String,
      enum: ["platit", "in_asteptare", "esuat"],
      default: "in_asteptare",
    },
    notaInterna: { type: String, default: "" },
    awb: { type: String, default: "" },
    statusHistory: { type: [statusHistorySchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Types.ObjectId;
};

const Order = models.Order || model("Order", orderSchema);

export default Order;

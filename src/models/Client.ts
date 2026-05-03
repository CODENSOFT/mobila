import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const clientSchema = new Schema({
  nume: { type: String, required: true, trim: true },
  telefon: { type: String, required: true, trim: true },
  mesaj: { type: String, required: true, trim: true },
  /** `formular_contact` = pagina Contact „Solicită o ofertă”; `panou_admin` = adăugat din API/admin. */
  sursa: {
    type: String,
    enum: ["formular_contact", "panou_admin"],
    default: "formular_contact",
  },
  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export type ClientDocument = InferSchemaType<typeof clientSchema>;

const Client =
  (models.Client as Model<ClientDocument> | undefined) ??
  model<ClientDocument>("Client", clientSchema);

export default Client;

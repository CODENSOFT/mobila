import { model, models, Schema, type InferSchemaType } from "mongoose";

const clientSchema = new Schema({
  nume: { type: String, required: true, trim: true },
  telefon: { type: String, required: true, trim: true },
  mesaj: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export type ClientDocument = InferSchemaType<typeof clientSchema>;

const Client = models.Client || model("Client", clientSchema);

export default Client;

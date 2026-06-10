import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const setSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, unique: true },
    nume: { type: String, required: true, trim: true },
    nume_ru: { type: String, trim: true },
    descriere: { type: String, default: "" },
    descriere_ru: { type: String, default: "" },
    imagine: { type: String, default: "" },
    imagini: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type SetDocument = InferSchemaType<typeof setSchema>;

const SetModel =
  (models.Set as Model<SetDocument> | undefined) ??
  model<SetDocument>("Set", setSchema);

export default SetModel;

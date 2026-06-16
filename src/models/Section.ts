import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

// A "section" (secțiune) groups categories on the catalog, e.g. "PENTRU DORMITOR".
// Previously these were hardcoded in src/constants/categories.ts; now they are
// editable from the admin panel and drive the /produse catalog.
const sectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    image: { type: String, default: "" },
    ordine: { type: Number, default: 0, index: true },
    hidden: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export type SectionDocument = InferSchemaType<typeof sectionSchema>;

const SectionModel =
  (models.Section as Model<SectionDocument> | undefined) ??
  model<SectionDocument>("Section", sectionSchema);

export default SectionModel;

import { model, models, Schema, type InferSchemaType, type Model } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    expressDeliveryPrice: { type: Number, required: true, default: 50, min: 0 },
    topProductIds: { type: [String], default: undefined },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;

const SiteSettings =
  (models.SiteSettings as Model<SiteSettingsDocument> | undefined) ??
  model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);

export default SiteSettings;

import { v2 as cloudinary } from "cloudinary";

export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "mobila-site/produse";

  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return Response.json({ signature, timestamp, cloudName, apiKey, folder });
}

import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureCloudinaryConfigured() {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  configured = true;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  ensureCloudinaryConfigured();
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "mobila-site/produse",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    upload.end(buffer);
  });
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) throw new Error("Nu s-a putut semna upload-ul.");

  const { signature, timestamp, cloudName, apiKey, folder } =
    (await signRes.json()) as {
      signature: string;
      timestamp: number;
      cloudName: string;
      apiKey: string;
      folder: string;
    };

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body }
  );

  if (!res.ok) throw new Error("Upload la Cloudinary a eșuat.");
  const data = (await res.json()) as { secure_url?: string };
  if (!data.secure_url) throw new Error("Upload la Cloudinary a eșuat: URL lipsă.");
  return data.secure_url;
}

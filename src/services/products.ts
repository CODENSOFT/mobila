import { headers } from "next/headers";

import { getApiBaseUrl } from "../lib/api";
import { connectDB } from "../lib/db";
import ProductModel from "../models/Product";
import SiteSettings from "../models/SiteSettings";
import type { Product } from "../types/product";

async function getBaseUrl() {
  const apiBaseUrl = getApiBaseUrl();
  if (apiBaseUrl) {
    return apiBaseUrl;
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return null;
  }

  return `${protocol}://${host}`;
}

export async function getAllProducts(): Promise<Product[]> {
  const baseUrl = await getBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const response = await fetch(`${baseUrl}/api/produse`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }

  return (await response.json()) as Product[];
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => !p.areReducere).slice(0, limit);
}

export async function getDiscountedProducts(limit = 6): Promise<Product[]> {
  const products = await getAllProducts();
  return products
    .filter((p) => p.areReducere && typeof p.pretReducere === "number")
    .slice(0, limit);
}

export async function getTopProducts(): Promise<Product[]> {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne({ key: "produse-top" }).lean();
    const ids: string[] = Array.isArray(settings?.topProductIds) ? settings.topProductIds : [];
    if (ids.length === 0) return [];

    const docs = await ProductModel.find({ _id: { $in: ids } }).lean();
    const byId = new Map(docs.map((d) => [String(d._id), d]));

    return ids
      .map((id) => byId.get(id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined)
      .map((d) => ({ ...d, _id: String(d._id) } as unknown as Product));
  } catch {
    return [];
  }
}

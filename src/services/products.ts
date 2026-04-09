import { headers } from "next/headers";

import type { Product } from "../types/product";

async function getBaseUrl() {
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
  return products.slice(0, limit);
}

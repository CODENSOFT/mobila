import { connectDB } from "../lib/db";
import ProductModel from "../models/Product";
import SiteSettings from "../models/SiteSettings";
import type { Product } from "../types/product";

function docToProduct(d: Record<string, unknown>): Product {
  return { ...d, _id: String(d._id) } as unknown as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    await connectDB();
    // Select only fields needed by the products listing page — skips heavy
    // ones like `descriere_ru`, full image arrays for cards we don't render.
    const docs = await ProductModel.find()
      .select(
        "nume nume_ru pret imagine categorie areReducere pretReducere procentReducere set grup"
      )
      .lean();
    return docs.map(docToProduct);
  } catch (err) {
    console.error("[getAllProducts]", err);
    return [];
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne({ key: "produse-noi" }).lean<{ featuredProductIds?: string[] }>();
    const ids: string[] = Array.isArray(settings?.featuredProductIds) ? settings.featuredProductIds : [];

    if (ids.length > 0) {
      const docs = await ProductModel.find({ _id: { $in: ids } }).lean();
      const byId = new Map(docs.map((d) => [String(d._id), d]));
      return ids
        .map((id) => byId.get(id))
        .filter((d): d is NonNullable<typeof d> => d !== undefined)
        .slice(0, limit)
        .map(docToProduct);
    }

    const docs = await ProductModel.find({ areReducere: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    if (docs.length > 0) return docs.map(docToProduct);

    // Fallback: all products if none are non-discounted
    const all = await ProductModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    return all.map(docToProduct);
  } catch (err) {
    console.error("[getFeaturedProducts]", err);
    return [];
  }
}

export async function getDiscountedProducts(limit = 6): Promise<Product[]> {
  try {
    await connectDB();
    const docs = await ProductModel.find({ areReducere: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return docs.map(docToProduct);
  } catch (err) {
    console.error("[getDiscountedProducts]", err);
    return [];
  }
}

export async function getTopProducts(limit = 6): Promise<Product[]> {
  try {
    await connectDB();

    const settings = await SiteSettings.findOne({ key: "produse-top" }).lean<{ topProductIds?: string[] }>();
    const ids: string[] = Array.isArray(settings?.topProductIds) ? settings.topProductIds : [];

    if (ids.length > 0) {
      const docs = await ProductModel.find({ _id: { $in: ids } }).lean();
      const byId = new Map(docs.map((d) => [String(d._id), d]));
      return ids
        .map((id) => byId.get(id))
        .filter((d): d is NonNullable<typeof d> => d !== undefined)
        .map(docToProduct);
    }

    // Fallback: cele mai recente produse când nu s-au configurat "top" în admin
    const docs = await ProductModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    return docs.map(docToProduct);
  } catch (err) {
    console.error("[getTopProducts]", err);
    return [];
  }
}

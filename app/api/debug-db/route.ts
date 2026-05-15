import { connectDB } from "@/src/lib/db";
import ProductModel from "@/src/models/Product";
import SiteSettings from "@/src/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();

    const productCount = await ProductModel.countDocuments();
    const topSettings = await SiteSettings.findOne({ key: "produse-top" }).lean<{ topProductIds?: string[] }>();

    const featuredNoSort = await ProductModel.find({ areReducere: { $ne: true } }).limit(3).lean();
    const featuredWithSort = await ProductModel.find({ areReducere: { $ne: true } }).sort({ createdAt: -1 }).limit(6).lean();
    const discounted = await ProductModel.find({ areReducere: true }).sort({ createdAt: -1 }).lean();

    return Response.json({
      ok: true,
      productCount,
      topProductIds: topSettings?.topProductIds ?? [],
      featuredNoSort: featuredNoSort.map((p) => ({ id: String(p._id), name: p.nume, areReducere: p.areReducere })),
      featuredWithSort: featuredWithSort.map((p) => ({ id: String(p._id), name: p.nume, areReducere: p.areReducere })),
      discounted: discounted.map((p) => ({ id: String(p._id), name: p.nume })),
    });
  } catch (err) {
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}

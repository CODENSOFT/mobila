import { connectDB } from "@/src/lib/db";
import ProductModel from "@/src/models/Product";
import SiteSettings from "@/src/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();

    const productCount = await ProductModel.countDocuments();
    const topSettings = await SiteSettings.findOne({ key: "produse-top" }).lean<{ topProductIds?: string[] }>();
    const featured = await ProductModel.find({ areReducere: { $ne: true } }).limit(3).lean();

    return Response.json({
      ok: true,
      productCount,
      topProductIds: topSettings?.topProductIds ?? [],
      featuredSample: featured.map((p) => ({ id: String(p._id), name: p.nume })),
    });
  } catch (err) {
    return Response.json({
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}

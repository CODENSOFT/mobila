import { connectDB } from "../../../lib/db";
import Client from "../../../models/Client";
import Product from "../../../models/Product";

export async function GET() {
  try {
    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const [totalClienti, clientiAzi, totalProduse] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lt: startOfTomorrow,
        },
      }),
      Product.countDocuments(),
    ]);

    return Response.json(
      {
        totalClienti,
        clientiAzi,
        totalProduse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return Response.json({ message: "Nu s-au putut incarca statisticile." }, { status: 500 });
  }
}

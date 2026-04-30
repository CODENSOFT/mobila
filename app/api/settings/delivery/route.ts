import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import SiteSettings from "@/src/models/SiteSettings";

const SETTINGS_KEY = "delivery";
const DEFAULT_EXPRESS_PRICE = 50;

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();

    return Response.json(
      {
        expressPrice:
          typeof settings?.expressDeliveryPrice === "number"
            ? settings.expressDeliveryPrice
            : DEFAULT_EXPRESS_PRICE,
      },
      { headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    console.error("GET /api/settings/delivery error:", error);
    return Response.json(
      { message: "Nu s-au putut încărca setările de livrare." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = (await request.json().catch(() => null)) as { expressPrice?: number } | null;
    const expressPrice = body?.expressPrice;

    if (!Number.isFinite(expressPrice) || (expressPrice ?? -1) < 0) {
      return Response.json(
        { message: "Prețul pentru livrare express este invalid." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    const updated = await SiteSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: { expressDeliveryPrice: Math.round(expressPrice as number) } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return Response.json(
      { expressPrice: updated.expressDeliveryPrice },
      { headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    console.error("PUT /api/settings/delivery error:", error);
    return Response.json(
      { message: "Nu s-au putut salva setările de livrare." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

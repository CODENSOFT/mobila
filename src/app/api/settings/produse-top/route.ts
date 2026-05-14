import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import SiteSettings from "@/src/models/SiteSettings";

const SETTINGS_KEY = "produse-top";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean<{ topProductIds?: string[] }>();

    return Response.json(
      { ids: Array.isArray(settings?.topProductIds) ? settings.topProductIds : [] },
      { headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    console.error("GET /api/settings/produse-top error:", error);
    return Response.json(
      { message: "Nu s-au putut încărca produsele de top." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = (await request.json().catch(() => null)) as { ids?: unknown } | null;
    const ids = body?.ids;

    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return Response.json(
        { message: "Lista de ID-uri este invalidă." },
        { status: 400, headers: buildCorsHeaders(request) }
      );
    }

    const sanitized = ids.slice(0, 6).filter((id) => typeof id === "string" && id.trim().length > 0);

    await SiteSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: { topProductIds: sanitized } },
      { new: true, upsert: true, setDefaultsOnInsert: true, strict: false }
    ).lean();

    return Response.json({ ids: sanitized }, { headers: buildCorsHeaders(request) });
  } catch (error) {
    console.error("PUT /api/settings/produse-top error:", error);
    return Response.json(
      { message: "Nu s-au putut salva produsele de top." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

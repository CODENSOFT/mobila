import { NextResponse } from "next/server";

import { requireAdminRole } from "@/src/lib/adminAuth";
import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import Client from "@/src/models/Client";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdminRole())) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, headers: buildCorsHeaders(request) }
      );
    }

    await connectDB();
    const solicitari = await Client.find({
      $or: [{ sursa: "formular_contact" }, { sursa: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(solicitari, { status: 200, headers: buildCorsHeaders(request) });
  } catch (error) {
    console.error("GET /api/panou-mobila-2026/solicitari error:", error);
    return NextResponse.json(
      { message: "Nu s-au putut încărca solicitările." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

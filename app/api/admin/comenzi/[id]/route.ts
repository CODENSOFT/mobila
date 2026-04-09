import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireAdminRole } from "@/src/lib/adminAuth";
import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import Order from "@/src/models/Order";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 200, headers: buildCorsHeaders(request) });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: buildCorsHeaders(request) }
    );
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid order id" },
      { status: 400, headers: buildCorsHeaders(request) }
    );
  }

  const comanda = await Order.findById(id).populate("produse.produsId").lean();
  if (!comanda) {
    return NextResponse.json(
      { message: "Comanda nu a fost găsită." },
      { status: 404, headers: buildCorsHeaders(request) }
    );
  }

  return NextResponse.json(comanda, { headers: buildCorsHeaders(request) });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: buildCorsHeaders(request) }
    );
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid order id" },
      { status: 400, headers: buildCorsHeaders(request) }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { status?: string; notaInterna?: string; awb?: string }
    | null;

  if (!body) {
    return NextResponse.json(
      { message: "Body invalid" },
      { status: 400, headers: buildCorsHeaders(request) }
    );
  }

  const update: Record<string, unknown> = { updatedAt: new Date() };
  const historyEntry: Record<string, unknown> = {
    changedAt: new Date(),
    changedBy: "Admin",
  };

  if (typeof body.notaInterna === "string") {
    update.notaInterna = body.notaInterna;
  }
  if (typeof body.awb === "string") {
    update.awb = body.awb;
  }

  if (
    body.status &&
    ["noua", "procesata", "expediata", "livrata", "anulata"].includes(body.status)
  ) {
    update.status = body.status;
    historyEntry.status = body.status;
    historyEntry.awb = body.awb ?? "";
    update.$push = { statusHistory: historyEntry };
  }

  const comanda = await Order.findByIdAndUpdate(id, update, {
    returnDocument: "after",
  }).lean();

  if (!comanda) {
    return NextResponse.json(
      { message: "Comanda nu a fost găsită." },
      { status: 404, headers: buildCorsHeaders(request) }
    );
  }

  return NextResponse.json(comanda, { headers: buildCorsHeaders(request) });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: buildCorsHeaders(request) }
    );
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid order id" },
      { status: 400, headers: buildCorsHeaders(request) }
    );
  }

  const comanda = await Order.findByIdAndDelete(id).lean();

  if (!comanda) {
    return NextResponse.json(
      { message: "Comanda nu a fost găsită." },
      { status: 404, headers: buildCorsHeaders(request) }
    );
  }

  return NextResponse.json(
    { ok: true, message: "Comanda a fost ștearsă." },
    { headers: buildCorsHeaders(request) }
  );
}

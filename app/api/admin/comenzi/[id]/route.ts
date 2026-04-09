import { NextResponse } from "next/server";
import { Types } from "mongoose";

import { requireAdminRole } from "@/src/lib/adminAuth";
import { connectDB } from "@/src/lib/db";
import Order from "@/src/models/Order";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  const comanda = await Order.findById(id).populate("produse.produsId").lean();
  if (!comanda) {
    return NextResponse.json({ message: "Comanda nu a fost găsită." }, { status: 404 });
  }

  return NextResponse.json(comanda);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  const body = (await request.json().catch(() => null)) as
    | { status?: string; notaInterna?: string; awb?: string }
    | null;

  if (!body) {
    return NextResponse.json({ message: "Body invalid" }, { status: 400 });
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
    new: true,
  }).lean();

  if (!comanda) {
    return NextResponse.json({ message: "Comanda nu a fost găsită." }, { status: 404 });
  }

  return NextResponse.json(comanda);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const { id } = await params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
  }

  const comanda = await Order.findByIdAndUpdate(
    id,
    {
      status: "anulata",
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "anulata",
          changedAt: new Date(),
          changedBy: "Admin",
        },
      },
    },
    { new: true }
  ).lean();

  if (!comanda) {
    return NextResponse.json({ message: "Comanda nu a fost găsită." }, { status: 404 });
  }

  return NextResponse.json(comanda);
}

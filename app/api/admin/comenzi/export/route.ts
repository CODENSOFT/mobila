import { NextResponse } from "next/server";

import { requireAdminRole } from "@/src/lib/adminAuth";
import { connectDB } from "@/src/lib/db";
import { exportOrders } from "@/src/lib/exportOrders";
import Order from "@/src/models/Order";

export async function GET(request: Request) {
  if (!(await requireAdminRole())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "excel" ? "excel" : "csv";
  const status = searchParams.get("status");
  const search = (searchParams.get("search") ?? "").trim();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const query: Record<string, unknown> = {};
  if (
    status &&
    ["noua", "procesata", "expediata", "livrata", "anulata"].includes(status)
  ) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "client.nume": { $regex: search, $options: "i" } },
      { "client.email": { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) (query.createdAt as Record<string, unknown>).$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      (query.createdAt as Record<string, unknown>).$lte = end;
    }
  }

  const comenzi = await Order.find(query).sort({ createdAt: -1 }).lean();
  const exported = exportOrders(comenzi, format);

  return new NextResponse(exported.content, {
    status: 200,
    headers: {
      "Content-Type": exported.contentType,
      "Content-Disposition": `attachment; filename="${exported.filename}"`,
    },
  });
}

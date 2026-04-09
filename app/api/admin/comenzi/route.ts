import { NextResponse } from "next/server";

import { requireAdminRole } from "@/src/lib/adminAuth";
import { buildCorsHeaders } from "@/src/lib/cors";
import { connectDB } from "@/src/lib/db";
import Order from "@/src/models/Order";

type SortBy = "newest" | "oldest" | "valueAsc" | "valueDesc";

function normalizeSort(sortBy: string | null): SortBy {
  if (sortBy === "oldest") return "oldest";
  if (sortBy === "valueAsc") return "valueAsc";
  if (sortBy === "valueDesc") return "valueDesc";
  return "newest";
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.trunc(parsed));
}

function parseDateParam(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

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
    const { searchParams } = new URL(request.url);

    const page = parsePositiveInt(searchParams.get("page"), 1);
    const limit = Math.min(100, parsePositiveInt(searchParams.get("limit"), 20));
    const status = searchParams.get("status");
    const search = (searchParams.get("search") ?? "").trim();
    const startDate = parseDateParam(searchParams.get("startDate"));
    const endDate = parseDateParam(searchParams.get("endDate"));
    const sortBy = normalizeSort(searchParams.get("sortBy"));

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
      if (startDate) {
        (query.createdAt as Record<string, unknown>).$gte = startDate;
      }
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
        (query.createdAt as Record<string, unknown>).$lte = endDate;
      }
    }

    const sort =
      sortBy === "oldest"
        ? "createdAt"
        : sortBy === "valueAsc"
          ? "total"
          : sortBy === "valueDesc"
            ? "-total"
            : "-createdAt";

    const total = await Order.countDocuments(query);
    const pagini = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pagini);

    const comenzi = await Order.find(query)
      .sort(sort)
      .skip((safePage - 1) * limit)
      .limit(limit)
      .lean();

    const [
      totalComenzi,
      inAsteptare,
      expediateAzi,
      venituriLunaCurenta,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ["noua", "procesata"] } }),
      Order.countDocuments({
        status: "expediata",
        updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Order.aggregate<{ total: number }>([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
            status: { $ne: "anulata" },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const statistici = {
      totalComenzi,
      inAsteptare,
      expediateAzi,
      venituriLuna: venituriLunaCurenta[0]?.total ?? 0,
    };

    return NextResponse.json(
      { comenzi, total, pagini, statistici, page: safePage },
      { headers: buildCorsHeaders(request) }
    );
  } catch (error) {
    console.error("GET /api/admin/comenzi failed", error);
    return NextResponse.json(
      { message: "Nu s-au putut încărca comenzile." },
      { status: 500, headers: buildCorsHeaders(request) }
    );
  }
}

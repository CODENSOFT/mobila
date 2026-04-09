import type { OrderDocument } from "@/src/models/Order";

type ExportFormat = "csv" | "excel";

function escapeCsv(value: string | number) {
  const raw = String(value ?? "");
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, "\"\"")}"`;
  }
  return raw;
}

type ExportOrder = Partial<OrderDocument> & {
  orderNumber?: string;
  client?: {
    nume?: string;
    email?: string;
    telefon?: string;
  };
  produse?: Array<unknown>;
  subtotal?: number;
  transport?: number;
  reducere?: number;
  total?: number;
  metodaPlata?: string;
  status?: string;
  createdAt?: string | Date;
};

function toRows(orders: ExportOrder[]) {
  return orders.map((order) => ({
    orderNumber: order.orderNumber ?? "",
    client: order.client?.nume ?? "",
    email: order.client?.email ?? "",
    telefon: order.client?.telefon ?? "",
    produse: order.produse?.length ?? 0,
    subtotal: order.subtotal ?? 0,
    transport: order.transport ?? 0,
    reducere: order.reducere ?? 0,
    total: order.total ?? 0,
    metodaPlata: order.metodaPlata ?? "",
    status: order.status ?? "",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : "",
  }));
}

function buildCsv(orders: ExportOrder[]) {
  const rows = toRows(orders);
  const header = [
    "Numar comanda",
    "Client",
    "Email",
    "Telefon",
    "Nr produse",
    "Subtotal",
    "Transport",
    "Reducere",
    "Total",
    "Metoda plata",
    "Status",
    "Data",
  ];

  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        r.orderNumber,
        r.client,
        r.email,
        r.telefon,
        r.produse,
        r.subtotal,
        r.transport,
        r.reducere,
        r.total,
        r.metodaPlata,
        r.status,
        r.createdAt,
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ];

  return lines.join("\n");
}

function buildExcelLikeTsv(orders: ExportOrder[]) {
  const rows = toRows(orders);
  const header = [
    "Numar comanda",
    "Client",
    "Email",
    "Telefon",
    "Nr produse",
    "Subtotal",
    "Transport",
    "Reducere",
    "Total",
    "Metoda plata",
    "Status",
    "Data",
  ];

  const lines = [
    header.join("\t"),
    ...rows.map((r) =>
      [
        r.orderNumber,
        r.client,
        r.email,
        r.telefon,
        r.produse,
        r.subtotal,
        r.transport,
        r.reducere,
        r.total,
        r.metodaPlata,
        r.status,
        r.createdAt,
      ].join("\t")
    ),
  ];
  return lines.join("\n");
}

export function exportOrders(orders: ExportOrder[], format: ExportFormat) {
  if (format === "excel") {
    return {
      content: buildExcelLikeTsv(orders),
      filename: `comenzi-${Date.now()}.xls`,
      contentType: "application/vnd.ms-excel; charset=utf-8",
    };
  }

  return {
    content: buildCsv(orders),
    filename: `comenzi-${Date.now()}.csv`,
    contentType: "text/csv; charset=utf-8",
  };
}

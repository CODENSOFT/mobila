type OrderStatus = "noua" | "procesata" | "expediata" | "livrata" | "anulata";

const statusMap: Record<OrderStatus, { label: string; className: string }> = {
  noua: { label: "Nouă", className: "bg-blue-100 text-blue-700" },
  procesata: { label: "Procesată", className: "bg-yellow-100 text-yellow-700" },
  expediata: { label: "Expediată", className: "bg-purple-100 text-purple-700" },
  livrata: { label: "Livrată", className: "bg-green-100 text-green-700" },
  anulata: { label: "Anulată", className: "bg-red-100 text-red-700" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusMap[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

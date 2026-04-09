import OrderStatusBadge from "./OrderStatusBadge";

type TimelineItem = {
  status: "noua" | "procesata" | "expediata" | "livrata" | "anulata";
  changedAt: string | Date;
  changedBy?: string;
  awb?: string;
};

export default function OrderTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-base font-semibold text-[#1a1a1a]">Istoric status</h3>
      <ol className="space-y-4">
        {items.map((item, index) => (
          <li key={`${item.status}-${index}`} className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1a1a1a]" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <OrderStatusBadge status={item.status} />
                <span className="text-xs text-gray-500">
                  {new Date(item.changedAt).toLocaleString("ro-RO")}
                </span>
                {item.changedBy ? (
                  <span className="text-xs text-gray-500">({item.changedBy})</span>
                ) : null}
              </div>
              {item.awb ? (
                <p className="mt-1 text-xs text-gray-600">AWB: {item.awb}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

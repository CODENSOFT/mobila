import { Package, Clock3, Truck, Wallet } from "lucide-react";

export default function OrderStatCards({
  stats,
}: {
  stats: {
    totalComenzi: number;
    inAsteptare: number;
    expediateAzi: number;
    venituriLuna: number;
  };
}) {
  const cards = [
    {
      label: "Total",
      value: stats.totalComenzi,
      sub: "comenzi",
      icon: Package,
    },
    {
      label: "În așteptare",
      value: stats.inAsteptare,
      sub: "procesare",
      icon: Clock3,
    },
    {
      label: "Expediate",
      value: stats.expediateAzi,
      sub: "azi",
      icon: Truck,
    },
    {
      label: "Venituri",
      value: `${stats.venituriLuna.toLocaleString()} MDL`,
      sub: "luna aceasta",
      icon: Wallet,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-500">{card.label}</p>
              <Icon className="h-4 w-4 text-gray-400" aria-hidden />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
          </article>
        );
      })}
    </section>
  );
}

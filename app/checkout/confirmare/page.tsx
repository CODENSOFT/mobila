"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";

type OrderData = {
  orderNumber: string;
  total: number;
  metodaLivrare: "standard" | "express" | "showroom";
  produse: Array<{ nume: string; cantitate: number; pret: number }>;
};

function deliveryText(method: OrderData["metodaLivrare"]) {
  if (method === "express") return "Estimare livrare: 1-2 zile lucrătoare";
  if (method === "showroom") return "Ridicare din showroom: în aceeași zi";
  return "Estimare livrare: 3-5 zile lucrătoare";
}

function ConfirmareContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const email = params.get("email") ?? "";
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (!id) return;
    void fetch(`/api/comenzi?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setOrder({
          orderNumber: data.orderNumber ?? `#${id.slice(-6).toUpperCase()}`,
          total: data.total ?? 0,
          metodaLivrare: data.metodaLivrare ?? "standard",
          produse: (data.produse ?? []).map((p: { nume: string; cantitate: number; pret: number }) => ({
            nume: p.nume,
            cantitate: p.cantitate,
            pret: p.pret,
          })),
        });
      });
  }, [id]);

  const orderNumber = useMemo(
    () => order?.orderNumber ?? `#ORD-${new Date().getFullYear()}-${id.slice(-4).padStart(4, "0")}`,
    [id, order?.orderNumber]
  );

  return (
    <main className="bg-gray-50 px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-16 w-16 animate-pulse text-green-500" aria-hidden />
        <h1 className="mt-4 text-3xl font-semibold text-[#1a1a1a]">
          Comanda ta a fost plasată cu succes!
        </h1>

        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(orderNumber)}
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-[#1a1a1a]"
        >
          {orderNumber}
          <Copy className="h-4 w-4" aria-hidden />
        </button>

        <p className="mt-3 text-sm text-gray-600">
          Vei primi un email de confirmare la adresa: <strong>{email || "adresa ta de email"}</strong>
        </p>

        {order ? (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-gray-100 bg-gray-50 p-4 text-left">
            <p className="mb-2 text-sm font-medium text-[#1a1a1a]">Sumar comandă</p>
            <div className="space-y-1 text-sm text-gray-600">
              {order.produse.map((item) => (
                <div key={item.nume} className="flex justify-between">
                  <span>
                    {item.nume} x{item.cantitate}
                  </span>
                  <span>{(item.pret * item.cantitate).toLocaleString()} MDL</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-sm font-semibold text-[#1a1a1a]">
                Total: {order.total.toLocaleString()} MDL
              </p>
              <p className="mt-1 text-xs text-gray-500">{deliveryText(order.metodaLivrare)}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/cont/comenzi"
            className="rounded-lg bg-[#1a1a1a] px-5 py-3 text-sm font-medium text-white hover:bg-[#333]"
          >
            Urmărește comanda
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continuă cumpărăturile
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmarePage() {
  return (
    <Suspense fallback={<main className="bg-gray-50 px-4 py-12">Se încarcă...</main>}>
      <ConfirmareContent />
    </Suspense>
  );
}

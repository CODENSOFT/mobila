"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import OrderDetailSidebar from "@/src/components/admin/comenzi/OrderDetailSidebar";
import OrderTimeline from "@/src/components/admin/comenzi/OrderTimeline";
import type { AdminOrder } from "@/src/hooks/useOrders";
import { getSafeImageSrc } from "@/src/lib/image";
import { toApiUrl } from "@/src/lib/api";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [comanda, setComanda] = useState<AdminOrder | null>(null);
  const [notaInterna, setNotaInterna] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(toApiUrl(`/api/admin/comenzi/${id}`), { cache: "no-store" });
      if (!response.ok) throw new Error("Nu s-a putut încărca comanda.");
      const data = (await response.json()) as AdminOrder;
      setComanda(data);
      setNotaInterna(data.notaInterna ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return <div className="rounded-xl border border-gray-100 bg-white p-6">Se încarcă...</div>;
  }
  if (error || !comanda) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error ?? "Comanda nu a fost găsită."}
      </div>
    );
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Detaliu comandă</h1>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#1a1a1a]">Produse comandate</h2>
            <div className="space-y-3">
              {comanda.produse.map((p, idx) => (
                <div key={`${p.nume}-${idx}`} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={getSafeImageSrc(p.imagine)}
                      alt={p.nume}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <p className="flex-1 text-sm">{p.nume}</p>
                  <p className="text-sm">{p.pret.toLocaleString()} MDL</p>
                  <p className="text-sm">x{p.cantitate}</p>
                  <p className="text-sm font-semibold">{(p.pret * p.cantitate).toLocaleString()} MDL</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{comanda.subtotal.toLocaleString()} MDL</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transport</span>
                <span>{comanda.transport.toLocaleString()} MDL</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Reducere</span>
                <span>-{comanda.reducere.toLocaleString()} MDL</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold">
                <span>Total final</span>
                <span>{comanda.total.toLocaleString()} MDL</span>
              </div>
            </div>
          </section>

          <OrderTimeline
            items={
              comanda.statusHistory?.length
                ? comanda.statusHistory.map((item) => ({
                    status: item.status as AdminOrder["status"],
                    changedAt: item.changedAt,
                    changedBy: item.changedBy,
                    awb: item.awb,
                  }))
                : [
                    {
                      status: comanda.status,
                      changedAt: comanda.createdAt,
                      changedBy: "Sistem",
                    },
                  ]
            }
          />

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-[#1a1a1a]">Notă internă</h3>
            <textarea
              value={notaInterna}
              onChange={(e) => setNotaInterna(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
            />
            <button
              type="button"
              onClick={async () => {
                await fetch(toApiUrl(`/api/admin/comenzi/${comanda._id}`), {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ notaInterna }),
                });
                await fetchOrder();
              }}
              className="mt-3 rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#333]"
            >
              Salvează nota
            </button>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <OrderDetailSidebar
            comanda={comanda}
            onUpdateStatus={async (payload) => {
              await fetch(toApiUrl(`/api/admin/comenzi/${comanda._id}`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              await fetchOrder();
            }}
            onCancel={async () => {
              if (!window.confirm("Sigur vrei să anulezi comanda?")) return;
              await fetch(toApiUrl(`/api/admin/comenzi/${comanda._id}`), { method: "DELETE" });
              await fetchOrder();
            }}
          />
        </aside>
      </div>
    </main>
  );
}

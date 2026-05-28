"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Star, StarOff, Save, Loader2 } from "lucide-react";

import { toApiUrl } from "@/src/lib/api";
import { getSafeImageSrc } from "@/src/lib/image";
import type { Product } from "@/src/types/product";

export default function ProduseNoiAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch(toApiUrl("/api/produse"), { cache: "no-store" }),
          fetch(toApiUrl("/api/settings/produse-noi"), { cache: "no-store" }),
        ]);

        if (prodRes.ok) {
          const data = (await prodRes.json()) as Product[];
          setProducts(data);
        }

        if (settingsRes.ok) {
          const { ids } = (await settingsRes.json()) as { ids: string[] };
          setSelectedIds(Array.isArray(ids) ? ids : []);
        }
      } catch {
        // silently fall through with empty state
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      const res = await fetch(toApiUrl("/api/settings/produse-noi"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        alert(data?.message ?? "Eroare la salvare.");
        return;
      }

      setSaved(true);
      try {
        new BroadcastChannel("home-update").postMessage("produse-noi");
      } catch {}
    } catch {
      alert("Eroare la salvare.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Produse noi</h2>
          <p className="mt-1 text-sm text-slate-600">
            Selectează produsele care vor apărea în secțiunea „Produse noi" de pe pagina principală.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isSaving}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? "Salvat!" : "Salvează selecția"}
        </button>
      </header>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">{selectedIds.length}</span> produse selectate
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Se încarcă produsele...
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Nu există produse în catalog.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product._id);
            const orderIndex = selectedIds.indexOf(product._id);

            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggle(product._id)}
                className={`group relative flex items-center gap-4 rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-50 shadow-[0_0_0_2px_rgba(0,150,80,0.15)]"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-100">
                  <Image
                    src={getSafeImageSrc(product.imagine)}
                    alt={product.nume}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{product.nume}</p>
                  <p className="text-xs text-slate-500">{product.categorie}</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">{product.pret.toLocaleString()} MDL</p>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                      <span className="text-[11px] font-bold">{orderIndex + 1}</span>
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-600">
                      <Star className="h-4 w-4" />
                    </div>
                  )}
                </div>

                {isSelected && (
                  <StarOff className="absolute right-12 top-3 h-3.5 w-3.5 text-emerald-500 opacity-0 transition group-hover:opacity-100" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

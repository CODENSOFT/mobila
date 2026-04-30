"use client";

import { useEffect, useState } from "react";

export default function DeliverySettingsCard() {
  const [expressPrice, setExpressPrice] = useState("50");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadDeliverySettings = async () => {
      try {
        const response = await fetch("/api/settings/delivery", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { expressPrice?: number };
        if (!isMounted) return;
        if (typeof data.expressPrice === "number" && Number.isFinite(data.expressPrice)) {
          setExpressPrice(String(Math.max(0, Math.round(data.expressPrice))));
        }
      } catch {
        // Keep fallback value.
      }
    };
    void loadDeliverySettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    const parsedPrice = Number(expressPrice);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      alert("Prețul pentru livrare express trebuie să fie un număr valid (>= 0).");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/settings/delivery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expressPrice: Math.round(parsedPrice) }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(data?.message ?? "Nu s-a putut salva prețul de livrare express.");
      }
      alert("Prețul pentru livrare express a fost salvat.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Eroare la salvare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
        Setări livrare
      </h3>
      <div className="mt-4 flex flex-col gap-3 sm:max-w-sm">
        <label className="text-sm font-medium text-slate-700">
          Livrare express (MDL)
          <input
            type="number"
            min={0}
            step={1}
            value={expressPrice}
            onChange={(e) => setExpressPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={() => {
            void handleSave();
          }}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Se salvează..." : "Salvează prețul"}
        </button>
      </div>
    </article>
  );
}

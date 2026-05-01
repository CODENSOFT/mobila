"use client";

import { Mail, Printer, X } from "lucide-react";
import { useState } from "react";

import type { AdminOrder } from "@/src/hooks/useOrders";
import OrderStatusBadge from "./OrderStatusBadge";

type Props = {
  comanda: AdminOrder;
  onUpdateStatus: (payload: {
    status?: AdminOrder["status"];
    notaInterna?: string;
    awb?: string;
  }) => Promise<void>;
  onCancel: () => Promise<void>;
};

export default function OrderDetailSidebar({ comanda, onUpdateStatus, onCancel }: Props) {
  const [status, setStatus] = useState<AdminOrder["status"]>(comanda.status);
  const [awb, setAwb] = useState(comanda.awb ?? "");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-sm text-gray-500">{comanda.orderNumber}</p>
          <p className="text-xs text-gray-500">
            {new Date(comanda.createdAt).toLocaleString("ro-RO")}
          </p>
        </div>
        <OrderStatusBadge status={comanda.status} />

        <div className="mt-4 space-y-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminOrder["status"])}
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm"
          >
            <option value="noua">Nouă</option>
            <option value="procesata">Procesată</option>
            <option value="expediata">Expediată</option>
            <option value="livrata">Livrată</option>
            <option value="anulata">Anulată</option>
          </select>
          {status === "expediata" ? (
            <input
              value={awb}
              onChange={(e) => setAwb(e.target.value)}
              placeholder="AWB / tracking"
              className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm"
            />
          ) : null}
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onUpdateStatus({ status, awb });
              } finally {
                setLoading(false);
              }
            }}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#1a1a1a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
          >
            Actualizează
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">Date client</h3>
        <p className="text-sm font-medium">{comanda.client.nume}</p>
        <a className="block text-sm text-gray-600 hover:underline" href={`mailto:${comanda.client.email}`}>
          {comanda.client.email}
        </a>
        <a className="block text-sm text-gray-600 hover:underline" href={`tel:${comanda.client.telefon}`}>
          {comanda.client.telefon}
        </a>
        <p className="mt-2 text-sm text-gray-600">
          {comanda.client.adresa}, {comanda.client.oras}, {comanda.client.judet},{" "}
          {comanda.client.codPostal}
        </p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">Acțiuni rapide</h3>
        <div className="space-y-2">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Trimite email confirmare
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Printer className="h-4 w-4" aria-hidden />
            Printează comanda
          </button>
          <button
            type="button"
            onClick={() => void onCancel()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4" aria-hidden />
            Anulează comanda
          </button>
        </div>
      </section>
    </div>
  );
}

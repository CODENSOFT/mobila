"use client";

import Image from "next/image";
import Link from "next/link";
import { Clipboard, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import type { AdminOrder } from "@/src/hooks/useOrders";
import { getSafeImageSrc } from "@/src/lib/image";
import OrderStatusBadge from "./OrderStatusBadge";

type Props = {
  comenzi: AdminOrder[];
  onChangeStatus: (id: string, status: AdminOrder["status"]) => void;
  onDelete: (id: string) => void;
};

function paymentBadge(metoda: AdminOrder["metodaPlata"]) {
  if (metoda === "card") return "Card 💳";
  if (metoda === "ramburs") return "Ramburs 💵";
  return "Transfer 🏦";
}

export default function OrdersTable({ comenzi, onChangeStatus, onDelete }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3"># Comandă</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Produse</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Plată</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {comenzi.map((comanda) => (
              <tr key={comanda._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(comanda.orderNumber)}
                    className="inline-flex items-center gap-2 font-semibold text-[#1a1a1a]"
                    title="Copiază numărul comenzii"
                  >
                    {comanda.orderNumber}
                    <Clipboard className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#1a1a1a]">{comanda.client.nume}</p>
                  <p className="text-xs text-gray-500">{comanda.client.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {comanda.produse[0]?.imagine ? (
                      <div className="relative h-8 w-8 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={getSafeImageSrc(comanda.produse[0].imagine)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : null}
                    <span>{comanda.produse.length} produse</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-[#1a1a1a]">
                  {comanda.total.toLocaleString()} MDL
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                    {paymentBadge(comanda.metodaPlata)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={comanda.status} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {new Date(comanda.createdAt).toLocaleString("ro-RO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/comenzi/${comanda._id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100"
                      title="Vezi detalii"
                    >
                      <Eye className="h-4 w-4" aria-hidden />
                    </Link>
                    <select
                      value={comanda.status}
                      onChange={(e) =>
                        onChangeStatus(comanda._id, e.target.value as AdminOrder["status"])
                      }
                      className="h-8 rounded-md border border-gray-200 px-2 text-xs"
                    >
                      <option value="noua">Nouă</option>
                      <option value="procesata">Procesată</option>
                      <option value="expediata">Expediată</option>
                      <option value="livrata">Livrată</option>
                      <option value="anulata">Anulată</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onDelete(comanda._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
                      title="Anulează comanda"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100"
                      title="Mai multe"
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

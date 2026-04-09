"use client";

import { RotateCcw } from "lucide-react";

import type { OrdersFilters } from "@/src/hooks/useOrders";

type Props = {
  filters: OrdersFilters;
  onChange: (updater: (prev: OrdersFilters) => OrdersFilters) => void;
  onReset: () => void;
};

export default function OrderFilters({ filters, onChange, onReset }: Props) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
        <input
          value={filters.search}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, search: e.target.value, page: 1 }))
          }
          placeholder="Caută după #comandă, client, email"
          className="lg:col-span-2 h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        />
        <select
          value={filters.status}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, status: e.target.value, page: 1 }))
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        >
          <option value="all">Toate</option>
          <option value="noua">Nouă</option>
          <option value="procesata">Procesată</option>
          <option value="expediata">Expediată</option>
          <option value="livrata">Livrată</option>
          <option value="anulata">Anulată</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, startDate: e.target.value, page: 1 }))
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, endDate: e.target.value, page: 1 }))
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        />
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              sortBy: e.target.value as OrdersFilters["sortBy"],
              page: 1,
            }))
          }
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
        >
          <option value="newest">Cele mai noi</option>
          <option value="oldest">Cele mai vechi</option>
          <option value="valueAsc">Valoare ↑</option>
          <option value="valueDesc">Valoare ↓</option>
        </select>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Resetează filtrele
        </button>
      </div>
    </section>
  );
}

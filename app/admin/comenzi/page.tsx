"use client";

import { Download, FileSpreadsheet } from "lucide-react";

import OrderFilters from "@/src/components/admin/comenzi/OrderFilters";
import OrderStatCards from "@/src/components/admin/comenzi/OrderStatCards";
import OrdersTable from "@/src/components/admin/comenzi/OrdersTable";
import { useOrders } from "@/src/hooks/useOrders";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
  status: "all",
  search: "",
  startDate: "",
  endDate: "",
  sortBy: "newest" as const,
};

export default function AdminComenziPage() {
  const {
    comenzi,
    loading,
    error,
    total,
    pagini,
    statistici,
    filters,
    setFilters,
    updateStatus,
    deleteOrder,
    exportComenzi,
  } = useOrders(DEFAULT_FILTERS);

  const start = (filters.page - 1) * filters.limit + 1;
  const end = Math.min(filters.page * filters.limit, total);

  return (
    <main className="space-y-5 bg-gray-50">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comenzi</h1>
          <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            {total} total
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void exportComenzi("csv")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void exportComenzi("excel")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" aria-hidden />
            Export Excel
          </button>
        </div>
      </header>

      <OrderStatCards stats={statistici} />

      <OrderFilters
        filters={filters}
        onChange={(updater) => setFilters((prev) => updater(prev))}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
          Se încarcă comenzile...
        </div>
      ) : (
        <OrdersTable
          comenzi={comenzi}
          onChangeStatus={(id, status) =>
            void updateStatus(id, { status }).catch((err) => alert(String(err)))
          }
          onDelete={(id) =>
            void deleteOrder(id).catch((err) => alert(String(err)))
          }
        />
      )}

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm shadow-sm">
        <p className="text-gray-600">
          Afișezi {total === 0 ? 0 : start}-{end} din {total} comenzi
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={filters.page <= 1}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
            }
            className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Pagina {filters.page} / {pagini}
          </span>
          <button
            type="button"
            disabled={filters.page >= pagini}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: Math.min(pagini, prev.page + 1) }))
            }
            className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-50"
          >
            Următor
          </button>
          <select
            value={filters.limit}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                limit: Number(e.target.value),
              }))
            }
            className="h-8 rounded-lg border border-gray-200 px-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </section>
    </main>
  );
}

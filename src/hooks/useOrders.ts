"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toApiUrl } from "@/src/lib/api";

export type AdminOrder = {
  _id: string;
  orderNumber: string;
  client: {
    nume: string;
    email: string;
    telefon: string;
    adresa: string;
    oras: string;
    judet: string;
    codPostal: string;
  };
  produse: Array<{
    produsId?: string;
    nume: string;
    imagine: string;
    pret: number;
    cantitate: number;
  }>;
  subtotal: number;
  transport: number;
  reducere: number;
  total: number;
  codReducere?: string;
  metodaPlata: "card" | "ramburs" | "transfer";
  status: "noua" | "procesata" | "expediata" | "livrata" | "anulata";
  notaInterna?: string;
  awb?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: Array<{
    status: string;
    changedAt: string;
    changedBy?: string;
    awb?: string;
  }>;
};

export type OrdersFilters = {
  page: number;
  limit: number;
  status: string;
  search: string;
  startDate: string;
  endDate: string;
  sortBy: "newest" | "oldest" | "valueAsc" | "valueDesc";
};

const DEFAULT_FILTERS: OrdersFilters = {
  page: 1,
  limit: 20,
  status: "all",
  search: "",
  startDate: "",
  endDate: "",
  sortBy: "newest",
};

export function useOrders(initialFilters?: Partial<OrdersFilters>) {
  const [filters, setFilters] = useState<OrdersFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [comenzi, setComenzi] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagini, setPagini] = useState(1);
  const [statistici, setStatistici] = useState({
    totalComenzi: 0,
    inAsteptare: 0,
    expediateAzi: 0,
    venituriLuna: 0,
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
    params.set("sortBy", filters.sortBy);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    return params.toString();
  }, [filters]);

  const fetchComenzi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(toApiUrl(`/api/admin/comenzi?${queryString}`), {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Nu s-au putut încărca comenzile.");
      const data = (await response.json()) as {
        comenzi: AdminOrder[];
        total: number;
        pagini: number;
        statistici: {
          totalComenzi: number;
          inAsteptare: number;
          expediateAzi: number;
          venituriLuna: number;
        };
      };
      setComenzi(data.comenzi ?? []);
      setTotal(data.total ?? 0);
      setPagini(data.pagini ?? 1);
      setStatistici(data.statistici);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchComenzi();
    }, 300);
    return () => window.clearTimeout(timer);
  }, [fetchComenzi]);

  const updateStatus = useCallback(
    async (
      id: string,
      payload: {
        status?: AdminOrder["status"];
        notaInterna?: string;
        awb?: string;
      }
    ) => {
      const response = await fetch(toApiUrl(`/api/admin/comenzi/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "Nu s-a putut actualiza comanda.");
      }
      await fetchComenzi();
    },
    [fetchComenzi]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      const response = await fetch(toApiUrl(`/api/admin/comenzi/${id}`), { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "Nu s-a putut anula comanda.");
      }
      await fetchComenzi();
    },
    [fetchComenzi]
  );

  const exportComenzi = useCallback(
    async (format: "csv" | "excel") => {
      const params = new URLSearchParams(queryString);
      params.set("format", format);
      const response = await fetch(toApiUrl(`/api/admin/comenzi/export?${params.toString()}`));
      if (!response.ok) {
        throw new Error("Exportul a eșuat.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comenzi.${format === "excel" ? "xls" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    [queryString]
  );

  return {
    comenzi,
    loading,
    error,
    total,
    pagini,
    statistici,
    filters,
    setFilters,
    fetchComenzi,
    updateStatus,
    deleteOrder,
    exportComenzi,
  };
}

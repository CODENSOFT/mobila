// ProductTable.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "../../types/product";

type ProductTableProps = {
  products: Product[];
  deletingId?: string | null;
  onDelete: (id: string) => void;
};

export default function ProductTable({
  products,
  deletingId = null,
  onDelete,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nume.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.categorie === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.categorie).filter(Boolean))];

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">Nu există produse</h3>
        <p className="mt-1 text-sm text-slate-500">Începe prin adăugarea primului produs în colecție.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Caută produse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Toate categoriile</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Produs</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Categorie</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Preț</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr 
                  key={product._id} 
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <Image
                          src={
                            product.imagine?.trim() ||
                            "/images/categories/dormitor.png"
                          }
                          alt={product.nume}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{product.nume}</h4>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{product.descriere}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {product.categorie ?? "Fără categorie"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{product.pret.toLocaleString()} MDL</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link
                        href={`/admin/edit/${product._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600 hover:shadow-sm"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deletingId === product._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer Stats */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
          Afișate {filteredProducts.length} din {products.length} produse
        </div>
      </div>
    </div>
  );
}
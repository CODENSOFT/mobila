"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Box, CircleDollarSign, Layers3 } from "lucide-react";

import type { ProductCategory } from "../../src/constants/categories";
import ConfirmModal from "../../src/components/admin/ConfirmModal";
import ProductTable from "../../src/components/admin/ProductTable";
import type { Product } from "../../src/types/product";

const ProductForm = dynamic(() => import("../../src/components/admin/ProductForm"), {
  ssr: false,
});

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/produse", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Nu s-au putut incarca produsele.");
      }
      const data = (await response.json()) as Product[];
      setProducts(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Eroare la incarcare.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleCreate = async (payload: {
    nume: string;
    descriere: string;
    pret: number;
    categorie: ProductCategory;
    imagineUrl: string;
    imagineFile?: File | null;
  }) => {
    const hasFile = payload.imagineFile instanceof File;

    const response = hasFile
      ? await fetch("/api/produse", {
          method: "POST",
          body: (() => {
            const formData = new FormData();
            formData.append("nume", payload.nume);
            formData.append("descriere", payload.descriere);
            formData.append("pret", String(payload.pret));
            formData.append("categorie", payload.categorie);
            if (payload.imagineUrl) {
              formData.append("imagineUrl", payload.imagineUrl);
            }
            if (payload.imagineFile) {
              formData.append("imagine", payload.imagineFile);
            }
            return formData;
          })(),
        })
      : await fetch("/api/produse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(data?.message ?? "Nu s-a putut crea produsul.");
    }

    await loadProducts();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/produse/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(data?.message ?? "Nu s-a putut sterge produsul.");
      }
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Eroare la stergere.");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const totalValue = products.reduce((acc, product) => acc + product.pret, 0);
  const totalCategories = new Set(products.map((product) => product.categorie)).size;

  return (
    <main className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Administrare produse</h2>
        <p className="mt-1 text-sm text-slate-600">
          Creezi, editezi și organizezi catalogul dintr-un singur loc.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <Box className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Produse totale</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{products.length}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <Layers3 className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categorii active</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalCategories}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-2 inline-flex rounded-lg bg-white p-2 text-slate-700">
            <CircleDollarSign className="h-4 w-4" aria-hidden />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Valoare totală (sumă prețuri)
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalValue.toLocaleString()} MDL</p>
        </article>
      </section>

      <ProductForm mode="create" onSubmit={handleCreate} />

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          Se încarcă produsele...
        </div>
      ) : (
        <ProductTable
          products={products}
          deletingId={deletingId}
          onDelete={(id) => setPendingDeleteId(id)}
        />
      )}

      <ConfirmModal
        open={Boolean(pendingDeleteId)}
        title="Sterge produs?"
        description="Actiunea este permanenta si nu poate fi anulata."
        confirmLabel="Sterge"
        loading={Boolean(deletingId)}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            void handleDelete(pendingDeleteId);
          }
        }}
      />
    </main>
  );
}

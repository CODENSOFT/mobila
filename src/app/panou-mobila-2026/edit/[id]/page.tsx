"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProductCategory } from "@/src/constants/categories";
import { toApiUrl } from "@/src/lib/api";
import type { Product } from "@/src/types/product";

const ProductForm = dynamic(() => import("@/src/components/admin/ProductForm"), {
  ssr: false,
});

export default function PanouEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(toApiUrl(`/api/produse?id=${params.id}`), {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Nu s-a putut incarca produsul.");
        }
        const data = (await response.json()) as Product;
        setProduct(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Eroare la incarcare.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      void loadProduct();
    }
  }, [params.id]);

  const handleUpdate = async (payload: {
    nume: string;
    nume_ru: string;
    descriere: string;
    descriere_ru: string;
    pret: number;
    categorie: ProductCategory;
    imagineUrl: string;
    imagineFile?: File | null;
    areReducere: boolean;
    pretReducere?: number;
    procentReducere?: number;
    imaginiFiles?: File[];
    imaginiUrls?: string[];
    set?: string;
    grup?: string;
  }) => {
    const hasExtraFiles = (payload.imaginiFiles?.length ?? 0) > 0;

    let response: Response;

    if (hasExtraFiles) {
      const formData = new FormData();
      formData.append("nume", payload.nume);
      if (payload.nume_ru) formData.append("nume_ru", payload.nume_ru);
      formData.append("descriere", payload.descriere);
      if (payload.descriere_ru) formData.append("descriere_ru", payload.descriere_ru);
      formData.append("pret", String(payload.pret));
      formData.append("categorie", payload.categorie);
      formData.append("imagineUrl", payload.imagineUrl);
      formData.append("areReducere", String(payload.areReducere));
      if (payload.pretReducere) formData.append("pretReducere", String(payload.pretReducere));
      if (payload.procentReducere) formData.append("procentReducere", String(payload.procentReducere));
      if (payload.set) formData.append("set", payload.set);
      if (payload.grup) formData.append("grup", payload.grup);
      for (const f of payload.imaginiFiles ?? []) formData.append("imagini", f);
      for (const u of payload.imaginiUrls ?? []) formData.append("imaginiUrls", u);
      response = await fetch(toApiUrl(`/api/produse/${params.id}`), { method: "PUT", body: formData });
    } else {
      response = await fetch(toApiUrl(`/api/produse/${params.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nume: payload.nume,
          nume_ru: payload.nume_ru,
          descriere: payload.descriere,
          descriere_ru: payload.descriere_ru,
          pret: payload.pret,
          categorie: payload.categorie,
          imagineUrl: payload.imagineUrl,
          areReducere: payload.areReducere,
          pretReducere: payload.pretReducere,
          procentReducere: payload.procentReducere,
          imagini: payload.imaginiUrls ?? [],
          set: payload.set,
          grup: payload.grup,
        }),
      });
    }

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;
      throw new Error(data?.message ?? "Nu s-a putut actualiza produsul.");
    }

    alert("Produs actualizat cu succes.");
    try { new BroadcastChannel("home-update").postMessage("reduceri"); } catch {}
    router.push("/panou-mobila-2026");
  };

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Editeaza produs</h1>
        <Link
          href="/panou-mobila-2026"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Inapoi
        </Link>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
          Se incarca datele produsului...
        </div>
      ) : product ? (
        <ProductForm mode="edit" initialProduct={product} onSubmit={handleUpdate} />
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Produsul nu a fost gasit.
        </div>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import AddToCartButton from "@/src/components/cart/AddToCartButton";
import ProduseSimilare from "../../../src/components/sections/ProduseSimilare";

type Product = {
  _id: string;
  nume: string;
  descriere: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  categorie?: string;
};

async function getProdusById(id: string): Promise<Product | null> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return null;
  }

  const response = await fetch(
    `${protocol}://${host}/api/produse?id=${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const produs = (await response.json()) as Product;
  return produs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const produs = await getProdusById(id);

  if (!produs) {
    return {
      title: "Produs indisponibil | LABIRINT",
      description: "Produsul căutat nu a fost găsit în colecția noastră.",
    };
  }

  return {
    title: `${produs.nume} | LABIRINT`,
    description: produs.descriere.slice(0, 160),
  };
}

export default async function ProdusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produs = await getProdusById(id);

  if (!produs) {
    return (
      <main className="min-h-screen bg-[#fafaf9]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#e7e5e4] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-[#1c1917] mb-2">Produs indisponibil</h1>
            <p className="text-[#78716c] mb-6">Produsul căutat nu există în colecția noastră.</p>
            <Link 
              href="/produse" 
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1917] hover:text-[#78716c] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Înapoi la produse
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Breadcrumb */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e]">
            <Link href="/" className="hover:text-[#1c1917] transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/produse" className="hover:text-[#1c1917] transition-colors">Produse</Link>
            <span>/</span>
            {produs.categorie && (
              <>
                <Link href={`/produse?categorie=${produs.categorie}`} className="hover:text-[#1c1917] transition-colors">
                  {produs.categorie}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#1c1917] truncate max-w-[200px]">{produs.nume}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left - Image gallery + zoom */}
          <ProductImageGallery
            imagine={produs.imagine}
            imagini={produs.imagini}
            alt={produs.nume}
          />

          {/* Right - Details */}
          <div className="flex flex-col lg:py-8">
            <div className="space-y-6">
              {/* Category */}
              {produs.categorie && (
                <span className="inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-[#1c1917]/50">
                  {produs.categorie}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-light text-[#1c1917] leading-tight">
                {produs.nume}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-light text-[#1c1917]">
                  {produs.pret.toLocaleString()}
                </span>
                <span className="text-lg text-[#a8a29e]">MDL</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e7e5e4]" />

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-[#57534e] leading-relaxed text-base">
                  {produs.descriere}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 py-6">
                {[
                  { label: "Livrare", value: "2-4 săptămâni" },
                  { label: "Garanție", value: "24 luni" },
                  { label: "Montaj", value: "Disponibil" },
                  { label: "Plată", value: "Cash / Transfer" },
                ].map((feature) => (
                  <div key={feature.label} className="space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[#a8a29e]">
                      {feature.label}
                    </p>
                    <p className="text-sm font-medium text-[#1c1917]">
                      {feature.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-6 space-y-4">
                <AddToCartButton
                  produs={{
                    id: produs._id,
                    nume: produs.nume,
                    pret: produs.pret,
                    imagine: produs.imagine,
                    slug: produs._id,
                  }}
                  className="lg:w-auto lg:min-w-[250px]"
                />

                <p className="text-xs text-[#a8a29e]">
                  Sau sună direct: <a href="tel:+37369727444" className="text-[#1c1917] hover:underline">+373 697 27 444</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProduseSimilare
        key={id}
        produsId={id}
        categorie={produs.categorie ?? ""}
      />
    </main>
  );
}
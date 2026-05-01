import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getDictionary, isLocale } from "../../dictionaries";
import ProductPageClient from "./ProductPageClient";

type Product = {
  _id: string;
  nume: string;
  descriere: string;
  descriere_ro?: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  categorie?: string;
};

type RawProduct = Omit<Product, "descriere"> & {
  descriere?: string;
};

async function getProdusById(id: string): Promise<Product | null> {
  try {
    const apiBaseUrl = "https://mobila-production.up.railway.app";
    const response = await fetch(`${apiBaseUrl}/api/produse?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const produs = (await response.json()) as RawProduct;
    return {
      ...produs,
      descriere: produs.descriere ?? produs.descriere_ro ?? "",
    };
  } catch (error) {
    console.error("[[lang]/produse/[id]] error", { id, error });
    return null;
  }
}

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

export default async function ProdusPage({ params }: PageProps<"/[lang]/produse/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();

  const [produs, dict] = await Promise.all([getProdusById(id), getDictionary(lang)]);

  const t = dict.product;

  if (!produs) {
    return (
      <main className="min-h-screen bg-[#fafaf9]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e7e5e4]">
              <svg className="h-6 w-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-light text-[#1c1917]">{t.notFound}</h1>
            <p className="mb-6 text-[#78716c]">{t.notFoundDesc}</p>
            <Link
              href={`/${lang}/produse`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1917] transition-colors hover:text-[#78716c]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {t.backToProducts}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <ProductPageClient produs={produs} lang={lang} t={t} />;
}

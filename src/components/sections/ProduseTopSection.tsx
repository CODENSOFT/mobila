"use client";

import Image from "next/image";
import Link from "next/link";

import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { discountBadgeText } from "@/src/lib/discount";
import { formatPriceInteger } from "@/src/lib/formatPrice";
import { getSafeImageSrc } from "../../lib/image";
import type { Product } from "../../types/product";
import Card from "../ui/Card";

type ProduseTopDict = {
  label: string;
  heading: string;
  headingItalic: string;
  description: string;
  viewAll: string;
  furniture: string;
  viewDetails: string;
};

const DEFAULT_T: ProduseTopDict = {
  label: "Selecție",
  heading: "Produse",
  headingItalic: "de top",
  description: "O selecție curatoriată din cele mai apreciate piese ale noastre.",
  viewAll: "Toată colecția",
  furniture: "Mobilier",
  viewDetails: "Vezi detalii",
};

function TopProductCard({
  product,
  lang,
  furniture,
  viewDetails,
}: {
  product: Product;
  lang: string;
  furniture: string;
  viewDetails: string;
}) {
  const { text: numeDisplay } = useLiveRuText(product.nume, lang);
  return (
    <Link href={`/${lang}/produse/${product._id}`} className="group block">
      <Card className="relative aspect-4/5 border border-[#e8dfc8] bg-[#fcfbf9] shadow-[0_14px_34px_rgba(20,18,15,0.08)] transition-all duration-300 hover:shadow-[0_20px_42px_rgba(20,18,15,0.14)]">
        <Image
          src={getSafeImageSrc(product.imagine)}
          alt={numeDisplay}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/20 to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="inline-block rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200 backdrop-blur-sm">
            Top
          </span>
        </div>

        {product.areReducere && (
          <span className="absolute right-4 top-4 rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {product.procentReducere ? `-${product.procentReducere}%` : discountBadgeText(lang)}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {product.categorie || furniture}
          </p>
          <h3 className="mb-3 text-[20px] font-medium leading-tight text-white">{numeDisplay}</h3>
          <div className="flex items-center justify-between">
            <div>
              {product.areReducere && product.pretReducere ? (
                <>
                  <p className="text-base font-semibold text-red-400">
                    {formatPriceInteger(product.pretReducere, lang)}{" "}
                    <span className="text-sm font-normal text-red-300">MDL</span>
                  </p>
                  <p className="text-xs text-white/50 line-through">
                    {formatPriceInteger(product.pret, lang)} MDL
                  </p>
                </>
              ) : (
                <p className="text-base font-semibold text-white/95">
                  {formatPriceInteger(product.pret, lang)}{" "}
                  <span className="text-sm font-normal text-white/70">MDL</span>
                </p>
              )}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
              {viewDetails}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function ProduseTopSection({
  products,
  t = DEFAULT_T,
  lang = "ro",
}: {
  products: Product[];
  t?: ProduseTopDict;
  lang?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white pt-10 lg:pt-16 pb-24 lg:pb-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-light text-[#1c1917] leading-tight">
              {t.heading} <span className="italic font-normal text-(--brand-green)">{t.headingItalic}</span>
            </h2>
            <p className="max-w-md text-sm text-[#78716c] leading-relaxed">
              {t.description}
            </p>
          </div>

          <Link
            href={`/${lang}/produse`}
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-amber-800/70 transition-colors hover:text-amber-900"
          >
            {t.viewAll}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <TopProductCard
              key={product._id}
              product={product}
              lang={lang}
              furniture={t.furniture}
              viewDetails={t.viewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

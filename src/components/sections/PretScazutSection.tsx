"use client";

import Image from "next/image";
import Link from "next/link";

import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { discountBadgeText } from "@/src/lib/discount";
import { formatPriceInteger } from "@/src/lib/formatPrice";
import { getSafeImageSrc } from "../../lib/image";
import type { Product } from "../../types/product";
import Card from "../ui/Card";

type PretScazutDict = {
  label: string;
  heading: string;
  headingItalic: string;
  description: string;
  viewAll: string;
  empty: string;
  furniture: string;
  viewDetails: string;
};

const DEFAULT_T: PretScazutDict = {
  label: "Reduceri",
  heading: "",
  headingItalic: "Reducere",
  description: "Selectie de piese cu pret redus, disponibile cat timp sunt in stoc.",
  viewAll: "Toate reducerile",
  empty: "Momentan nu sunt produse la pret redus.",
  furniture: "Mobilier",
  viewDetails: "Vezi detalii",
};

function DiscountProductCard({
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
      <Card className="relative aspect-4/5 border border-red-200/60 bg-[#fcfbf9] shadow-[0_14px_34px_rgba(20,18,15,0.08)] transition-all duration-300 hover:shadow-[0_20px_42px_rgba(220,38,38,0.18)]">
        <Image
          src={getSafeImageSrc(product.imagine)}
          alt={numeDisplay}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/20 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_6px_18px_rgba(220,38,38,0.45)]">
          {product.procentReducere ? `-${product.procentReducere}%` : discountBadgeText(lang)}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {product.categorie || furniture}
          </p>
          <h3 className="mb-3 text-[20px] font-medium leading-tight text-white">{numeDisplay}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-red-400">
                {formatPriceInteger(product.pretReducere ?? product.pret, lang)}{" "}
                <span className="text-sm font-normal text-red-300">MDL</span>
              </p>
              <p className="text-xs text-white/50 line-through">
                {formatPriceInteger(product.pret, lang)} MDL
              </p>
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

export default function PretScazutSection({
  products,
  t = DEFAULT_T,
  lang = "ro",
}: {
  products: Product[];
  t?: PretScazutDict;
  lang?: string;
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#fdf5f3] py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-red-600/40" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-red-700/80">
                {t.label}
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-light text-[#1c1917] leading-tight">
              {t.heading} <span className="italic font-normal text-red-700">{t.headingItalic}</span>
            </h2>
            <p className="max-w-md text-sm text-[#78716c] leading-relaxed">
              {t.description}
            </p>
          </div>

          <Link
            href={`/${lang}/produse?categorie=Reduceri`}
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-red-700/80 transition-colors hover:text-red-800"
          >
            {t.viewAll}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <DiscountProductCard
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

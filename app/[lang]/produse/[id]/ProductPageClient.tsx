"use client";

import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Wrench,
  CreditCard,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useMemo } from "react";

import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import AddToCartButton from "@/src/components/cart/AddToCartButton";
import ProduseSimilare from "@/src/components/sections/ProduseSimilare";
import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { parseProductDescription } from "@/src/lib/parseProductDescription";

export type ProductPageProdus = {
  _id: string;
  nume: string;
  descriere: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  categorie?: string;
  areReducere?: boolean;
  pretReducere?: number;
  procentReducere?: number;
};

export type ProductPageDictProduct = {
  home: string;
  products: string;
  description: string;
  delivery: string;
  deliveryValue: string;
  warranty: string;
  warrantyValue: string;
  assembly: string;
  assemblyValue: string;
  payment: string;
  paymentValue: string;
  callNow: string;
  whatsapp: string;
  trustWarranty: string;
  trustDelivery: string;
  trustAssembly: string;
};

export default function ProductPageClient({
  produs,
  lang,
  t,
}: {
  produs: ProductPageProdus;
  lang: string;
  t: ProductPageDictProduct;
}) {
  const { text: numeDisplay } = useLiveRuText(produs.nume, lang);
  const { text: descDisplay, loading: descLoading } = useLiveRuText(produs.descriere, lang);

  const descriptionBlocks = useMemo(() => parseProductDescription(descDisplay), [descDisplay]);

  const FEATURES = [
    { icon: Truck, label: t.delivery, value: t.deliveryValue },
    { icon: ShieldCheck, label: t.warranty, value: t.warrantyValue },
    { icon: Wrench, label: t.assembly, value: t.assemblyValue },
    { icon: CreditCard, label: t.payment, value: t.paymentValue },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-3.5">
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e]">
            <Link href={`/${lang}`} className="hover:text-[#1c1917] transition-colors">
              {t.home}
            </Link>
            <span>/</span>
            <Link href={`/${lang}/produse`} className="hover:text-[#1c1917] transition-colors">
              {t.products}
            </Link>
            <span>/</span>
            {produs.categorie ? (
              <>
                <Link
                  href={`/${lang}/produse?categorie=${produs.categorie}`}
                  className="hover:text-[#1c1917] transition-colors"
                >
                  {produs.categorie}
                </Link>
                <span>/</span>
              </>
            ) : null}
            <span className="text-[#1c1917] truncate max-w-[200px]">{numeDisplay}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-start">
          <div className="relative">
            <ProductImageGallery imagine={produs.imagine} imagini={produs.imagini} alt={numeDisplay} />
            {produs.areReducere && (
              <span className="absolute left-4 top-4 z-10 rounded bg-red-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                {produs.procentReducere ? `-${produs.procentReducere}%` : "REDUCERE"}
              </span>
            )}
          </div>

          <div className="lg:sticky lg:top-8 flex flex-col gap-0">
            {produs.categorie ? (
              <Link
                href={`/${lang}/produse?categorie=${produs.categorie}`}
                className="self-start mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78716c] border border-[#d6d3d1] rounded-full px-3 py-1 hover:border-[#1c1917] hover:text-[#1c1917] transition-colors"
              >
                {produs.categorie}
              </Link>
            ) : null}

            <h1 className="text-3xl lg:text-[2.1rem] font-light text-[#1c1917] leading-[1.2] mb-5">
              {numeDisplay}
            </h1>

            <div className="flex flex-wrap items-end gap-3 mb-6">
              {produs.areReducere && produs.pretReducere ? (
                <>
                  <span className="text-4xl lg:text-5xl font-extralight text-red-600 leading-none tabular-nums">
                    {produs.pretReducere.toLocaleString("ro-RO")}
                  </span>
                  <span className="text-base text-red-400 mb-1">MDL</span>
                  <span className="text-2xl text-[#a8a29e] line-through leading-none mb-0.5 tabular-nums">
                    {produs.pret.toLocaleString("ro-RO")}
                  </span>
                  {produs.procentReducere && (
                    <span className="mb-1 rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                      -{produs.procentReducere}%
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-4xl lg:text-5xl font-extralight text-[#1c1917] leading-none tabular-nums">
                    {produs.pret.toLocaleString("ro-RO")}
                  </span>
                  <span className="text-base text-[#a8a29e] mb-1">MDL</span>
                </>
              )}
            </div>

            <div className="h-px bg-[#e7e5e4] mb-6" />

            <div className="mb-6">
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#a8a29e] mb-4">{t.description}</p>
              <div
                className={`space-y-4 ${lang === "ru" && descLoading ? "min-h-[120px] opacity-70" : ""}`}
                aria-busy={lang === "ru" && descLoading}
              >
                {descriptionBlocks.map((block, index) => {
                  if (block.type === "list") {
                    return (
                      <ul
                        key={`list-${index}`}
                        className="space-y-2 text-[#44403c] text-[14.5px] lg:text-[15px]"
                      >
                        {block.items.map((item, itemIndex) => (
                          <li
                            key={`item-${index}-${itemIndex}`}
                            className="flex items-start gap-3 leading-relaxed"
                          >
                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#a8a29e] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p
                      key={`paragraph-${index}`}
                      className="text-[#57534e] leading-[1.85] text-[14.5px] lg:text-[15.5px]"
                    >
                      {block.content}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-[#e7e5e4] mb-6" />

            <div className="grid grid-cols-2 gap-3 mb-7">
              {FEATURES.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg bg-white border border-[#e7e5e4] px-4 py-3"
                >
                  <Icon className="w-4 h-4 text-[#a8a29e] shrink-0" aria-hidden />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#a8a29e] leading-none mb-0.5">
                      {label}
                    </p>
                    <p className="text-[13px] font-medium text-[#1c1917]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <AddToCartButton
                produs={{
                  id: produs._id,
                  nume: numeDisplay,
                  pret: produs.pret,
                  imagine: produs.imagine,
                  slug: produs._id,
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+37369727444"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6d3d1] bg-white px-4 py-2.5 text-sm font-medium text-[#1c1917] transition-colors hover:border-[#1c1917]"
                >
                  <Phone className="w-4 h-4" aria-hidden />
                  {t.callNow}
                </a>
                <a
                  href="https://wa.me/37369727444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6d3d1] bg-white px-4 py-2.5 text-sm font-medium text-[#1c1917] transition-colors hover:border-[#1c1917]"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden />
                  {t.whatsapp}
                </a>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#a8a29e]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                {t.trustWarranty}
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" aria-hidden />
                {t.trustDelivery}
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" aria-hidden />
                {t.trustAssembly}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProduseSimilare produsId={produs._id} categorie={produs.categorie ?? ""} />
    </main>
  );
}

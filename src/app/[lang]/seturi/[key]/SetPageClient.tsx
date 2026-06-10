"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Truck,
  ShieldCheck,
  Wrench,
  CreditCard,
  Phone,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import { useCart } from "@/src/context/CartContext";
import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { parseProductDescription } from "@/src/lib/parseProductDescription";

export type SetDoc = {
  _id: string;
  key: string;
  nume: string;
  nume_ru?: string;
  descriere: string;
  descriere_ru?: string;
  imagine: string;
  imagini: string[];
};

export type SetProduct = {
  _id: string;
  nume: string;
  pret: number;
  imagine: string;
  areReducere?: boolean;
  pretReducere?: number;
};

export type SetPageDict = {
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
  setLabel: string;
  productsOfSet: string;
  productsCount: string;
  total: string;
  addAllToCart: string;
  addedToCart: string;
};

export default function SetPageClient({
  set,
  produseInSet,
  lang,
  t,
}: {
  set: SetDoc;
  produseInSet: SetProduct[];
  lang: string;
  t: SetPageDict;
}) {
  // Prefer admin-provided RU translation when on RU, fall back to live translation
  const numeSource = lang === "ru" && set.nume_ru?.trim() ? set.nume_ru : set.nume;
  const descSource = lang === "ru" && set.descriere_ru?.trim() ? set.descriere_ru : set.descriere;
  const { text: numeDisplay } = useLiveRuText(numeSource, set.nume_ru ? "ro" : lang);
  const { text: descDisplay } = useLiveRuText(descSource, set.descriere_ru ? "ro" : lang);
  const descriptionBlocks = useMemo(() => parseProductDescription(descDisplay), [descDisplay]);

  const FEATURES = [
    { icon: Truck, label: t.delivery, value: t.deliveryValue },
    { icon: ShieldCheck, label: t.warranty, value: t.warrantyValue },
    { icon: Wrench, label: t.assembly, value: t.assemblyValue },
    { icon: CreditCard, label: t.payment, value: t.paymentValue },
  ];

  // Track selected quantities per product (0 = not selected)
  const [qty, setQty] = useState<Record<string, number>>({});
  const setQ = (id: string, n: number) => setQty((p) => ({ ...p, [id]: Math.max(0, n) }));

  const totalPrice = produseInSet.reduce((sum, p) => {
    const q = qty[p._id] ?? 0;
    const price = p.areReducere && p.pretReducere ? p.pretReducere : p.pret;
    return sum + price * q;
  }, 0);

  const totalItems = produseInSet.reduce((sum, p) => sum + (qty[p._id] ?? 0), 0);

  const { adaugaInCos } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddAll = () => {
    for (const p of produseInSet) {
      const q = qty[p._id] ?? 0;
      const price = p.areReducere && p.pretReducere ? p.pretReducere : p.pret;
      for (let i = 0; i < q; i++) {
        adaugaInCos({
          id: p._id,
          nume: p.nume,
          pret: price,
          imagine: p.imagine,
          slug: p._id,
        });
      }
    }
    // Reset all quantities to 0 so re-clicking Add doesn't re-add the same items
    setQty({});
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Breadcrumb */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-3.5">
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e]">
            <Link href={`/${lang}`} className="hover:text-[#1c1917] transition-colors">{t.home}</Link>
            <span>/</span>
            <Link href={`/${lang}/produse`} className="hover:text-[#1c1917] transition-colors">{t.products}</Link>
            <span>/</span>
            <span className="text-[#1c1917] truncate max-w-[200px]">{numeDisplay}</span>
          </nav>
        </div>
      </div>

      {/* Gallery + summary */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-14 items-start">
          <div className="relative">
            <ProductImageGallery imagine={set.imagine} imagini={set.imagini} alt={numeDisplay} />
          </div>

          <div className="lg:sticky lg:top-[88px] flex flex-col">
            <span className="self-start mb-3 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78716c] border border-[#d6d3d1] rounded-full px-3 py-1">
              {t.setLabel}
            </span>
            <h1 className="text-2xl lg:text-3xl font-light text-[#1c1917] leading-snug mb-5">
              {numeDisplay}
            </h1>

            <div className="h-px bg-[#e7e5e4] mb-5" />

            <div className="grid grid-cols-2 gap-2 mb-5">
              {FEATURES.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg bg-white border border-[#e7e5e4] px-3 py-2.5">
                  <Icon className="w-4 h-4 text-[#a8a29e] shrink-0" aria-hidden />
                  <div>
                    <p className="text-[9.5px] uppercase tracking-[0.15em] text-[#a8a29e] leading-none mb-0.5">{label}</p>
                    <p className="text-[12.5px] font-medium text-[#1c1917]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
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

            <div className="h-px bg-[#e7e5e4] mb-5" />

            {/* Description */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#a8a29e] mb-3">{t.description}</p>
            <div className="space-y-3">
              {descriptionBlocks.map((block, index) => {
                if (block.type === "list") {
                  return (
                    <ul key={`list-${index}`} className="space-y-1.5 text-[#44403c] text-sm">
                      {block.items.map((item, itemIndex) => (
                        <li key={`item-${index}-${itemIndex}`} className="flex items-start gap-2.5 leading-relaxed">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#a8a29e] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={`paragraph-${index}`} className="text-[#57534e] leading-relaxed text-sm">
                    {block.content}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products in set */}
      <section className="mx-auto max-w-[1400px] px-6 lg:px-12 pb-14">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a8a29e]">{t.productsOfSet}</span>
          <div className="h-px flex-1 bg-[#e7e5e4]" />
          <span className="text-xs text-[#a8a29e]">{produseInSet.length} {t.productsCount}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {produseInSet.map((p) => {
            const q = qty[p._id] ?? 0;
            const price = p.areReducere && p.pretReducere ? p.pretReducere : p.pret;
            return (
              <article
                key={p._id}
                className="flex flex-col bg-white rounded-xl overflow-hidden border border-[#e7e5e4] transition-all duration-300 hover:border-[#1c1917]/40"
              >
                <Link href={`/${lang}/produse/${p._id}`} className="relative aspect-square block bg-[#f5f5f4] overflow-hidden">
                  <Image
                    src={p.imagine}
                    alt={p.nume}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                  {p.areReducere && (
                    <span className="absolute top-2 left-2 rounded-full bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                      Reducere
                    </span>
                  )}
                </Link>
                <div className="flex flex-col gap-2 p-3">
                  <Link
                    href={`/${lang}/produse/${p._id}`}
                    className="text-sm font-medium text-[#1c1917] line-clamp-2 min-h-[2.4em] leading-tight hover:text-[#78716c] transition-colors"
                  >
                    {p.nume}
                  </Link>
                  <p className="text-base font-light text-[#1c1917] tabular-nums">
                    {price.toLocaleString("ro-RO")} <span className="text-[10px] text-[#a8a29e]">MDL</span>
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center bg-[#fafaf9] rounded-lg border border-[#e7e5e4]">
                      <button
                        type="button"
                        onClick={() => setQ(p._id, q - 1)}
                        disabled={q <= 0}
                        className="flex items-center justify-center w-7 h-8 text-[#78716c] hover:text-[#1c1917] disabled:opacity-40"
                        aria-label="Scade"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#1c1917] tabular-nums">{q}</span>
                      <button
                        type="button"
                        onClick={() => setQ(p._id, q + 1)}
                        className="flex items-center justify-center w-7 h-8 text-[#78716c] hover:text-[#1c1917]"
                        aria-label="Crește"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-[#a8a29e] tabular-nums">
                      {q > 0 ? `${(price * q).toLocaleString("ro-RO")} MDL` : ""}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Total bar */}
        <div className="mt-8 sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e7e5e4] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-baseline gap-3">
            <span className="text-xs uppercase tracking-[0.15em] text-[#a8a29e]">{t.total}</span>
            <span className="text-2xl font-light text-[#1c1917] tabular-nums">
              {totalPrice.toLocaleString("ro-RO")} <span className="text-sm text-[#a8a29e]">MDL</span>
            </span>
            <span className="text-xs text-[#78716c]">{totalItems} {t.productsCount}</span>
          </div>
          <button
            type="button"
            onClick={handleAddAll}
            disabled={totalItems === 0}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors ${
              totalItems === 0
                ? "bg-[#d6d3d1] cursor-not-allowed"
                : added
                ? "bg-emerald-600"
                : "bg-[#1c1917] hover:bg-[#292524]"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {added ? t.addedToCart : t.addAllToCart}
          </button>
        </div>
      </section>
    </main>
  );
}

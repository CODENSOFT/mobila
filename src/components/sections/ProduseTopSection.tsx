"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { discountBadgeText } from "@/src/lib/discount";
import { formatPriceInteger } from "@/src/lib/formatPrice";
import { getSafeImageSrc } from "../../lib/image";
import type { Product } from "../../types/product";

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
  headingItalic: "populare",
  description: "Mobilier ales pentru confort și stil.",
  viewAll: "Toată colecția",
  furniture: "Mobilier",
  viewDetails: "Vezi detalii",
};

function TopProductCard({
  product,
  lang,
  furniture,
}: {
  product: Product;
  lang: string;
  furniture: string;
}) {
  const { text: numeDisplay } = useLiveRuText(product.nume, lang);
  return (
    <Link
      href={`/${lang}/produse/${product._id}`}
      className="group relative block w-full h-[300px] lg:h-[380px] overflow-hidden rounded-md bg-[#1c1917]"
    >
      <Image
        src={getSafeImageSrc(product.imagine)}
        alt={numeDisplay}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/85 via-[#0c0c0c]/10 to-transparent" />

      <span className="absolute left-2.5 top-2.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-amber-200 backdrop-blur-sm">
        Top
      </span>

      {product.areReducere && (
        <span className="absolute right-2.5 top-2.5 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
          {product.procentReducere ? `-${product.procentReducere}%` : discountBadgeText(lang)}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
          {product.categorie || furniture}
        </p>
        <h3 className="mb-2.5 text-sm lg:text-base font-medium leading-snug text-white line-clamp-2">
          {numeDisplay}
        </h3>
        {product.areReducere && product.pretReducere ? (
          <>
            <p className="text-base font-semibold text-red-400 leading-none">
              {formatPriceInteger(product.pretReducere, lang)}{" "}
              <span className="text-sm font-normal text-red-300">MDL</span>
            </p>
            <p className="mt-1 text-xs text-white/45 line-through">
              {formatPriceInteger(product.pret, lang)} MDL
            </p>
          </>
        ) : (
          <p className="text-base font-semibold text-white/95 leading-none">
            {formatPriceInteger(product.pret, lang)}{" "}
            <span className="text-sm font-normal text-white/60">MDL</span>
          </p>
        )}
      </div>
    </Link>
  );
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Anterior" : "Următor"}
      className="flex-none h-9 w-9 rounded-full border border-[#1c1917]/20 flex items-center justify-center text-[#1c1917] bg-white transition-all duration-200 hover:border-[#66a925] hover:bg-[#66a925] hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
    >
      {dir === "left" ? (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      )}
    </button>
  );
}

export default function ProduseTopSection({
  products: initialProducts,
  t = DEFAULT_T,
  lang = "ro",
}: {
  products: Product[];
  t?: ProduseTopDict;
  lang?: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const load = () =>
      fetch(`/api/home/produse-top?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (Array.isArray(data)) setProducts(data); })
        .catch(() => {});

    void load();

    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel("home-update");
      ch.onmessage = (e) => { if (e.data === "produse-top") void load(); };
    } catch {}
    return () => { ch?.close(); };
  }, []);

  /* ── Mobile carousel ── */
  const [mobileIndex, setMobileIndex] = useState(0);
  const prevMobile = () => setMobileIndex((i) => Math.max(0, i - 1));
  const nextMobile = () => setMobileIndex((i) => Math.min(products.length - 1, i + 1));

  /* ── Desktop scroll carousel ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows, { passive: true });
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  useEffect(() => { setMobileIndex(0); updateArrows(); }, [products, updateArrows]);

  const scrollDesktop = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-top-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : Math.floor(el.clientWidth / 3);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (products.length === 0) return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <p className="text-sm text-[#78716c]">Niciun produs de top disponibil momentan.</p>
      </div>
    </section>
  );

  const showDesktopArrows = products.length > 3;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">

          {/* Left panel */}
          <div className="lg:w-[260px] lg:flex-shrink-0 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#66a925]/40" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4f8f16]/70">
                {t.label}
              </span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-light text-[#1c1917] leading-tight mb-3">
              {t.heading && (
                <>
                  {t.heading}
                  <br />
                </>
              )}
              <span className="italic text-[#66a925]">{t.headingItalic}</span>
            </h2>
            <p className="text-sm text-[#78716c] leading-relaxed mb-6">
              {t.description}
            </p>
            <Link
              href={`/${lang}/produse`}
              className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#4f8f16]/70 transition-colors hover:text-[#4f8f16]"
            >
              {t.viewAll}
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* ── MOBILE: un card vizibil, dots + săgeți jos ── */}
          <div className="flex-1 min-w-0 lg:hidden">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {products.map((product) => (
                  <div key={product._id} className="w-full flex-none">
                    <TopProductCard product={product} lang={lang} furniture={t.furniture} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-5">
              <ArrowBtn dir="left" disabled={mobileIndex === 0} onClick={prevMobile} />
              <div className="flex items-center gap-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobileIndex(i)}
                    aria-label={`Produs ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === mobileIndex
                        ? "w-6 bg-[#66a925]"
                        : "w-2 bg-[#1c1917]/20 hover:bg-[#1c1917]/40"
                    }`}
                  />
                ))}
              </div>
              <ArrowBtn dir="right" disabled={mobileIndex === products.length - 1} onClick={nextMobile} />
            </div>
          </div>

          {/* ── DESKTOP: carousel scroll cu săgeți pe laterale ── */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center gap-3">
            {showDesktopArrows && (
              <ArrowBtn dir="left" disabled={!canLeft} onClick={() => scrollDesktop(-1)} />
            )}

            <div
              ref={trackRef}
              className="flex-1 min-w-0 flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {products.map((product) => (
                <div key={product._id} data-top-card className="flex-none w-[calc(33.333%-11px)]">
                  <TopProductCard product={product} lang={lang} furniture={t.furniture} />
                </div>
              ))}
            </div>

            {showDesktopArrows && (
              <ArrowBtn dir="right" disabled={!canRight} onClick={() => scrollDesktop(1)} />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

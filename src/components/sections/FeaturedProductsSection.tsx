"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { discountBadgeText } from "@/src/lib/discount";
import { formatPriceInteger } from "@/src/lib/formatPrice";
import { getSafeImageSrc } from "../../lib/image";
import type { Product } from "../../types/product";

type FeaturedDict = {
  label: string;
  heading: string;
  headingItalic: string;
  description: string;
  viewAll: string;
  empty: string;
  labels: string[];
  defaultLabel: string;
  furniture: string;
  viewDetails: string;
};

const DEFAULT_T: FeaturedDict = {
  label: "",
  heading: "Produse",
  headingItalic: "noi",
  description: "Descoperă cele mai noi colecții.",
  viewAll: "Toată colecția",
  empty: "Colecția va fi disponibilă în curând.",
  labels: ["Nou", "Popular", "Ediție Limitată", "Premium", "Sezon", "Recomandat"],
  defaultLabel: "Colecție",
  furniture: "Mobilier",
  viewDetails: "Vezi detalii",
};

function FeaturedProductCard({
  product,
  lang,
  label,
  furniture,
}: {
  product: Product;
  lang: string;
  label: string;
  furniture: string;
}) {
  const { text: numeDisplay } = useLiveRuText(product.nume, lang);
  return (
    <Link
      href={`/${lang}/produse/${product._id}`}
      className="group relative block w-full h-[240px] lg:h-[300px] overflow-hidden rounded-md bg-[#1c1917]"
    >
      <Image
        src={getSafeImageSrc(product.imagine)}
        alt={numeDisplay}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/85 via-[#0c0c0c]/10 to-transparent" />

      <span className="absolute left-2.5 top-2.5 rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
        {label}
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
      className="flex-none h-9 w-9 rounded-full border border-white/20 flex items-center justify-center text-white bg-white/10 transition-all duration-200 hover:border-[#66a925] hover:bg-[#66a925] hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
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

export default function FeaturedProductsSection({
  products: initialProducts,
  t = DEFAULT_T,
  lang = "ro",
}: {
  products: Product[];
  t?: FeaturedDict;
  lang?: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const load = () =>
      fetch(`/api/home/produse-noi?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (Array.isArray(data)) setProducts(data); })
        .catch(() => {});

    void load();

    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel("home-update");
      ch.onmessage = (e) => { if (e.data === "produse-noi") void load(); };
    } catch {}
    return () => { ch?.close(); };
  }, []);

  const displayed = products.slice(0, 6);

  /* ── Mobile carousel ── */
  const [mobileIndex, setMobileIndex] = useState(0);
  const prevMobile = () => setMobileIndex((i) => Math.max(0, i - 1));
  const nextMobile = () => setMobileIndex((i) => Math.min(displayed.length - 1, i + 1));

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
    const card = el.querySelector("[data-featured-card]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : Math.floor(el.clientWidth / 3);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (displayed.length === 0) {
    return (
      <section className="bg-[#1c1917] py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <p className="text-white/40">{t.empty}</p>
        </div>
      </section>
    );
  }

  const showDesktopArrows = displayed.length > 3;

  return (
    <section className="bg-[#1c1917] py-10 lg:py-14 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* ── Header editorial ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#66a925]/50" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-light text-white leading-[1.05]">
              {t.heading && <>{t.heading}<br /></>}
              <span className="italic text-[#66a925]">{t.headingItalic}</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3 lg:items-end lg:max-w-[280px]">
            <p className="text-sm text-white/45 leading-relaxed lg:text-right">
              {t.description}
            </p>
            <Link
              href={`/${lang}/produse`}
              className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#66a925]/70 transition-colors hover:text-[#66a925]"
            >
              {t.viewAll}
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── MOBILE: un card vizibil, dots + săgeți jos ── */}
        <div className="lg:hidden">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            >
              {displayed.map((product, index) => (
                <div key={product._id} className="w-full flex-none">
                  <FeaturedProductCard
                    product={product}
                    lang={lang}
                    label={t.labels[index] ?? t.defaultLabel}
                    furniture={t.furniture}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5">
            <ArrowBtn dir="left" disabled={mobileIndex === 0} onClick={prevMobile} />
            <div className="flex items-center gap-2">
              {displayed.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  aria-label={`Produs ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === mobileIndex ? "w-6 bg-[#66a925]" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <ArrowBtn dir="right" disabled={mobileIndex === displayed.length - 1} onClick={nextMobile} />
          </div>
        </div>

        {/* ── DESKTOP: carousel scroll cu săgeți ── */}
        <div className="hidden lg:flex items-center gap-3">
          {showDesktopArrows && (
            <ArrowBtn dir="left" disabled={!canLeft} onClick={() => scrollDesktop(-1)} />
          )}

          <div
            ref={trackRef}
            className="flex-1 min-w-0 flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayed.map((product, index) => (
              <div key={product._id} data-featured-card className="flex-none w-[calc(33.333%-11px)]">
                <FeaturedProductCard
                  product={product}
                  lang={lang}
                  label={t.labels[index] ?? t.defaultLabel}
                  furniture={t.furniture}
                />
              </div>
            ))}
            </div>

            {showDesktopArrows && (
              <ArrowBtn dir="right" disabled={!canRight} onClick={() => scrollDesktop(1)} />
            )}
          </div>

      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/src/context/LangContext";
import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { useSearchParams } from "next/navigation";
import { discountBadgeText } from "../../src/lib/discount";
import { getSafeImageSrc } from "../../src/lib/image";
import type { Product, ProductCategory } from "../../src/types/product";
import {
  PRODUCT_CATEGORY_GROUPS,
  getCategoriesForBucatarieGroup,
  getCategoriesForDormitorGroup,
} from "../../src/constants/categories";

type Category = "All" | "Reduceri" | ProductCategory;

const categories: Category[] = [
  "All",
  ...PRODUCT_CATEGORY_GROUPS.flatMap((group) => group.items),
] as Category[];

const isKnownCategory = (value: string): value is ProductCategory =>
  categories.includes(value as Category) && value !== "All";

/** Query values from home/footer cards vs keys stored on products / sidebar. */
const CATEGORY_QUERY_ALIASES: Record<string, ProductCategory> = {
  Dormitor: "Dormitoare",
  Bucatarii: "Bucătării",
};

const normalizeCategory = (value?: string | null): Category => {
  if (!value) return "All";
  const trimmed = value.trim();
  if (trimmed === "Reduceri") return "Reduceri";
  const resolved = CATEGORY_QUERY_ALIASES[trimmed] ?? trimmed;
  return isKnownCategory(resolved) ? resolved : "All";
};

const DORMITOR_CATEGORY_SET = new Set<ProductCategory>(getCategoriesForDormitorGroup());
const BUCATARIE_CATEGORY_SET = new Set<ProductCategory>(getCategoriesForBucatarieGroup());

type SortKey = "featured" | "price-asc" | "price-desc";

function SortDropdown({
  sortBy,
  setSortBy,
  t,
}: {
  sortBy: SortKey;
  setSortBy: (v: SortKey) => void;
  t: { sortFeatured: string; sortPriceAsc: string; sortPriceDesc: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: SortKey; label: string }[] = [
    { value: "featured", label: t.sortFeatured },
    { value: "price-asc", label: t.sortPriceAsc },
    { value: "price-desc", label: t.sortPriceDesc },
  ];

  const current = options.find((o) => o.value === sortBy)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-4 py-2.5 text-sm text-[#1c1917] transition-colors hover:border-[#1c1917]/30 hover:bg-white"
      >
        <svg className="h-3.5 w-3.5 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
        </svg>
        <span className="font-medium">{current.label}</span>
        <svg
          className={`h-3.5 w-3.5 text-[#a8a29e] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[#e7e5e4] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setSortBy(opt.value); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-[#fafaf9] ${
                opt.value === sortBy
                  ? "font-medium text-[#1c1917]"
                  : "text-[#78716c]"
              }`}
            >
              {opt.label}
              {opt.value === sortBy && (
                <svg className="h-3.5 w-3.5 text-[#1c1917]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductGridCard({
  produs,
  lang,
  categoryTag,
  viewDetails,
  formatPrice,
}: {
  produs: Product;
  lang: string;
  categoryTag: string | undefined;
  viewDetails: string;
  formatPrice: (n: number) => string;
}) {
  const { text: numeDisplay } = useLiveRuText(produs.nume, lang);
  return (
    <Link href={`/${lang}/produse/${produs._id}`} className="group relative block bg-white rounded-sm overflow-hidden">
      <div className="relative aspect-4/5 overflow-hidden bg-[#f5f5f4]">
        <Image
          src={getSafeImageSrc(produs.imagine)}
          alt={numeDisplay}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-[#0c0c0c]/0 transition-colors duration-300 group-hover:bg-[#0c0c0c]/20" />

{categoryTag ? (
          <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-[#1c1917]">
            {categoryTag}
          </span>
        ) : null}
        {produs.areReducere && (
          <span className="absolute right-4 top-4 rounded bg-red-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {produs.procentReducere ? `-${produs.procentReducere}%` : discountBadgeText(lang)}
          </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-base font-medium text-[#1c1917] mb-1 group-hover:text-[#78716c] transition-colors">
          {numeDisplay}
        </h2>
        {produs.areReducere && produs.pretReducere ? (
          <div>
            <p className="text-lg font-light text-red-600">
              {formatPrice(produs.pretReducere)} <span className="text-sm text-red-400">MDL</span>
            </p>
            <p className="text-sm text-[#a8a29e] line-through">
              {formatPrice(produs.pret)} MDL
            </p>
          </div>
        ) : (
          <p className="text-lg font-light text-[#1c1917]">
            {formatPrice(produs.pret)} <span className="text-sm text-[#a8a29e]">MDL</span>
          </p>
        )}
      </div>
    </Link>
  );
}

export default function ProduseClient({ produse }: { produse: Product[] }) {
  const { lang, dict } = useLang();
  const t = dict.products;
  const tReduceri = dict.pretScazut;
  const formatNumber = (value: number) => value.toLocaleString("ro-RO");
  const searchParams = useSearchParams();
  const categoryFromUrlValid = normalizeCategory(searchParams.get("categorie"));
  const minAvailablePrice = produse.length > 0 ? Math.min(...produse.map((p) => p.pret)) : 0;
  const maxAvailablePrice = produse.length > 0 ? Math.max(...produse.map((p) => p.pret)) : 0;

  const discountedProducts = useMemo(
    () =>
      produse.filter(
        (p) => p.areReducere && typeof p.pretReducere === "number"
      ),
    [produse]
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const activeCategory: Category = selectedCategory ?? categoryFromUrlValid;

  const categoryLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of t.categoryGroups) {
      for (const item of group.items) {
        map.set(item.key, item.label);
      }
    }
    return map;
  }, [t.categoryGroups]);

  const filteredProducts = useMemo(() => {
    let list = produse;

    if (activeCategory === "Reduceri") {
      list = list.filter(
        (produs) => produs.areReducere && typeof produs.pretReducere === "number"
      );
    } else if (activeCategory !== "All") {
      if (activeCategory === "Dormitoare") {
        list = list.filter(
          (produs) =>
            typeof produs.categorie === "string" &&
            DORMITOR_CATEGORY_SET.has(produs.categorie as ProductCategory)
        );
      } else if (activeCategory === "Bucătării") {
        list = list.filter(
          (produs) =>
            typeof produs.categorie === "string" &&
            BUCATARIE_CATEGORY_SET.has(produs.categorie as ProductCategory)
        );
      } else {
        list = list.filter((produs) => produs.categorie === activeCategory);
      }
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (produs) =>
          produs.nume.toLowerCase().includes(q) ||
          produs.descriere.toLowerCase().includes(q) ||
          (produs.categorie ?? "").toLowerCase().includes(q)
      );
    }

    const from = Number(priceFrom);
    const to = Number(priceTo);
    const hasFrom = priceFrom.trim() !== "" && !Number.isNaN(from);
    const hasTo = priceTo.trim() !== "" && !Number.isNaN(to);

    if (hasFrom) {
      list = list.filter((produs) => produs.pret >= from);
    }

    if (hasTo) {
      list = list.filter((produs) => produs.pret <= to);
    }

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.pret - b.pret);
    }

    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.pret - a.pret);
    }

    return list;
  }, [activeCategory, priceFrom, priceTo, produse, query, sortBy]);

  const hasActiveFilter = activeCategory !== "All" || priceFrom !== "" || priceTo !== "";

  const activeCategoryLabel =
    activeCategory === "All"
      ? null
      : activeCategory === "Reduceri"
      ? tReduceri.label
      : (categoryLabel.get(activeCategory as ProductCategory) ?? activeCategory);

  const filterContent = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
          {t.categories}
        </h3>
        <div className="space-y-0.5 mb-5">
          <button
            onClick={() => { setSelectedCategory("All"); setIsFilterOpen(false); }}
            className={`w-full flex items-center justify-between py-3 text-sm transition-colors ${
              activeCategory === "All"
                ? "text-[#1c1917] font-medium"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span className="flex items-center gap-3">
              {activeCategory === "All" && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1c1917]" />
              )}
              <span className={activeCategory === "All" ? "ml-0" : "ml-4.5"}>{t.all}</span>
            </span>
            <span className="text-xs text-[#a8a29e]">{produse.length}</span>
          </button>
          {discountedProducts.length > 0 && (
            <button
              onClick={() => { setSelectedCategory("Reduceri"); setIsFilterOpen(false); }}
              className={`w-full flex items-center justify-between py-3 text-sm transition-colors ${
                activeCategory === "Reduceri"
                  ? "text-red-700 font-medium"
                  : "text-red-700/80 hover:text-red-700"
              }`}
            >
              <span className="flex items-center gap-3">
                {activeCategory === "Reduceri" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                )}
                <span className={activeCategory === "Reduceri" ? "ml-0" : "ml-4.5"}>
                  {tReduceri.label}
                </span>
              </span>
              <span className="text-xs text-red-500/70">{discountedProducts.length}</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {t.categoryGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeCategory === item.key;
                  const count = produse.filter((p) => p.categorie === item.key).length;
                  return (
                    <button
                      key={`${group.title}-${item.key}`}
                      onClick={() => { setSelectedCategory(item.key as ProductCategory); setIsFilterOpen(false); }}
                      className={`w-full flex items-center justify-between py-2.5 text-sm transition-colors ${
                        isActive
                          ? "text-[#1c1917] font-medium"
                          : "text-[#78716c] hover:text-[#1c1917]"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1c1917]" />
                        )}
                        <span className={isActive ? "ml-0" : "ml-4.5"}>
                          {item.label}
                        </span>
                      </span>
                      <span className="text-xs text-[#a8a29e]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-6 border-t border-[#e7e5e4]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
          {t.price}
        </h3>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-[#78716c]">{t.from}</span>
            <input
              type="number"
              min={0}
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder={`${formatNumber(minAvailablePrice)}`}
              className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#1c1917] focus:outline-none transition-colors"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-[#78716c]">{t.to}</span>
            <input
              type="number"
              min={0}
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder={`${formatNumber(maxAvailablePrice)}`}
              className="w-full rounded-lg border border-[#e7e5e4] bg-white px-3 py-2.5 text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#1c1917] focus:outline-none transition-colors"
            />
          </label>
          <p className="pt-1 text-xs text-[#a8a29e]">
            {t.priceRange}: {formatNumber(minAvailablePrice)} - {formatNumber(maxAvailablePrice)} MDL
          </p>
        </div>
      </div>

      {/* Contact CTA - desktop only */}
      <div className="hidden lg:block pt-6 border-t border-[#e7e5e4]">
        <p className="text-sm text-[#78716c] mb-3">{t.contactCta}</p>
        <Link
          href={`/${lang}/contact`}
          className="text-sm font-medium text-[#1c1917] underline underline-offset-4 hover:text-[#78716c] transition-colors"
        >
          {t.contactLink}
        </Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#1c1917]/20" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
              {t.shop}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-[#1c1917] leading-tight">
                {t.collectionHeading} <span className="italic font-normal">{t.collectionItalic}</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#78716c] leading-relaxed">{t.collectionDesc}</p>
            </div>

            {/* Search & Sort - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-64 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] pl-10 pr-4 py-2.5 text-sm focus:border-[#1c1917] focus:outline-none transition-colors"
                />
              </div>
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} t={t} />
            </div>
          </div>

          {/* Mobile toolbar */}
          <div className="lg:hidden mt-6 flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 border border-[#e7e5e4] rounded-lg text-sm font-medium bg-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {t.filters}
              {hasActiveFilter && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#1c1917] text-white text-[9px] flex items-center justify-center font-bold">
                  1
                </span>
              )}
            </button>

            {/* Active filter chip */}
            {activeCategoryLabel && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1c1917] text-white text-xs rounded-full font-medium">
                {activeCategoryLabel}
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="ml-0.5 opacity-70 hover:opacity-100"
                  aria-label="Clear filter"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}

            <span className="ml-auto text-sm text-[#78716c]">{filteredProducts.length} {t.productsCount}</span>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e5e4] shrink-0">
            <div>
              <h2 className="text-base font-semibold text-[#1c1917]">{t.filters}</h2>
              {activeCategoryLabel && (
                <p className="text-xs text-[#78716c] mt-0.5">{activeCategoryLabel}</p>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 -mr-1 rounded-full text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4] transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable filter content */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {filterContent}

            {/* Contact CTA inside mobile drawer */}
            <div className="mt-8 pt-6 border-t border-[#e7e5e4]">
              <p className="text-sm text-[#78716c] mb-3">{t.contactCta}</p>
              <Link
                href={`/${lang}/contact`}
                onClick={() => setIsFilterOpen(false)}
                className="text-sm font-medium text-[#1c1917] underline underline-offset-4"
              >
                {t.contactLink}
              </Link>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 px-5 pb-6 pt-4 border-t border-[#e7e5e4]">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full bg-[#1c1917] text-white py-4 text-sm font-medium tracking-[0.08em] uppercase rounded-sm"
            >
              {t.showing} {filteredProducts.length} {t.productsCount}
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 lg:py-12">
        <div className="flex gap-12 lg:gap-16">

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="lg:sticky lg:top-8">
              {filterContent}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f4] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-[#78716c]">{t.noResults}</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setQuery("");
                    setPriceFrom("");
                    setPriceTo("");
                  }}
                  className="mt-4 text-sm font-medium text-[#1c1917] hover:underline"
                >
                  {t.resetFilters}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-[#78716c]">
                    {t.showing} <span className="font-medium text-[#1c1917]">{filteredProducts.length}</span> {t.productsCount}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((produs) => (
                    <ProductGridCard
                      key={produs._id}
                      produs={produs}
                      lang={lang}
                      categoryTag={
                        produs.categorie
                          ? categoryLabel.get(produs.categorie) ?? produs.categorie
                          : undefined
                      }
                      viewDetails={t.viewDetails}
                      formatPrice={formatNumber}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/src/context/LangContext";
import { useLiveRuText } from "@/src/hooks/useLiveRuText";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { discountBadgeText } from "../../src/lib/discount";
import { getSafeImageSrc } from "../../src/lib/image";
import { fetchCustomCategories, type CustomCategory } from "../../src/lib/customCategories";
import type { Product, ProductCategory } from "../../src/types/product";
import {
  PRODUCT_CATEGORY_GROUPS,
  getCategoriesForBucatarieGroup,
  getCategoriesForDormitorGroup,
} from "../../src/constants/categories";

type Category = "All" | "Reduceri" | ProductCategory | string;

/** Query values from home/footer cards vs keys stored on products / sidebar. */
const CATEGORY_QUERY_ALIASES: Record<string, string> = {
  Dormitor: "Dormitoare",
  Bucatarii: "Bucătării",
};

const normalizeCategory = (value?: string | null): Category => {
  if (!value) return "All";
  const trimmed = value.trim();
  if (!trimmed) return "All";
  if (trimmed === "Reduceri") return "Reduceri";
  return (CATEGORY_QUERY_ALIASES[trimmed] ?? trimmed) as Category;
};

const DORMITOR_CATEGORY_SET = new Set<ProductCategory>(getCategoriesForDormitorGroup());
const BUCATARIE_CATEGORY_SET = new Set<ProductCategory>(getCategoriesForBucatarieGroup());

type SortKey = "featured" | "price-asc" | "price-desc";

/** Translates a Romanian label to Russian when needed; falls back to source for RO. */
function TranslatedText({ text, lang }: { text: string; lang: string }) {
  const { text: translated } = useLiveRuText(text, lang);
  return <>{translated}</>;
}

function CategoryPill({
  label,
  isActive,
  onClick,
  variant = "default",
  size = "md",
  lang = "ro",
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "default" | "reduceri";
  size?: "sm" | "md";
  lang?: string;
}) {
  const isReduceri = variant === "reduceri";
  const padding = size === "sm" ? "py-2 px-3" : "py-2.5 px-3";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/pill relative w-full text-left ${padding} text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? isReduceri
            ? "bg-red-50 text-red-700 font-medium"
            : "bg-[#1c1917] text-white font-medium"
          : isReduceri
          ? "text-red-700/85 hover:bg-red-50/60 hover:text-red-700"
          : "text-[#57534e] hover:bg-[#f5f5f4] hover:text-[#1c1917]"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`h-3.5 w-0.5 rounded-full transition-colors ${
            isActive
              ? isReduceri
                ? "bg-red-600"
                : "bg-white"
              : "bg-transparent group-hover/pill:bg-[#d6d3d1]"
          }`}
        />
        <span className="truncate"><TranslatedText text={label} lang={lang} /></span>
      </span>
    </button>
  );
}

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
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-[#0c0c0c]/0 transition-colors duration-300 group-hover:bg-[#0c0c0c]/20" />

        {categoryTag ? (
          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm text-[8px] sm:text-[10px] font-medium uppercase tracking-wider text-[#1c1917]">
            <TranslatedText text={categoryTag} lang={lang} />
          </span>
        ) : null}
        {produs.areReducere && (
          <span className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded bg-red-600 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
            {produs.procentReducere ? `-${produs.procentReducere}%` : discountBadgeText(lang)}
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-5">
        <h2 className="text-[13px] sm:text-base font-medium text-[#1c1917] mb-1 leading-tight line-clamp-2 min-h-[2.4em] sm:min-h-0 group-hover:text-[#78716c] transition-colors">
          {numeDisplay}
        </h2>
        {produs.areReducere && produs.pretReducere ? (
          <div>
            <p className="text-sm sm:text-lg font-light text-red-600 leading-tight">
              {formatPrice(produs.pretReducere)} <span className="text-[10px] sm:text-sm text-red-400">MDL</span>
            </p>
            <p className="text-[11px] sm:text-sm text-[#a8a29e] line-through leading-tight">
              {formatPrice(produs.pret)} MDL
            </p>
          </div>
        ) : (
          <p className="text-sm sm:text-lg font-light text-[#1c1917] leading-tight">
            {formatPrice(produs.pret)} <span className="text-[10px] sm:text-sm text-[#a8a29e]">MDL</span>
          </p>
        )}
      </div>
    </Link>
  );
}

function SetGridCard({
  name,
  products,
  onSelect,
  setLabel,
  productsCountLabel,
  collectionLabel,
}: {
  name: string;
  products: Product[];
  onSelect: (setName: string) => void;
  setLabel: string;
  productsCountLabel: string;
  collectionLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className="group relative block w-full text-left bg-white rounded-sm overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-[#f5f5f4]">
        <Image
          src={getSafeImageSrc(products[0].imagine)}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-[#0c0c0c]/0 transition-colors duration-300 group-hover:bg-[#0c0c0c]/20" />

        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm text-[8px] sm:text-[10px] font-medium uppercase tracking-wider text-[#1c1917]">
          {setLabel} · {products.length}
        </span>
      </div>

      <div className="p-2.5 sm:p-5">
        <h2 className="text-[13px] sm:text-base font-medium text-[#1c1917] mb-0.5 sm:mb-1 leading-tight line-clamp-2 group-hover:text-[#78716c] transition-colors">
          {setLabel} {name}
        </h2>
        <p className="text-[11px] sm:text-sm text-[#a8a29e]">{products.length} {collectionLabel || productsCountLabel}</p>
      </div>
    </button>
  );
}

// Static fallback images per section, used when no product image is available.
const SECTION_FALLBACK_IMAGES: Record<string, string> = {
  "PENTRU DORMITOR": "/images/categories/dormitor.png",
  "SALTELE ȘI TOPPERE": "/images/categories/dormitor.png",
  "PENTRU BUCĂTĂRIE": "/images/categories/bucatarii.png",
  "PENTRU LIVING": "/images/categories/mese.png",
  "PENTRU HOL": "/images/categories/dulapuri.png",
};

function SectionCards({
  produse,
  onSelect,
  sectionLabels,
  seeLabel,
}: {
  produse: Product[];
  onSelect: (groupTitle: string, firstItemKey: string) => void;
  sectionLabels: Record<string, string>;
  seeLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
      {PRODUCT_CATEGORY_GROUPS.map((group) => {
        // Try to find a representative product image from this group first
        const sample = produse.find((p) => {
          const grup = (typeof p.grup === "string" && p.grup.trim()) || (() => {
            if (typeof p.categorie !== "string") return undefined;
            const found = PRODUCT_CATEGORY_GROUPS.find((g) =>
              (g.items as readonly string[]).includes(p.categorie!)
            );
            return found?.title;
          })();
          return grup === group.title;
        });

        const fallback = SECTION_FALLBACK_IMAGES[group.title];
        const imageSrc = sample
          ? getSafeImageSrc(sample.imagine)
          : fallback ?? getSafeImageSrc(produse[0]?.imagine ?? "");
        const friendly = sectionLabels[group.title] ?? group.title;
        const firstItem = group.items[0];

        return (
          <button
            key={group.title}
            type="button"
            onClick={() => onSelect(group.title, firstItem)}
            className="group relative block w-full text-left bg-white rounded-lg overflow-hidden border border-[#e7e5e4] transition-all duration-300 hover:border-[#1c1917]/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="relative aspect-square sm:aspect-[4/3] bg-[#f5f5f4] overflow-hidden">
              <Image
                src={imageSrc}
                alt={friendly}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-4 sm:right-4 flex items-end justify-between gap-2">
                <h3 className="text-sm sm:text-lg font-medium text-white drop-shadow leading-tight">
                  {friendly}
                </h3>
                <span className="hidden sm:inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#1c1917]">
                  {seeLabel}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ProductsDisplay({
  filteredProducts,
  allProducts,
  customCategories,
  lang,
  categoryLabel,
  t,
  formatNumber,
  activeCategory,
  selectedGroup,
  selectedSet,
  onSelectSet,
  onClearSet,
}: {
  filteredProducts: Product[];
  allProducts: Product[];
  customCategories: CustomCategory[];
  lang: string;
  categoryLabel: Map<string, string>;
  t: {
    showing: string;
    productsCount: string;
    viewDetails: string;
    set: string;
    setsCountSingular: string;
    setsCountPlural: string;
    setProductsInCollection: string;
    backToSets: string;
    noSetsInSection: string;
  };
  formatNumber: (n: number) => string;
  activeCategory: Category;
  selectedGroup: string | null;
  selectedSet: string | null;
  onSelectSet: (setName: string) => void;
  onClearSet: () => void;
}) {
  // Display modes:
  // - When a set is drilled into (selectedSet is set) → show products of that set individually
  // - "sets-only": aggregator views (Dormitoare, Bucătării, Livinguri, Antreuri, Hol, Toate saltelele)
  //   show ONLY set cards, no individual products
  // - "individual-only": everything else (Toate, Reduceri, specific sub-categories)
  //   shows all products individually
  const displayMode: "sets-only" | "individual-only" = useMemo(() => {
    if (selectedSet) return "individual-only";
    if (selectedGroup) {
      const grp = PRODUCT_CATEGORY_GROUPS.find((g) => g.title === selectedGroup);
      if (grp && grp.items[0] === activeCategory) return "sets-only";
    }
    return "individual-only";
  }, [activeCategory, selectedGroup, selectedSet]);

  const gridItems = useMemo(() => {
    if (displayMode === "individual-only") {
      return filteredProducts.map((p) => ({ type: "product" as const, product: p }));
    }

    // sets-only mode: strict detection by effective group of each product.
    // A set appears under a group ONLY if it has at least one product whose
    // effective group matches that group. Effective group =
    // explicit `grup` field (admin-set) OR inferred from `categorie` via
    // custom categories (DB) then hardcoded items.
    const effectiveGroupOfProd = (p: Product): string | undefined => {
      if (typeof p.grup === "string" && p.grup.trim()) return p.grup.trim();
      if (typeof p.categorie !== "string") return undefined;
      const cust = customCategories.find((c) => !c.hidden && c.key === p.categorie);
      if (cust) return cust.grup;
      const grp = PRODUCT_CATEGORY_GROUPS.find((g) =>
        (g.items as readonly string[]).includes(p.categorie!)
      );
      return grp?.title;
    };

    const setsMap = new Map<string, Product[]>();
    for (const p of allProducts) {
      const key = p.set?.trim();
      if (!key) continue;
      if (!setsMap.has(key)) setsMap.set(key, []);
      setsMap.get(key)!.push(p);
    }

    const result: ({ type: "set"; name: string; products: Product[] } | { type: "product"; product: Product })[] = [];
    for (const [name, products] of setsMap.entries()) {
      // Set qualifies only if at least one product has effective group === selectedGroup
      const productsInGroup = products.filter(
        (p) => effectiveGroupOfProd(p) === selectedGroup
      );
      if (productsInGroup.length > 0) {
        result.push({ type: "set", name, products: productsInGroup });
      }
    }

    return result;
  }, [allProducts, customCategories, displayMode, selectedGroup]);

  const setsCount = gridItems.filter((i) => i.type === "set").length;

  return (
    <>
      {/* Set breadcrumb / back button — shown when drilled into a set */}
      {selectedSet && (
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClearSet}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e7e5e4] bg-white px-3 py-1.5 text-xs font-medium text-[#78716c] hover:border-[#1c1917]/30 hover:text-[#1c1917] transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t.backToSets}
          </button>
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a8a29e]">{t.set}</span>
          <span className="text-sm font-medium text-[#1c1917]">{selectedSet}</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[#78716c]">
          {displayMode === "sets-only" ? (
            <>
              {t.showing} <span className="font-medium text-[#1c1917]">{setsCount}</span> {setsCount === 1 ? t.setsCountSingular : t.setsCountPlural}
            </>
          ) : (
            <>
              {t.showing} <span className="font-medium text-[#1c1917]">{filteredProducts.length}</span> {t.productsCount}
            </>
          )}
        </p>
      </div>

      {displayMode === "sets-only" && gridItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f5f5f4] flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-[#78716c]">{t.noSetsInSection}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
          {gridItems.map((item) =>
            item.type === "set" ? (
              <SetGridCard
                key={`set-${item.name}`}
                name={item.name}
                products={item.products}
                onSelect={onSelectSet}
                setLabel={t.set}
                productsCountLabel={t.productsCount}
                collectionLabel={t.setProductsInCollection}
              />
            ) : (
              <ProductGridCard
                key={item.product._id}
                produs={item.product}
                lang={lang}
                categoryTag={
                  item.product.categorie
                    ? categoryLabel.get(item.product.categorie) ?? item.product.categorie
                    : undefined
                }
                viewDetails={t.viewDetails}
                formatPrice={formatNumber}
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default function ProduseClient({ produse }: { produse: Product[] }) {
  const { lang, dict } = useLang();
  const t = dict.products;
  const tReduceri = dict.pretScazut;
  const formatNumber = (value: number) => value.toLocaleString("ro-RO");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Source of truth: URL search params. This way browser back from a product page
  // returns to the same filtered view we left from.
  const activeCategory: Category = normalizeCategory(searchParams.get("categorie"));
  const selectedGroup = searchParams.get("grup");
  const selectedSet = searchParams.get("set");

  const minAvailablePrice = produse.length > 0 ? Math.min(...produse.map((p) => p.pret)) : 0;
  const maxAvailablePrice = produse.length > 0 ? Math.max(...produse.map((p) => p.pret)) : 0;

  const discountedProducts = useMemo(
    () =>
      produse.filter(
        (p) => p.areReducere && typeof p.pretReducere === "number"
      ),
    [produse]
  );

  const updateFilters = useCallback(
    (updates: { categorie?: Category | null; grup?: string | null; set?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("categorie" in updates) {
        if (updates.categorie && updates.categorie !== "All") params.set("categorie", updates.categorie);
        else params.delete("categorie");
      }
      if ("grup" in updates) {
        if (updates.grup) params.set("grup", updates.grup);
        else params.delete("grup");
      }
      if ("set" in updates) {
        if (updates.set) params.set("set", updates.set);
        else params.delete("set");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Live custom categories from DB, merged into sidebar groups
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchCustomCategories().then((data) => {
      if (!cancelled) setCustomCategories(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const sidebarGroups = useMemo(() => {
    // Each sidebar group has:
    // - storageKey: the canonical group identifier used in DB / URL filtering (e.g. "PENTRU BUCĂTĂRIE")
    // - title: the translated label shown to the user (e.g. "ДЛЯ КУХНИ" in Russian)
    // This decouples display from filtering so non-Romanian languages work.
    const groups: { storageKey: string; title: string; items: { key: string; label: string }[] }[] = [];
    const ensureGroup = (storageKey: string, title: string) => {
      let g = groups.find((g) => g.storageKey === storageKey);
      if (!g) {
        g = { storageKey, title, items: [] };
        groups.push(g);
      }
      return g;
    };
    // Use PRODUCT_CATEGORY_GROUPS for canonical order + storage keys, pair with
    // translated titles from the dictionary by index (dict order matches constants).
    PRODUCT_CATEGORY_GROUPS.forEach((hard, idx) => {
      const dictGroup = t.categoryGroups[idx];
      const displayTitle = dictGroup?.title ?? hard.title;
      ensureGroup(hard.title, displayTitle);
    });

    const sorted = [...customCategories]
      .filter((c) => !c.hidden)
      .sort((a, b) => {
        const oa = typeof a.ordine === "number" ? a.ordine : 0;
        const ob = typeof b.ordine === "number" ? b.ordine : 0;
        if (oa !== ob) return oa - ob;
        return a.label.localeCompare(b.label);
      });
    for (const c of sorted) {
      // Custom category's grup is already a storage key from admin
      ensureGroup(c.grup, c.grup).items.push({ key: c.key, label: c.label });
    }
    return groups.filter((g) => g.items.length > 0);
  }, [t.categoryGroups, customCategories]);

  const categoryLabel = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of sidebarGroups) {
      for (const item of group.items) {
        map.set(item.key, item.label);
      }
    }
    return map;
  }, [sidebarGroups]);

  // Compute the effective group of a product:
  // - explicit `grup` field if set
  // - otherwise infer from the first matching group containing its `categorie`
  //   (checking custom categories from DB first, then hardcoded list)
  const getEffectiveGroup = (p: Product): string | undefined => {
    if (typeof p.grup === "string" && p.grup.trim()) return p.grup.trim();
    if (typeof p.categorie !== "string") return undefined;
    // Custom categories take precedence
    const cust = customCategories.find((c) => !c.hidden && c.key === p.categorie);
    if (cust) return cust.grup;
    const grp = PRODUCT_CATEGORY_GROUPS.find((g) =>
      (g.items as readonly string[]).includes(p.categorie!)
    );
    return grp?.title;
  };

  // Strict matching: product belongs to a group only via its EFFECTIVE group.
  const matchesGroup = (p: Product, group: string): boolean =>
    getEffectiveGroup(p) === group;

  // Detect aggregator (first item of a group, e.g. "Bucătării", "Livinguri", "Hol").
  const isAggregator = (cat: Category, group: string | null): boolean => {
    if (!group) return false;
    const grp = PRODUCT_CATEGORY_GROUPS.find((g) => g.title === group);
    return Boolean(grp && grp.items[0] === cat);
  };

  const filteredProducts = useMemo(() => {
    let list = produse;

    if (activeCategory === "Reduceri") {
      list = list.filter(
        (produs) => produs.areReducere && typeof produs.pretReducere === "number"
      );
    } else if (activeCategory !== "All") {
      if (selectedGroup && isAggregator(activeCategory, selectedGroup)) {
        // Aggregator: ALL products belonging to this group (by grup or by categorie membership)
        list = list.filter((produs) => matchesGroup(produs, selectedGroup));
      } else if (selectedGroup) {
        // Sub-category in a specific group
        list = list.filter(
          (produs) =>
            produs.categorie === activeCategory && matchesGroup(produs, selectedGroup)
        );
      } else {
        // No group context — just filter by categorie
        list = list.filter((produs) => produs.categorie === activeCategory);
      }
    }

    // If a specific set is selected (after clicking a set card), narrow further
    if (selectedSet) {
      list = list.filter((produs) => produs.set?.trim() === selectedSet);
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
  }, [activeCategory, selectedGroup, selectedSet, priceFrom, priceTo, produse, query, sortBy]);

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
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1c1917]/45 mb-4">
          {t.categories}
        </h3>
        {discountedProducts.length > 0 && (
          <div className="space-y-1 mb-6">
            <CategoryPill
              label={tReduceri.label}
              isActive={activeCategory === "Reduceri"}
              variant="reduceri"
              lang={lang}
              onClick={() => { updateFilters({ categorie: "Reduceri", grup: null, set: null }); setIsFilterOpen(false); }}
            />
          </div>
        )}

        <div className="space-y-5">
          {sidebarGroups.map((group) => (
            <div key={group.storageKey}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-3 bg-[#d6d3d1]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a8a29e]">
                  <TranslatedText text={group.title} lang={lang} />
                </p>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activeCategory === item.key && selectedGroup === group.storageKey;
                  return (
                    <CategoryPill
                      key={`${group.storageKey}-${item.key}`}
                      label={item.label}
                      isActive={isActive}
                      lang={lang}
                      onClick={() => {
                        updateFilters({
                          categorie: item.key as ProductCategory,
                          grup: group.storageKey,
                          set: null,
                        });
                        setIsFilterOpen(false);
                      }}
                      size="sm"
                    />
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
                  onClick={() => updateFilters({ categorie: null, grup: null, set: null })}
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

          {/* Sidebar - Desktop only, independently scrollable */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain pr-3 -mr-3 [scrollbar-width:thin] [scrollbar-color:#d6d3d1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#d6d3d1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {filterContent}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {activeCategory === "All" && !selectedGroup && !selectedSet && !query && !priceFrom && !priceTo ? (
              <SectionCards
                produse={produse}
                onSelect={(groupTitle, firstItemKey) =>
                  updateFilters({ categorie: firstItemKey as Category, grup: groupTitle, set: null })
                }
                sectionLabels={(t as unknown as { sectionLabels?: Record<string, string> }).sectionLabels ?? {}}
                seeLabel={(t as unknown as { see?: string }).see ?? "Vezi"}
              />
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f5f5f4] flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-[#78716c]">{t.noResults}</p>
                <button
                  onClick={() => {
                    updateFilters({ categorie: null, grup: null, set: null });
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
              <ProductsDisplay
                filteredProducts={filteredProducts}
                allProducts={produse}
                customCategories={customCategories}
                lang={lang}
                categoryLabel={categoryLabel}
                t={t}
                formatNumber={formatNumber}
                activeCategory={activeCategory}
                selectedGroup={selectedGroup}
                selectedSet={selectedSet}
                onSelectSet={(name) => updateFilters({ set: name })}
                onClearSet={() => updateFilters({ set: null })}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

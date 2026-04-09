"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, ProductCategory } from "../../src/types/product";
import { PRODUCT_CATEGORY_GROUPS } from "../../src/constants/categories";

type Category = "All" | ProductCategory;

const categories: Category[] = [
  "All",
  ...PRODUCT_CATEGORY_GROUPS.flatMap((group) => group.items),
] as Category[];

const isKnownCategory = (value: string): value is ProductCategory =>
  categories.includes(value as Category) && value !== "All";

const normalizeCategory = (value?: string | null): Category => {
  if (!value) return "All";
  return isKnownCategory(value) ? value : "All";
};

export default function ProduseClient({ produse }: { produse: Product[] }) {
  const formatNumber = (value: number) => value.toLocaleString("ro-RO");
  const searchParams = useSearchParams();
  const categoryFromUrlValid = normalizeCategory(searchParams.get("categorie"));

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeCategory: Category = selectedCategory ?? categoryFromUrlValid;

  const filteredProducts = useMemo(() => {
    let list = produse;

    if (activeCategory !== "All") {
      list = list.filter((produs) => produs.categorie === activeCategory);
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

    if (sortBy === "price-asc") {
      return [...list].sort((a, b) => a.pret - b.pret);
    }

    if (sortBy === "price-desc") {
      return [...list].sort((a, b) => b.pret - a.pret);
    }

    return list;
  }, [activeCategory, produse, query, sortBy]);

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-12 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#1c1917]/20" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
              Shop
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-[#1c1917] leading-tight">
                Colecția <span className="italic font-normal">completă</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#78716c] leading-relaxed">
                Mobilier premium pentru fiecare colț al casei tale. Descoperă piesele care transformă spațiul în experiențe.
              </p>
            </div>
            
            {/* Search & Sort - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Caută produse..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-64 rounded-lg border border-[#e7e5e4] bg-[#fafaf9] pl-10 pr-4 py-2.5 text-sm focus:border-[#1c1917] focus:outline-none transition-colors"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-[#e7e5e4] bg-[#fafaf9] px-4 py-2.5 text-sm focus:border-[#1c1917] focus:outline-none cursor-pointer"
              >
                <option value="featured">Recomandate</option>
                <option value="price-asc">Preț: Mic - Mare</option>
                <option value="price-desc">Preț: Mare - Mic</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mt-6 flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#e7e5e4] rounded-lg text-sm font-medium"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtre
            </button>
            <span className="text-sm text-[#78716c]">
              {filteredProducts.length} produse
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-8 lg:py-12">
        <div className="flex gap-12 lg:gap-16">
          
          {/* Sidebar - Categories */}
          <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
            <div className="lg:sticky lg:top-8 space-y-8">
              
              {/* Categories */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                  Categorii
                </h3>
                <div className="space-y-1 mb-5">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full flex items-center justify-between py-2.5 text-sm transition-colors ${
                      activeCategory === "All"
                        ? "text-[#1c1917] font-medium"
                        : "text-[#78716c] hover:text-[#1c1917]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {activeCategory === "All" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1c1917]" />
                      )}
                      <span className={activeCategory === "All" ? "ml-0" : "ml-4.5"}>Toate</span>
                    </span>
                    <span className="text-xs text-[#a8a29e]">{produse.length}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {PRODUCT_CATEGORY_GROUPS.map((group) => (
                    <div key={group.title}>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
                        {group.title}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((category) => {
                          const isActive = activeCategory === category;
                          const count = produse.filter((p) => p.categorie === category).length;
                          return (
                            <button
                              key={`${group.title}-${category}`}
                              onClick={() => setSelectedCategory(category)}
                              className={`w-full flex items-center justify-between py-2 text-sm transition-colors ${
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
                                  {category}
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

              {/* Price Range Info */}
              <div className="pt-6 border-t border-[#e7e5e4]">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                  Preț
                </h3>
                <div className="space-y-2 text-sm text-[#78716c]">
                  <p>De la {produse.length > 0 ? formatNumber(Math.min(...produse.map((p) => p.pret))): "0"} MDL</p>
                  <p>Până la {produse.length > 0 ? formatNumber(Math.max(...produse.map((p) => p.pret))): "0"} MDL</p>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="pt-6 border-t border-[#e7e5e4]">
                <p className="text-sm text-[#78716c] mb-3">Nu găsești ce cauți?</p>
                <Link 
                  href="/#contact" 
                  className="text-sm font-medium text-[#1c1917] underline underline-offset-4 hover:text-[#78716c] transition-colors"
                >
                  Contactează-ne
                </Link>
              </div>
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
                <p className="text-[#78716c]">Nu există produse pentru filtrul selectat.</p>
                <button 
                  onClick={() => {setSelectedCategory("All"); setQuery("");}}
                  className="mt-4 text-sm font-medium text-[#1c1917] hover:underline"
                >
                  Resetează filtrele
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-[#78716c]">
                    Afișate <span className="font-medium text-[#1c1917]">{filteredProducts.length}</span> produse
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((produs) => (
                    <article
                      key={produs._id}
                      className="group relative bg-white rounded-sm overflow-hidden"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-4/5 overflow-hidden bg-[#f5f5f4]">
                        <Image
                          src={
                            produs.imagine?.trim() ||
                            "/images/categories/dormitor.png"
                          }
                          alt={produs.nume}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#0c0c0c]/0 transition-colors duration-300 group-hover:bg-[#0c0c0c]/20" />
                        
                        {/* Quick View - appears on hover */}
                        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          <Link
                            href={`/produse/${produs._id}`}
                            className="block w-full bg-white text-center py-3 text-[11px] font-medium uppercase tracking-wider text-[#1c1917] hover:bg-[#1c1917] hover:text-white transition-colors"
                          >
                            Vezi Detalii
                          </Link>
                        </div>

                        {/* Category Tag */}
                        {produs.categorie && (
                          <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-[#1c1917]">
                            {produs.categorie}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h2 className="text-base font-medium text-[#1c1917] mb-1 group-hover:text-[#78716c] transition-colors">
                          {produs.nume}
                        </h2>
                        <p className="text-lg font-light text-[#1c1917]">
                          {formatNumber(produs.pret)} <span className="text-sm text-[#a8a29e]">MDL</span>
                        </p>
                      </div>
                    </article>
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
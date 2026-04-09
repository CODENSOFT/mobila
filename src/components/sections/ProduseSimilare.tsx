"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProdusSimilar = {
  _id: string;
  nume: string;
  pret: number;
  imagine?: string;
  imagini?: string[];
  categorie?: string;
  slug?: string;
};

function imaginePrincipala(p: ProdusSimilar): string {
  const first = p.imagini?.[0];
  if (typeof first === "string" && first.trim()) return first.trim();
  return typeof p.imagine === "string" ? p.imagine : "";
}

function formatPretRon(pret: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "MDL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pret);
}

type ProduseSimilareProps = {
  produsId: string;
  categorie: string;
};

export default function ProduseSimilare({
  produsId,
  categorie,
}: ProduseSimilareProps) {
  const [items, setItems] = useState<ProdusSimilar[] | null>(null);

  const veziToateHref = useMemo(() => {
    const c = categorie.trim();
    return c ? `/produse?categorie=${encodeURIComponent(c)}` : "/produse";
  }, [categorie]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    const cat = categorie.trim();
    if (cat) params.set("categorie", cat);
    params.set("limit", "4");
    params.set("exclude", produsId);

    fetch(`/api/produse?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? (data as ProdusSimilar[]) : []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });

    return () => {
      cancelled = true;
    };
  }, [produsId, categorie]);

  if (items !== null && items.length === 0) {
    return null;
  }

  if (items === null) {
    return (
      <section className="border-t border-[#e7e5e4] bg-white" aria-busy="true">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16">
          <div className="mb-8 flex items-center justify-between">
            <div className="h-8 w-48 animate-pulse rounded bg-[#e7e5e4]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[#e7e5e4]" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-sm bg-white"
              >
                <div className="aspect-[4/5] animate-pulse bg-[#f5f5f4]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-[#e7e5e4]" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-[#e7e5e4]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#e7e5e4] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#1c1917]">
            Produse similare
          </h2>
          <Link
            href={veziToateHref}
            className="shrink-0 text-sm text-[#78716c] transition-colors hover:text-[#1c1917]"
          >
            Vezi toate
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((produs) => {
            const src = imaginePrincipala(produs);
            const href = produs.slug
              ? `/produse/${produs.slug}`
              : `/produse/${produs._id}`;

            return (
              <article
                key={produs._id}
                className="group relative overflow-hidden rounded-sm bg-white transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl"
              >
                <Link href={href} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f4]">
                    {src ? (
                      <Image
                        src={src}
                        alt={produs.nume}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e7e5e4] text-xs text-[#a8a29e]">
                        Fără imagine
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[#0c0c0c]/0 transition-colors duration-300 group-hover:bg-[#0c0c0c]/10" />
                    {produs.categorie ? (
                      <span className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#1c1917] backdrop-blur-sm">
                        {produs.categorie}
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-base font-medium text-[#1c1917] transition-colors group-hover:text-[#78716c]">
                      {produs.nume}
                    </h3>
                    <p className="text-lg font-light text-[#1c1917]">
                      {formatPretRon(produs.pret)}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

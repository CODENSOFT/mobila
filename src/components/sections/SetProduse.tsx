"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/src/context/CartContext";

type SetProduct = {
  _id: string;
  nume: string;
  pret: number;
  imagine: string;
  areReducere?: boolean;
  pretReducere?: number;
};

export default function SetProduse({
  produse,
  setNume,
  lang = "ro",
}: {
  produse: SetProduct[];
  setNume: string;
  lang?: string;
}) {
  if (produse.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-6 lg:px-12 pb-16 pt-8">
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a8a29e]">
            Colecția
          </span>
          <div className="h-px flex-1 bg-[#e7e5e4]" />
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl lg:text-3xl font-light text-[#1c1917]">
            {setNume}
          </h2>
          <p className="text-sm text-[#78716c] whitespace-nowrap">
            {produse.length} {produse.length === 1 ? "produs" : "produse"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {produse.map((p) => (
          <SetCard key={p._id} produs={p} lang={lang} />
        ))}
      </div>
    </section>
  );
}

function SetCard({ produs, lang }: { produs: SetProduct; lang: string }) {
  const { adaugaInCos } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const displayPret = produs.areReducere && produs.pretReducere ? produs.pretReducere : produs.pret;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      adaugaInCos({
        id: produs._id,
        nume: produs.nume,
        pret: displayPret,
        imagine: produs.imagine,
        slug: produs._id,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col bg-white rounded-xl overflow-hidden border border-[#e7e5e4] transition-all duration-300 hover:border-[#1c1917]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
      {/* Image */}
      <Link
        href={`/${lang}/produse/${produs._id}`}
        className="relative aspect-square block bg-[#f5f5f4] overflow-hidden"
      >
        <Image
          src={produs.imagine}
          alt={produs.nume}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {produs.areReducere && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">
            Reducere
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <Link
          href={`/${lang}/produse/${produs._id}`}
          className="block mb-2 text-sm font-medium text-[#1c1917] leading-snug line-clamp-2 min-h-[2.5rem] hover:text-[#78716c] transition-colors"
          title={produs.nume}
        >
          {produs.nume}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-light text-[#1c1917] tabular-nums leading-none">
            {displayPret.toLocaleString("ro-RO")}
          </span>
          <span className="text-[11px] text-[#a8a29e] font-medium">MDL</span>
          {produs.areReducere && produs.pretReducere && (
            <span className="text-xs text-[#a8a29e] line-through tabular-nums">
              {produs.pret.toLocaleString("ro-RO")}
            </span>
          )}
        </div>

        {/* Action row — pushed to bottom */}
        <div className="mt-auto flex items-stretch gap-2">
          {/* Quantity stepper */}
          <div className="flex items-center bg-[#fafaf9] rounded-lg border border-[#e7e5e4]">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex items-center justify-center w-7 h-9 text-[#78716c] hover:text-[#1c1917] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Scade cantitate"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-[#1c1917] tabular-nums select-none">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex items-center justify-center w-7 h-9 text-[#78716c] hover:text-[#1c1917] transition-colors"
              aria-label="Crește cantitate"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Add to cart button */}
          <button
            type="button"
            onClick={handleAdd}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg h-9 px-3 text-xs font-medium tracking-wide transition-all duration-200 ${
              added
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-[#1c1917] text-white hover:bg-[#292524] hover:shadow-sm active:scale-[0.98]"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Adăugat</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Adaugă</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

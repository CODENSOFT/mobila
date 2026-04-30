export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Wrench,
  CreditCard,
  Phone,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import AddToCartButton from "@/src/components/cart/AddToCartButton";
import ProduseSimilare from "../../../src/components/sections/ProduseSimilare";

type Product = {
  _id: string;
  nume: string;
  descriere: string;
  pret: number;
  imagine: string;
  imagini?: string[];
  categorie?: string;
};

type DescriptionBlock =
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

function parseDescription(description: string): DescriptionBlock[] {
  const normalized = description
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: DescriptionBlock[] = [];
  let currentList: string[] = [];

  for (const line of normalized) {
    const bulletMatch = line.match(/^[-*•]\s+(.+)/);

    if (bulletMatch) {
      currentList.push(bulletMatch[1].trim());
      continue;
    }

    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }

    blocks.push({ type: "paragraph", content: line });
  }

  if (currentList.length > 0) {
    blocks.push({ type: "list", items: currentList });
  }

  if (blocks.length === 0) {
    blocks.push({ type: "paragraph", content: description.trim() });
  }

  return blocks;
}

async function getProdusById(id: string): Promise<Product | null> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const apiBaseUrl = "https://mobila-production.up.railway.app";

  if (!apiBaseUrl && !host) {
    return null;
  }

  const response = await fetch(
    `${apiBaseUrl ?? `${protocol}://${host}`}/api/produse?id=${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const produs = (await response.json()) as Product;
  return produs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const produs = await getProdusById(id);

  if (!produs) {
    return {
      title: "Produs indisponibil | LABIRINT",
      description: "Produsul căutat nu a fost găsit în colecția noastră.",
    };
  }

  return {
    title: `${produs.nume} | LABIRINT`,
    description: produs.descriere.slice(0, 160),
  };
}

const FEATURES = [
  { icon: Truck, label: "Livrare", value: "2–4 săptămâni" },
  { icon: ShieldCheck, label: "Garanție", value: "24 luni" },
  { icon: Wrench, label: "Montaj", value: "Disponibil" },
  { icon: CreditCard, label: "Plată", value: "Cash / Transfer" },
] as const;

export default async function ProdusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produs = await getProdusById(id);
  const descriptionBlocks = produs ? parseDescription(produs.descriere) : [];

  if (!produs) {
    return (
      <main className="min-h-screen bg-[#fafaf9]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#e7e5e4] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#a8a29e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-[#1c1917] mb-2">Produs indisponibil</h1>
            <p className="text-[#78716c] mb-6">Produsul căutat nu există în colecția noastră.</p>
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1917] hover:text-[#78716c] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Înapoi la produse
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {/* Breadcrumb */}
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-3.5">
          <nav className="flex items-center gap-2 text-sm text-[#a8a29e]">
            <Link href="/" className="hover:text-[#1c1917] transition-colors">Acasă</Link>
            <span>/</span>
            <Link href="/produse" className="hover:text-[#1c1917] transition-colors">Produse</Link>
            <span>/</span>
            {produs.categorie && (
              <>
                <Link href={`/produse?categorie=${produs.categorie}`} className="hover:text-[#1c1917] transition-colors">
                  {produs.categorie}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#1c1917] truncate max-w-[200px]">{produs.nume}</span>
          </nav>
        </div>
      </div>

      {/* Product */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-start">

          {/* Left — gallery */}
          <ProductImageGallery
            imagine={produs.imagine}
            imagini={produs.imagini}
            alt={produs.nume}
          />

          {/* Right — details (sticky on desktop) */}
          <div className="lg:sticky lg:top-8 flex flex-col gap-0">

            {/* Category pill */}
            {produs.categorie && (
              <Link
                href={`/produse?categorie=${produs.categorie}`}
                className="self-start mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#78716c] border border-[#d6d3d1] rounded-full px-3 py-1 hover:border-[#1c1917] hover:text-[#1c1917] transition-colors"
              >
                {produs.categorie}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-[2.1rem] font-light text-[#1c1917] leading-[1.2] mb-5">
              {produs.nume}
            </h1>

            {/* Price block */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl lg:text-5xl font-extralight text-[#1c1917] leading-none tabular-nums">
                {produs.pret.toLocaleString("ro-RO")}
              </span>
              <span className="text-base text-[#a8a29e] mb-1">MDL</span>
            </div>

            <div className="h-px bg-[#e7e5e4] mb-6" />

            {/* Description */}
            <div className="mb-6">
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#a8a29e] mb-4">
                Descriere produs
              </p>
              <div className="space-y-4">
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

            {/* Features grid with icons */}
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

            {/* CTA buttons */}
            <div className="space-y-3">
              <AddToCartButton
                produs={{
                  id: produs._id,
                  nume: produs.nume,
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
                  Sună acum
                </a>
                <a
                  href="https://wa.me/37369727444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d6d3d1] bg-white px-4 py-2.5 text-sm font-medium text-[#1c1917] transition-colors hover:border-[#1c1917]"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#a8a29e]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                Garanție oficială
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" aria-hidden />
                Livrare în toată Moldova
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" aria-hidden />
                Montaj profesional
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProduseSimilare
        key={id}
        produsId={id}
        categorie={produs.categorie ?? ""}
      />
    </main>
  );
}

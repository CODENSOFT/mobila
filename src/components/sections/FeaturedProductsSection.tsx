import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../types/product";
import Card from "../ui/Card";

export default function FeaturedProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section className="bg-[#fafaf9] py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <p className="text-[#78716c]">Colecția va fi disponibilă în curând.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fafaf9] py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-[#1c1917]/20" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
                Selecție Editată
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-light text-[#1c1917] leading-tight">
              Piese <span className="italic font-normal">remarcabile</span>
            </h2>
            <p className="max-w-md text-sm text-[#78716c] leading-relaxed">
              Mobilier contemporan pentru interioare premium, construit pe proporții echilibrate și materiale autentice.
            </p>
          </div>
          
          <Link
            href="/produse"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#1c1917]/60 transition-colors hover:text-[#1c1917]"
          >
            Toată colecția
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, index) => {
            const labels = ["Nou", "Popular", "Ediție Limitată", "Premium", "Sezon", "Recomandat"];
            const label = labels[index] ?? "Colecție";

            return (
              <Link key={product._id} href={`/produse/${product._id}`} className="block">
                <Card className="relative aspect-4/5 border border-[#e8e3dc] bg-[#fcfbf9] shadow-[0_14px_34px_rgba(20,18,15,0.08)] transition-all duration-300 hover:shadow-[0_20px_42px_rgba(20,18,15,0.14)]">
                  <Image
                    src={product.imagine || "/images/categories/dormitor.png"}
                    alt={product.nume}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/20 to-transparent" />

                  <div className="absolute left-4 top-4">
                    <span className="inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                      {label}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                      {product.categorie || "Mobilier"}
                    </p>
                    <h3 className="mb-3 text-[20px] font-medium leading-tight text-white">{product.nume}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-white/95">
                        {product.pret.toLocaleString()} <span className="text-sm font-normal text-white/70">MDL</span>
                      </p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                        Vezi detalii
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
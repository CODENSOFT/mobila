import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type CatDict = Dictionary["categories"];

const BASE_CATEGORIES = [
  { key: "Dormitor" as const, image: "/images/categories/dormitor.png" },
  { key: "Bucatarii" as const, image: "/images/categories/bucatarii.png" },
  { key: "Dulapuri" as const, image: "/images/categories/dulapuri.png" },
  { key: "Scaune" as const, image: "/images/categories/scaune.png" },
  { key: "Mese" as const, image: "/images/categories/mese.png" },
];

const DEFAULT_T: CatDict = {
  heading: "Descoperă mobilier",
  headingItalic: "creat pentru tine",
  headingLabel: "Colecție",
  explore: "Explorează colecția",
  viewAll: "Colecția completă",
  viewAllSub: "150+ piese de mobilier premium",
  new: "Nou",
  seeAll: "Vezi tot",
  see: "Vezi",
  items: { Dormitor: "Dormitor", Bucatarii: "Bucătării", Dulapuri: "Dulapuri", Scaune: "Scaune", Mese: "Mese" },
  subtitles: {
    Dormitor: "Relaxare & Confort",
    Bucatarii: "Funcționalitate & Stil",
    Dulapuri: "Spațiu & Organizare",
    Scaune: "Confort & Design",
    Mese: "Calitate & Utilitate",
  },
};

export default function CategoriesSection({
  t = DEFAULT_T,
  productsBasePath = "/produse",
}: {
  t?: CatDict;
  productsBasePath?: string;
}) {
  const cats = BASE_CATEGORIES.map((c) => ({
    ...c,
    title: t.items[c.key],
    subtitle: t.subtitles[c.key],
  }));

  // Category cards routing:
  // - Group cards (Dormitor, Bucătării) go to the section's aggregator (sets view)
  // - Individual cards (Dulapuri, Scaune, Mese) show ALL products with that category across all groups
  const HREF_MAP: Record<string, string> = {
    Dormitor: `${productsBasePath}?categorie=Dormitoare&grup=${encodeURIComponent("PENTRU DORMITOR")}`,
    Bucatarii: `${productsBasePath}?categorie=${encodeURIComponent("Bucătării")}&grup=${encodeURIComponent("PENTRU BUCĂTĂRIE")}`,
    Dulapuri: `${productsBasePath}?categorie=Dulapuri`,
    Scaune: `${productsBasePath}?categorie=Scaune`,
    Mese: `${productsBasePath}?categorie=Mese`,
  };
  const href = (cat: string) => HREF_MAP[cat] ?? `${productsBasePath}?categorie=${encodeURIComponent(cat)}`;

  return (
    <section className="bg-[#fafaf9] pt-1 pb-10 lg:pt-2 lg:pb-14">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12">

        {/* Heading */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-[#66a925]/50" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#66a925]">
              {t.headingLabel}
            </span>
          </div>
          <h2 className="text-4xl font-extralight tracking-tight text-[#1c1917] lg:text-6xl leading-[1.05]">
            {t.heading}{" "}
            <span className="italic font-light text-(--brand-green)">{t.headingItalic}</span>
          </h2>
        </div>

        <div className="space-y-2 lg:space-y-3">

          {/* Row 1 (mobile): Dormitor singur / Row 1 (desktop): Dormitor 7fr + Bucatarii/Dulapuri 5fr */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3 lg:grid-cols-[7fr_5fr]">

            {/* Dormitor — full width pe mobil, coloana stanga pe desktop */}
            <Link
              href={href("Dormitor")}
              className="group relative col-span-2 lg:col-span-1 lg:row-span-2 block h-[220px] lg:h-[460px] overflow-hidden rounded-sm bg-[#1c1917]"
            >
              <Image
                src={cats[0].image}
                alt={cats[0].title}
                fill
                className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/85 via-[#0c0c0c]/15 to-transparent" />
              <div className="absolute left-4 top-4 lg:left-7 lg:top-7">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#c2eba2] animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">Premium</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-7">
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/50">{cats[0].subtitle}</p>
                <h3 className="mb-3 lg:mb-4 text-xl lg:text-3xl font-light text-white">{cats[0].title}</h3>
                <div className="hidden lg:flex items-center gap-3 text-white/70 transition-all duration-500 group-hover:gap-5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em]">{t.explore}</span>
                  <div className="h-px w-8 bg-[#c2eba2] transition-all duration-500 group-hover:w-12" />
                  <svg className="h-3.5 w-3.5 text-[#c2eba2] transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Bucătării + Dulapuri — 2 pe rand pe mobil, coloana dreapta pe desktop */}
            {[cats[1], cats[2]].map((cat) => (
              <Link
                key={cat.key}
                href={href(cat.key)}
                className="group relative block h-[145px] lg:h-[224px] overflow-hidden rounded-sm bg-[#1c1917]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                  sizes="(max-width: 1024px) 50vw, 42vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/80 via-[#0c0c0c]/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-5">
                  <p className="mb-1 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-white/50 hidden sm:block">{cat.subtitle}</p>
                  <h3 className="text-sm lg:text-lg font-light text-white">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-[#c2eba2] opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="text-[10px] uppercase tracking-[0.15em]">{t.see}</span>
                    <div className="h-px w-5 bg-current" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: Scaune + Mese + CTA */}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">

            {[cats[3], cats[4]].map((cat) => (
              <Link
                key={cat.key}
                href={href(cat.key)}
                className="group relative block h-[145px] lg:h-[180px] overflow-hidden rounded-sm bg-[#1c1917]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                  <p className="mb-0.5 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] text-white/50 hidden sm:block">{cat.subtitle}</p>
                  <h3 className="text-sm lg:text-base font-light text-white">{cat.title}</h3>
                </div>
              </Link>
            ))}

            {/* CTA — Colecția completă */}
            <Link
              href={productsBasePath}
              className="group col-span-2 lg:col-span-1 relative flex items-center justify-between h-[80px] lg:h-[180px] lg:flex-col lg:justify-between overflow-hidden rounded-sm bg-[#1c1917] px-4 py-3 lg:p-6"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#66a925] mb-0.5 hidden lg:block">{t.new}</div>
                <h3 className="text-sm lg:text-lg font-light text-white leading-tight">{t.viewAll}</h3>
                <p className="mt-1 text-xs text-white/45 leading-relaxed hidden lg:block">{t.viewAllSub}</p>
              </div>
              <div className="flex items-center gap-3 lg:justify-between lg:w-full">
                <span className="text-[10px] uppercase tracking-[0.15em] text-white/60 hidden lg:inline">{t.seeAll}</span>
                <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#66a925] group-hover:bg-[#66a925]">
                  <svg className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-white/70 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}

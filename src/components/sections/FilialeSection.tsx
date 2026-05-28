"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";

type Filiala = {
  numar: string;
  nume: string;
  adresa: string;
  oras: string;
  telefon: string;
  telefon2?: string;
  imagine: string;
  program: { zile: string; ore: string }[];
  mapsUrl: string;
};

const FILIALE: Filiala[] = [
  {
    numar: "01",
    nume: "Filiala 1",
    adresa: "str. Bechir 4",
    oras: "Soroca",
    telefon: "+373 69 727 444",
    imagine: "/images/labirintfiliala.jpeg",
    program: [
      { zile: "Luni",           ore: "Zi liberă" },
      { zile: "Marți – Duminică", ore: "08:00 – 15:30" },
    ],
    mapsUrl: "https://maps.google.com/?q=Soroca+str+Bechir+4",
  },
  {
    numar: "02",
    nume: "Filială 2",
    adresa: "str. Independentei 24",
    oras: "Soroca",
    telefon: "+373 69 727 444",
    imagine: "/images/labirintfiliala2.jpeg",
    program: [
      { zile: "Luni",           ore: "Zi liberă" },
      { zile: "Marți – Duminică", ore: "08:00 – 14:00" },
    ],
    mapsUrl: "https://maps.google.com/?q=Soroca+str+Independentei+24",
  },
];

function BranchCard({ f }: { f: Filiala }) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] hover:border-[#66a925]/40 hover:shadow-xl transition-all duration-300">

      {/* Photo */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#e7e5e4]">
        <Image
          src={f.imagine}
          alt={f.nume}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0c]/30 to-transparent" />
        <span className="absolute left-4 bottom-4 text-4xl font-extralight text-white/70 leading-none tabular-nums">
          {f.numar}
        </span>
      </div>

      {/* Green accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#66a925] to-[#4f8f16] shrink-0" />

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-7 flex flex-col flex-1 gap-3 sm:gap-4">

        {/* Name */}
        <div>
          <h3 className="text-xl font-light text-[#1c1917] leading-tight">
            {f.nume}
          </h3>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[#66a925] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#1c1917] font-medium leading-snug">{f.adresa}</p>
            <p className="text-xs text-[#78716c] mt-0.5">{f.oras}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-[#66a925] shrink-0" />
          <a
            href={`tel:${f.telefon.replace(/\s/g, "")}`}
            className="text-sm text-[#1c1917] hover:text-[#66a925] transition-colors font-medium"
          >
            {f.telefon}
          </a>
          {f.telefon2 && (
            <a
              href={`tel:${f.telefon2.replace(/\s/g, "")}`}
              className="text-sm text-[#78716c] hover:text-[#66a925] transition-colors"
            >
              {f.telefon2}
            </a>
          )}
        </div>

        {/* Hours */}
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-[#66a925] shrink-0 mt-0.5" />
          <div className="space-y-1">
            {f.program.map((p) => (
              <div key={p.zile} className="flex items-center gap-2">
                <span className="text-xs text-[#78716c] w-[105px]">{p.zile}</span>
                <span className={`text-xs font-medium ${p.ore === "Închis" ? "text-red-400" : "text-[#1c1917]"}`}>
                  {p.ore}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Link
            href={f.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2 rounded-lg border border-[#1c1917]/15 bg-[#fafaf9] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#1c1917] transition-all duration-200 hover:border-[#66a925] hover:bg-[#66a925] hover:text-white"
          >
            <MapPin className="w-3.5 h-3.5" />
            Indicații pe hartă
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function FilialeSection() {
  return (
    <section className="bg-[#fafaf9] py-8 lg:py-14 border-t border-[#e7e5e4]/60">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#66a925]/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#66a925]/80">
                Locații
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light text-[#1c1917] leading-[1.05]">
              Filialele
              <br />
              <span className="italic text-[#66a925]">noastre</span>
            </h2>
          </div>

          <p className="text-sm text-[#78716c] leading-relaxed lg:max-w-[280px] lg:text-right">
            Vizitează-ne în showroom pentru a vedea produsele în detaliu și a discuta cu echipa noastră.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
          {FILIALE.map((f) => (
            <BranchCard key={f.numar} f={f} />
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const TAGURI = [
  "Materiale brute și accente metalice",
  "Livrare gratuită la comenzi de valoare mare",
  "Stiluri eclectice și materiale naturale",
  "Designuri clasice cu detalii rafinate",
  "Oferte avantajoase și parteneri de încredere",
];

const BANDA = [...TAGURI, ...TAGURI];

function Pill({ text, variant }: { text: string; variant: "light" | "warm" }) {
  return (
    <div
      className={`group shrink-0 rounded-full border px-5 py-2.5 text-sm transition-all duration-300 md:px-6 md:py-3 md:text-[15px] ${
        variant === "light"
          ? "border-stone-200/90 bg-white/95 text-[#3a3a3a] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[var(--brand-green)]/35 hover:shadow-[0_8px_30px_rgba(102,169,37,0.12)]"
          : "border-stone-200/70 bg-[#fffefb]/95 text-[#3a3a3a] shadow-[0_2px_12px_rgba(101,69,31,0.05)] hover:border-amber-200/80 hover:shadow-[0_8px_28px_rgba(180,140,80,0.1)]"
      } hover:-translate-y-0.5`}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${
            variant === "light"
              ? "bg-[var(--brand-green)]/70 group-hover:bg-[var(--brand-green)]"
              : "bg-amber-500/60 group-hover:bg-amber-500"
          }`}
          aria-hidden
        />
        <span className="font-medium tracking-tight">{text}</span>
      </span>
    </div>
  );
}

export default function AboutSnippet() {
  const headRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    const el = headRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setShow(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      aria-labelledby="about-snippet-heading"
    >
      {/* Fundal stratificat */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#fdfcfa] via-[#f8f5ef] to-[#f0ebe3]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26,26,26,0.04) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-[var(--brand-green)]/[0.07] blur-[100px]"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-[320px] w-[320px] rounded-full bg-amber-200/[0.12] blur-[90px]"
        aria-hidden
      />

      <div
        ref={headRef}
        className="relative mx-auto max-w-7xl px-6 lg:px-12"
      >
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c5348] shadow-sm backdrop-blur-sm transition-all duration-700 ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand-green)]"
            aria-hidden
          />
          Calitate &amp; design
        </div>

        <h2
          id="about-snippet-heading"
          className={`mt-6 max-w-4xl transition-all delay-100 duration-700 ease-out sm:mt-8 ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="block text-[2rem] font-extralight leading-[1.12] tracking-tight text-[#141414] sm:text-4xl md:text-5xl lg:text-[54px]">
            Designuri de calitate premium,
          </span>
          <span className="mt-1 block font-serif text-[1.85rem] italic leading-[1.15] text-[#2a2a2a] sm:mt-2 sm:text-4xl md:text-[2.75rem] lg:text-[48px]">
            create pentru{" "}
            <span className="bg-gradient-to-r from-[var(--brand-green-dark)] to-[var(--brand-green)] bg-clip-text font-medium not-italic text-transparent">
              casa ta
            </span>
          </span>
        </h2>

        <div
          className={`origin-left mt-6 h-px w-14 rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-green)]/30 transition-all delay-200 duration-700 sm:mt-8 sm:w-20 ${
            show ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
          aria-hidden
        />

        <p
          className={`mt-6 max-w-2xl text-base leading-[1.75] text-[#5a554d] transition-all delay-200 duration-700 sm:mt-8 sm:text-lg ${
            show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          Din 2007, creăm mobilier care îmbină materiale alese, execuție atentă și un design
          atemporal. Fiecare piesă reflectă experiența echipei{" "}
          <span className="font-semibold text-[#2c2820]">LABIRINT</span> și respectul pentru
          detaliile care fac diferența în locuința ta.
        </p>
      </div>

      {/* Marquee cu fade pe margini */}
      <div className="relative mt-16 lg:mt-24">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f5f0e8] via-[#f5f0e8]/90 to-transparent sm:w-20 md:w-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#ebe6de] via-[#ebe6de]/90 to-transparent sm:w-20 md:w-28"
          aria-hidden
        />

        <div className="space-y-3 md:space-y-4">
          <div className="about-snippet-marquee-track items-center gap-3 md:gap-5">
            {BANDA.map((text, i) => (
              <Pill key={`a-${text}-${i}`} text={text} variant="light" />
            ))}
          </div>
          <div className="about-snippet-marquee-track--reverse items-center gap-3 md:gap-5">
            {BANDA.map((text, i) => (
              <Pill key={`b-${text}-${i}`} text={text} variant="warm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

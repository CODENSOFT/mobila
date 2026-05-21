"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/src/context/LangContext";

function Pill({ text }: { text: string }) {
  return (
    <div
      className={`group shrink-0 rounded-full border border-stone-200/90 bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-600 shadow-sm transition-all duration-300 md:px-5 md:py-2.5 md:text-xs md:tracking-[0.2em] hover:border-(--brand-green)/40 hover:text-stone-900`}
    >
      <span className="flex items-center gap-2">
        <span
          className="h-1 w-1 shrink-0 rounded-full bg-(--brand-green)/70 transition-transform duration-300 group-hover:scale-125 group-hover:bg-(--brand-green)"
          aria-hidden
        />
        {text}
      </span>
    </div>
  );
}

export default function AboutSnippet() {
  const { dict } = useLang();
  const t = dict.aboutSnippet;
  const headRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const banda = [...t.tags, ...t.tags];

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
      className="relative overflow-hidden border-y border-stone-200/80 bg-[#faf9f7] py-20 lg:py-28"
      aria-labelledby="about-snippet-heading"
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#faf9f7] via-[#f6f4f1] to-[#f0ece6]" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(28,25,23,0.035) 1px, transparent 0)`,
          backgroundSize: "26px 26px",
        }}
        aria-hidden
      />
      <div
        className="absolute -left-24 top-1/4 h-[380px] w-[380px] rounded-full bg-(--brand-green)/[0.06] blur-[100px]"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-0 h-[280px] w-[280px] rounded-full bg-stone-300/15 blur-[90px]"
        aria-hidden
      />

      <div ref={headRef} className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div
          className={`inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/80 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 shadow-sm backdrop-blur-sm transition-all duration-700 ease-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="h-1 w-1 rounded-full bg-(--brand-green)" aria-hidden />
          {t.badge}
        </div>

        <h2
          id="about-snippet-heading"
          className={`mt-6 max-w-4xl transition-all delay-100 duration-700 ease-out sm:mt-8 ${
            show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="block text-[2rem] font-extralight leading-[1.1] tracking-tight text-stone-900 sm:text-4xl md:text-5xl lg:text-[2.75rem]">
            {t.heading1}
          </span>
          <span className="mt-2 block font-serif text-[1.65rem] italic leading-snug text-stone-700 sm:mt-3 sm:text-3xl md:text-[2.25rem] lg:text-[2.5rem]">
            {t.heading2}{" "}
            <span className="bg-linear-to-r from-(--brand-green-dark) to-(--brand-green) bg-clip-text font-medium not-italic text-transparent">
              {t.headingAccent}
            </span>
          </span>
        </h2>

        <div
          className={`origin-left mt-6 h-px w-14 rounded-full bg-linear-to-r from-(--brand-green) to-(--brand-green)/35 transition-all delay-200 duration-700 sm:mt-8 sm:w-20 ${
            show ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`}
          aria-hidden
        />

        <p
          className={`mt-6 max-w-2xl text-base leading-relaxed text-stone-600 transition-all delay-200 duration-700 sm:mt-8 sm:text-lg ${
            show ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          {t.description}
        </p>
      </div>

      <div className="relative mt-14 lg:mt-20">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#faf9f7] via-[#faf9f7]/95 to-transparent sm:w-16 md:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#f0ece6] via-[#f0ece6]/95 to-transparent sm:w-16 md:w-24"
          aria-hidden
        />

        <div className="about-snippet-marquee-track flex items-center gap-3 md:gap-5">
          {banda.map((text, i) => (
            <Pill key={`${text}-${i}`} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}

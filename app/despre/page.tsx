import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeInOnScroll from "../../src/components/ui/FadeInOnScroll";
import AboutSnippet from "../../src/components/sections/AboutSnippet";

export const metadata: Metadata = {
  title: "Despre LABIRINT | SRL GASNASGRUP",
  description:
    "LABIRINT este un brand dezvoltat de SRL GASNASGRUP, activ pe piața mobilei din 2007. Calitate reală, materiale atent selectate și relații pe termen lung cu clienții din toată Moldova.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop";

const STORY_IMAGE =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop";

const WORKSHOP_IMAGE =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop";

const timeline = [
  { year: "2007", event: "Începutul activității", detail: "Primul atelier în Soroca, Moldova" },
  { year: "2012", event: "Primul showroom", detail: "Expunere directă pentru clienți" },
  { year: "2018", event: "Extindere regională", detail: "Proiecte în toată Moldova" },
  { year: "2024", event: "Experiență solidă", detail: "Sute de proiecte finalizate cu succes" },
];

const values = [
  {
    num: "01",
    title: "Calitate",
    desc: "Folosim materiale premium și lucrăm atent fiecare detaliu. Fiecare piesă trece prin control riguros înainte de livrare.",
    visual: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    num: "02",
    title: "Personalizare",
    desc: "Fiecare client are nevoi diferite. Ne adaptăm dimensiunile, materialele și design-ul la spațiul și stilul tău.",
    visual:
      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    num: "03",
    title: "Promptitudine",
    desc: "Respectăm termenele stabilite și livrăm exact ce promitem. Transparentă totală în comunicare.",
    visual: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const services = [
  {
    title: "Produse gata realizate",
    desc: "Mobilier disponibil rapid, ideal pentru amenajări fără timp de așteptare. Gamă variată: dormitoare, bucătării, livinguri, dulapuri, mese și scaune.",
    price: "De la 1.500 MDL",
    tag: "Livrare rapidă",
  },
  {
    title: "Mobilier la comandă",
    desc: "Realizăm mobilier adaptat exact nevoilor tale: dimensiuni personalizate, alegere materiale și culori, design în funcție de spațiu. Fiecare proiect este unic.",
    price: "Personalizat",
    tag: "Proiect unic",
  },
  {
    title: "Consultanță și suport",
    desc: "Te ghidăm de la idee până la montaj: alegerea produselor, optimizarea spațiului, recomandări de design.",
    price: "Gratuit",
    tag: "Fără costuri",
  },
];

const stats = [
  { num: "19", suffix: "+", label: "Ani", sub: "De activitate continuă" },
  { num: "1000", suffix: "+", label: "Proiecte", sub: "Finalizate cu succes" },
  { num: "24", suffix: "", label: "Luni", sub: "Garanție inclusă" },
  { num: "100", suffix: "%", label: "Angajament", sub: "Față de fiecare client" },
];

const whyUs = [
  "Experiență de peste 19 ani în domeniul mobilei",
  "Produse durabile și finisate cu precizie",
  "Posibilitatea de personalizare completă",
  "Comunicare clară și onestă",
  "Respectarea strictă a termenelor",
  "Garanție extinsă pentru toate produsele",
];

const partners = [
  "Proiecte rezidențiale",
  "Spații comerciale",
  "Hoteluri și pensiuni",
  "Birouri și coworking",
];

export default function DesprePage() {
  return (
    <main className="bg-[#faf9f7] text-[#1c1917]">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Interior premium cu mobilier modern"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#0c0a09]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a09]/80 via-[#0c0a09]/50 to-transparent" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-6 pb-24 pt-32 lg:items-center lg:pb-0">
          <div className="max-w-2xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-16 bg-white/30" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                LABIRINT · Despre noi
              </span>
            </div>

            <h1 className="text-[2.75rem] font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Mobilier premium pentru casa ta
              <br />
              <span className="font-serif italic text-[#a3c585]">
                Creat cu atenție la detalii, din 2007
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base font-light leading-[1.8] text-white/60 sm:text-lg">
              Din Soroca, livrăm în toată Moldova mobilier care îmbină designul modern cu
              durabilitatea. Fie că alegi produse gata realizate sau mobilier la comandă, fiecare
              piesă este construită pentru a rezista în timp și pentru a aduce confort în locuința ta.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/produse"
                className="group relative overflow-hidden rounded-none bg-white px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(255,255,255,0.15)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Vezi produsele
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/contact"
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 underline-offset-8 transition-colors hover:text-white"
              >
                Contactează-ne
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ─── MARQUEE BANDĂ ─── */}
      <div className="border-y border-[#e7e5e4] bg-[#f5f3f0] py-4">
        <div className="flex animate-marquee items-center gap-12 whitespace-nowrap px-6">
          {[...Array(3)].flatMap(() => [
            "Calitate reală, nu doar aspect",
            "Materiale atent selectate",
            "Execuție precisă",
            "Relații pe termen lung",
            "•",
          ]).map((item, i) => (
            <span
              key={i}
              className={`text-[11px] font-medium uppercase tracking-[0.25em] ${
                item === "•" ? "text-[#a3c585]" : "text-[#78716c]"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <FadeInOnScroll>
        <AboutSnippet />
      </FadeInOnScroll>

      {/* ─── DESPRE NOI — EDITORIAL ─── */}
      <FadeInOnScroll>
        <section className="py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
              {/* Stânga — heading */}
              <div className="lg:col-span-5">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-[#1c1917]/15" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
                    Despre noi
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-[#1c1917] sm:text-5xl lg:text-[3.5rem]">
                  Mobilier făcut corect, pentru oameni care{" "}
                  <span className="font-serif italic text-[#78716c]">apreciază calitatea</span>
                </h2>
              </div>

              {/* Dreapta — conținut */}
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-5 text-[15px] leading-[1.8] text-[#57534e]">
                  <p>
                    <strong className="font-semibold text-[#1c1917]">LABIRINT</strong> este un brand
                    dezvoltat de <strong className="font-semibold text-[#1c1917]">SRL GASNASGRUP</strong>,
                    activ pe piața mobilei din 2007. Cu o experiență de peste 19 ani, am construit
                    sute de proiecte pentru clienți din toată Moldova.
                  </p>
                  <p>
                    Ne-am dezvoltat pas cu pas, prin recomandări și încrederea clienților. Fiecare
                    proiect realizat este o carte de vizită pentru noi.
                  </p>
                  <p className="font-medium text-[#1c1917]">
                    Astăzi realizăm atât proiecte pentru locuințe, cât și pentru spații comerciale.
                    Fiecare etapă e urmărită cu aceeași atenție la detalii.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  {partners.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-3 border-b border-[#e7e5e4] pb-4"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#a3c585]" />
                      <span className="text-sm text-[#57534e]">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── TIMELINE + STATS — ASIMETRIC ─── */}
      <FadeInOnScroll>
        <section className="relative overflow-hidden bg-[#f0ece6] py-28 lg:py-36">
          <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-[#a3c585]/[0.04] blur-[120px]" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-[#d4c5a9]/[0.06] blur-[100px]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-[#1c1917]/15" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
                  Parcurs
                </span>
              </div>
              <h2 className="max-w-xl text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-[#1c1917] sm:text-5xl lg:text-[3.5rem]">
                Ani care <span className="font-serif italic text-[#78716c]">conturează</span> povestea
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
              {/* Timeline vertical */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute left-[19px] top-0 h-full w-px bg-[#e7e5e4]" />
                  <div className="space-y-0">
                    {timeline.map((item) => (
                      <div key={item.year} className="relative flex gap-6 pb-10 last:pb-0">
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e7e5e4] bg-[#f0ece6]">
                          <span className="text-[10px] font-semibold text-[#78716c]">{item.year.slice(-2)}</span>
                        </div>
                        <div className="pt-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a3c585]">
                            {item.year}
                          </span>
                          <p className="mt-1 text-base font-medium text-[#1c1917]">{item.event}</p>
                          <p className="mt-0.5 text-sm text-[#78716c]">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[#e7e5e4] bg-[#e7e5e4]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="group relative bg-[#faf9f7] p-8 transition-colors hover:bg-white lg:p-10"
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extralight text-[#1c1917] lg:text-5xl">
                          {stat.num}
                        </span>
                        <span className="text-2xl font-extralight text-[#1c1917]">{stat.suffix}</span>
                      </div>
                      <span className="mt-3 block text-sm font-medium text-[#1c1917]">
                        {stat.label}
                      </span>
                      <span className="mt-1 block text-xs text-[#78716c]">{stat.sub}</span>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#a3c585] transition-all duration-500 group-hover:w-full" />
                    </div>
                  ))}
                </div>

                {/* Quote card */}
                <div className="mt-8 border-l-2 border-[#a3c585] bg-white/50 p-8 backdrop-blur-sm">
                  <p className="text-lg font-light italic leading-relaxed text-[#1c1917]">
                    &ldquo;Fiecare piesă de mobilier pe care o livrăm poartă semnătura noastră — calitate
                    fără compromisuri.&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-px w-8 bg-[#1c1917]/20" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#78716c]">
                      Echipa LABIRINT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── VALORI — NUMEROTATE ─── */}
      <FadeInOnScroll>
        <section className="py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16 max-w-2xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-[#1c1917]/15" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
                  Principii
                </span>
              </div>
              <h2 className="text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-[#1c1917] sm:text-5xl lg:text-[3.5rem]">
                Cum lucrăm <span className="font-serif italic text-[#78716c]">noi</span>
              </h2>
            </div>

            <div className="grid gap-px bg-[#e7e5e4] md:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group relative bg-[#faf9f7] p-10 transition-all duration-500 hover:bg-white lg:p-12"
                >
                  <span className="absolute right-8 top-8 text-6xl font-extralight text-[#e7e5e4] transition-colors group-hover:text-[#a3c585]/20">
                    {value.num}
                  </span>

                  <div className="mb-8 flex h-14 w-14 items-center justify-center border border-[#e7e5e4] bg-white transition-colors group-hover:border-[#a3c585]/30">
                    <svg
                      className="h-6 w-6 text-[#1c1917]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.25}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={value.visual} />
                    </svg>
                  </div>

                  <h3 className="text-xl font-medium text-[#1c1917]">{value.title}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-[#57534e]">{value.desc}</p>

                  <div className="mt-8 h-px w-12 bg-[#e7e5e4] transition-all duration-500 group-hover:w-20 group-hover:bg-[#a3c585]" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── POVESTEA — IMAGINE MARE + TEXT ─── */}
      <FadeInOnScroll>
        <section className="bg-[#f0ece6] py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Imagine mare */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e5e4]">
                <Image
                  src={STORY_IMAGE}
                  alt="Living cu mobilier modern premium"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/30 to-transparent" />
                
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">Înființat</span>
                  <span className="text-3xl font-extralight text-white">2007</span>
                </div>
              </div>

              {/* Text */}
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-[#1c1917]/15" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
                    Povestea noastră
                  </span>
                </div>

                <h2 className="text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-[#1c1917] sm:text-5xl lg:text-[3.5rem]">
                  De la un atelier mic, la un nume de{" "}
                  <span className="font-serif italic text-[#78716c]">încredere</span>
                </h2>

                <div className="mt-8 space-y-5 text-[15px] leading-[1.8] text-[#57534e]">
                  <p>
                    Am început în 2007 cu un atelier mic în Soroca și o idee simplă: să facem mobilier
                    de calitate, fără compromisuri.
                  </p>
                  <p>
                    De-a lungul anilor, am crescut prin muncă și seriozitate. Clienții mulțumiți ne-au
                    recomandat mai departe, iar asta ne-a ajutat să ne extindem și să dezvoltăm
                    proiecte tot mai complexe.
                  </p>
                  <p className="font-medium text-[#1c1917]">
                    Fiecare piesă pe care o livrăm poartă semnătura noastră — o promisiune de
                    durabilitate și eleganță.
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-6">
                  <div className="h-px flex-1 bg-[#e7e5e4]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a3c585]">
                    Soroca, Moldova
                  </span>
                  <div className="h-px flex-1 bg-[#e7e5e4]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── SERVICII — CARDURI CU TAG ─── */}
      <FadeInOnScroll>
        <section className="py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-[#1c1917]/15" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
                    Servicii
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-[#1c1917] sm:text-5xl lg:text-[3.5rem]">
                  Soluții complete pentru orice tip de{" "}
                  <span className="font-serif italic text-[#78716c]">spațiu</span>
                </h2>
              </div>
              <Link
                href="/produse"
                className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#78716c] transition-colors hover:text-[#1c1917]"
              >
                Toate produsele
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="group relative flex flex-col border border-[#e7e5e4] bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] lg:p-10"
                >
                  <span className="mb-6 inline-flex w-fit border border-[#a3c585]/30 bg-[#a3c585]/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5a7a3a]">
                    {s.tag}
                  </span>

                  <h3 className="text-xl font-medium leading-snug text-[#1c1917]">{s.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-[1.75] text-[#57534e]">{s.desc}</p>

                  <div className="mt-10 flex items-center justify-between border-t border-[#e7e5e4] pt-6">
                    <span className="text-sm font-semibold text-[#1c1917]">{s.price}</span>
                    <Link
                      href="/produse"
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#78716c] transition-colors hover:text-[#1c1917]"
                    >
                      Detalii
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#a3c585] transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── DE CE LABIRINT — LISTĂ STILIZATĂ ─── */}
      <FadeInOnScroll>
        <section className="bg-[#1c1917] py-28 text-white lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-white/20" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                    De ce LABIRINT
                  </span>
                </div>
                <h2 className="text-[2.5rem] font-extralight leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  Diferența este <span className="font-serif italic text-[#a3c585]">în detalii</span>
                </h2>
                <p className="mt-6 max-w-md text-sm leading-[1.8] text-white/50">
                  Nu vindem doar mobilier. Oferim soluții complete, de la consultanță până la montaj,
                  cu garanție și suport post-vânzare.
                </p>
              </div>

              <div className="space-y-0">
                {whyUs.map((item, i) => (
                  <div
                    key={item}
                    className="group flex items-start gap-5 border-b border-white/10 py-6 first:pt-0"
                  >
                    <span className="mt-0.5 text-[10px] font-semibold text-[#a3c585]/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-light text-white/80 transition-colors group-hover:text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── ATELIER — IMAGINE FULL-WIDTH ─── */}
      <FadeInOnScroll>
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <Image
            src={WORKSHOP_IMAGE}
            alt="Atelier de mobilier LABIRINT"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0c0a09]/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Fabricat în Moldova
              </span>
              <h2 className="mt-4 text-4xl font-extralight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Fiecare piesă, <span className="font-serif italic text-[#a3c585]">lucrată manual</span>
              </h2>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── MISIUNEA — CITAT CENTRAL ─── */}
      <FadeInOnScroll>
        <section className="border-y border-[#e7e5e4] bg-[#faf9f7] py-28 lg:py-36">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
            <span className="mb-8 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#78716c]">
              Misiunea noastră
            </span>

            <blockquote className="text-[1.75rem] font-extralight leading-[1.2] tracking-tight text-[#1c1917] sm:text-3xl lg:text-4xl">
              Să oferim mobilier care nu doar{" "}
              <span className="font-serif italic text-[#78716c]">arată bine</span>, dar rămâne
              durabil și funcțional ani la rând.
            </blockquote>

            <div className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {["Lucrăm transparent", "Comunicăm deschis", "Livrăm ce promitem"].map((item) => (
                <span key={item} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#78716c]">
                  <span className="h-1 w-1 rounded-full bg-[#a3c585]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* ─── CTA FINAL ─── */}
      <FadeInOnScroll>
        <section className="bg-[#f0ece6] px-6 py-28 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden bg-[#1c1917] p-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-16">
              {/* Decorativ */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#a3c585]/10 blur-3xl" />

              <div className="relative">
                <h2 className="text-3xl font-extralight leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Hai să discutăm despre{" "}
                  <span className="font-serif italic text-[#a3c585]">proiectul tău</span>
                </h2>
                <p className="mt-5 max-w-md text-sm leading-[1.8] text-white/50">
                  Fie că ai nevoie de mobilier gata sau la comandă, te ajutăm să alegi soluția
                  potrivită. Primul pas este o conversație.
                </p>
              </div>

              <div className="relative mt-10 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:justify-end">
                <Link
                  href="/produse"
                  className="inline-flex items-center justify-center gap-3 bg-[#a3c585] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
                >
                  Vezi produsele
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-white/20 bg-transparent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition-all hover:border-white/40 hover:text-white"
                >
                  Contactează-ne
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}
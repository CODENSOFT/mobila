import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "../../src/components/ui/Button";
import FadeInOnScroll from "../../src/components/ui/FadeInOnScroll";

export const metadata: Metadata = {
  title: "Despre LABIRINT | SRL GASNASGRUP",
  description:
    "LABIRINT - producător de mobilier din 2007. Calitate, seriozitate și relații de lungă durată cu clienții din Soroca și regiune.",
};

const HERO_IMAGE =
  "https://draperandkramer.com/wp-content/uploads/2022/04/insights-exploring-interior-design-trends-textured-furniture-draperandkramer_20220427_header-image.jpg";

const STORY_IMAGE =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop";

const timeline = [
  { year: "2007", event: "Începutul activității", detail: "Primul atelier în Soroca" },
  { year: "2012", event: "Primul showroom", detail: "Expunere directă pentru clienți" },
  { year: "2018", event: "Extindere regională", detail: "Proiecte în toată Moldova" },
  { year: "2024", event: "Experiență solidă", detail: "Sute de proiecte finalizate" },
];

const values = [
  {
    title: "Calitate",
    desc: "Materiale selectate și execuție impecabilă",
    visual:
      "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    title: "Personalizare",
    desc: "Fiecare piesă adaptată nevoilor tale",
    visual:
      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  },
  {
    title: "Promptitudine",
    desc: "Termene respectate, mereu",
    visual: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const services = [
  {
    title: "Produse gata realizate",
    desc: "Mobilier disponibil rapid pentru amenajări imediate",
    price: "De la 1.500 MDL",
  },
  {
    title: "Mobilier la comandă",
    desc: "Piese unice după dimensiuni, stil și preferințe",
    price: "Personalizat",
  },
  {
    title: "Consultanță & suport",
    desc: "Ghidare de la idee până la instalare finală",
    price: "Gratuit",
  },
];

const stats = [
  { num: "19", suffix: "+", label: "Ani", sub: "De activitate" },
  { num: "1000", suffix: "+", label: "Proiecte", sub: "Finalizate cu succes" },
  { num: "24", suffix: "", label: "Luni", sub: "Garanție inclusă" },
  { num: "100", suffix: "%", label: "Angajament", sub: "Față de clienți" },
];

export default function DesprePage() {
  return (
    <main className="bg-[#f7f3ec] text-gray-900">
      {/* Hero — același limbaj ca home */}
      <section className="relative min-h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Interior premium"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(194,235,162,0.95)]">
              LABIRINT · Despre noi
            </p>
            <h1 className="text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Mobilier făcut
              <br />
              <span className="font-serif italic text-[rgba(214,246,184,0.98)]">
                cu grijă, din 2007
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg font-light leading-8 text-white/85">
              Din Soroca, pentru case și spații care țin ani la rând. Calitate, transparență și
              relații pe termen lung cu fiecare client.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                href="/produse"
                variant="outline"
                className="rounded-none border-(--brand-green) bg-transparent px-10 py-4 font-['Inter'] text-xs uppercase tracking-widest text-(--brand-green) hover:bg-[rgba(102,169,37,0.12)] hover:text-(--brand-green)"
              >
                Descoperă colecția
              </Button>
              <Link
                href="/contact"
                className="text-xs font-medium uppercase tracking-[0.2em] text-white/80 underline-offset-4 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FadeInOnScroll>
        <section className="relative overflow-hidden bg-[#fafaf9] py-24 lg:py-32">
          <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-linear-to-bl from-[#e8f5e0]/35 via-transparent to-transparent blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-linear-to-tr from-[#f0f7eb]/50 via-transparent to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-14 text-left">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-12 bg-[#1c1917]/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1c1917]/50">
                  Parcurs
                </span>
              </div>
              <h2 className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl">
                Ani care <span className="italic">conturează</span> povestea
              </h2>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="space-y-0 lg:col-span-5">
                {timeline.map((item) => (
                  <div
                    key={item.year}
                    className="border-b border-[#e7e5e4] py-6 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="w-16 text-2xl font-light text-[#1c1917]/40">
                        {item.year}
                      </span>
                      <div>
                        <p className="font-medium text-[#1c1917]">{item.event}</p>
                        <p className="text-sm text-[#78716c]">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[#e8e3dc] bg-[#e8e3dc] shadow-[0_14px_34px_rgba(20,18,15,0.06)]">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-[#fcfbf9] p-8 text-center transition-colors hover:bg-white lg:p-10"
                    >
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-3xl font-light text-[#1c1917] lg:text-4xl">
                          {stat.num}
                        </span>
                        <span className="text-xl font-light text-[#1c1917]">{stat.suffix}</span>
                      </div>
                      <span className="mt-2 block text-sm font-medium text-[#1c1917]">
                        {stat.label}
                      </span>
                      <span className="mt-1 block text-xs text-[#78716c]">{stat.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="bg-[#F5F0E8] py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-14 max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-12 bg-[#1c1917]/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1c1917]/50">
                  Principii
                </span>
              </div>
              <h2 className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl">
                Cum lucrăm <span className="italic">noi</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#78716c] lg:text-base">
                Trei valori care ne ghidează de la primul contact până la montajul final.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="border border-[#e8e3dc] bg-[#fcfbf9] p-8 shadow-[0_14px_34px_rgba(20,18,15,0.06)] transition-shadow hover:shadow-[0_20px_42px_rgba(20,18,15,0.1)]"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center bg-white shadow-sm">
                    <svg
                      className="h-7 w-7 text-[#1c1917]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.25}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={value.visual}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-[#1c1917]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#57534e]">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="bg-[#f7f3ec] py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-12">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-12 bg-[#1c1917]/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1c1917]/50">
                  Povestea noastră
                </span>
              </div>
              <h2 className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-5xl">
                De la un atelier mic, la un nume de{" "}
                <span className="italic text-[#78716c]">încredere</span>
              </h2>
              <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#57534e] lg:text-base">
                <p>
                  Am început în 2007 cu o echipă mică și o idee simplă: mobilier făcut cum trebuie,
                  nu în grabă.
                </p>
                <p>
                  Clienții recomandau mai departe — așa am crescut natural, prin încredere și
                  rezultate care se văd în timp.
                </p>
                <p className="font-medium text-[#1c1917]">
                  Astăzi lucrăm atât proiecte rezidențiale, cât și spații comerciale. Fiecare etapă
                  e urmărită cu aceeași atenție la detalii.
                </p>
              </div>
            </div>
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-[#e7e5e4]">
              <Image
                src={STORY_IMAGE}
                alt="Living cu mobilier modern"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="bg-[#fafaf9] py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-14 max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-12 bg-[#1c1917]/20" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1c1917]/50">
                  Servicii
                </span>
              </div>
              <h2 className="text-4xl font-light tracking-tight text-[#1c1917] lg:text-6xl">
                Ce facem mai <span className="italic">bine</span>
              </h2>
              <p className="mt-4 text-sm text-[#78716c] lg:text-base">
                Trei moduri în care te putem ajuta să îți amenajezi spațiul.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="relative flex flex-col border border-[#e8e3dc] bg-[#fcfbf9] p-8 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(20,18,15,0.12)] lg:p-10"
                >
                  <h3 className="text-xl font-medium leading-snug text-[#1c1917]">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#57534e]">{s.desc}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-[#e7e5e4] pt-6">
                    <span className="text-sm font-semibold text-[#1c1917]">{s.price}</span>
                    <Link
                      href="/produse"
                      className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#1c1917]/50 transition-colors hover:text-[#1c1917]"
                    >
                      Vezi
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="border-y border-[#e8e3dc] bg-[#fcfbf9] py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-12">
            <span className="mb-6 block text-[11px] uppercase tracking-[0.3em] text-[#1c1917]/40">
              Misiunea noastră
            </span>
            <blockquote className="mx-auto max-w-4xl text-3xl font-light leading-[1.15] tracking-tight text-[#1c1917] lg:text-5xl">
              Mobilier care nu doar{" "}
              <span className="italic text-[#78716c]">arată bine</span>, ci rezistă în timp.
            </blockquote>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-[#78716c]">
              {["Lucrăm corect", "Comunicăm transparent", "Livrăm ce promitem"].map((item) => (
                <span key={item} className="flex items-center gap-3">
                  <span className="h-px w-6 bg-[#1c1917]/15" />
                  {item}
                  <span className="h-px w-6 bg-[#1c1917]/15" />
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="bg-[#f7f3ec] px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px] border border-[#e8e3dc] bg-white p-10 shadow-[0_14px_34px_rgba(20,18,15,0.06)] lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-16">
            <div>
              <h2 className="text-3xl font-light tracking-tight text-[#1c1917] lg:text-4xl">
                Hai să discutăm despre{" "}
                <span className="italic text-[#78716c]">proiectul tău</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#57534e]">
                Din catalog sau la comandă — te ghidăm de la idee la montaj.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:justify-end">
              <Button
                href="/produse"
                variant="solid"
                className="rounded-none px-8 py-4 text-xs uppercase tracking-widest"
              >
                Vezi produsele
              </Button>
              <Button
                href="/contact"
                variant="outline"
                className="rounded-none border-[#1c1917]/20 bg-transparent px-8 py-4 text-xs uppercase tracking-widest text-[#1c1917] hover:bg-[#1c1917]/5"
              >
                Contactează-ne
              </Button>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}

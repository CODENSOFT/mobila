import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/src/components/ui/Button";
import FadeInOnScroll from "@/src/components/ui/FadeInOnScroll";
import AboutSnippet from "@/src/components/sections/AboutSnippet";
import { getDictionary, isLocale } from "../dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ro" }, { lang: "ru" }];
}

const HERO_IMAGE =
  "https://draperandkramer.com/wp-content/uploads/2022/04/insights-exploring-interior-design-trends-textured-furniture-draperandkramer_20220427_header-image.jpg";

const STORY_IMAGE =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop";

const VALUE_ICONS = [
  "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
];

function SectionEyebrow({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "onDark";
}) {
  const line = variant === "onDark" ? "bg-white/30" : "bg-stone-300";
  const label = variant === "onDark" ? "text-white/75" : "text-stone-500";
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className={`h-px w-12 shrink-0 ${line}`} aria-hidden />
      <span className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${label}`}>{children}</span>
    </div>
  );
}

export default async function DesprePage({ params }: PageProps<"/[lang]/despre">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const t = dict.about;

  return (
    <main className="bg-[#faf9f7] text-stone-900 antialiased">
      {/* Hero */}
      <section className="relative min-h-[min(92vh,880px)] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Interior cu mobilier modern"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#0c0a09]/58" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0c0a09]/85 via-[#0c0a09]/45 to-transparent" />

        <div className="relative mx-auto flex min-h-[min(92vh,880px)] max-w-7xl items-end px-6 pb-20 pt-28 lg:items-center lg:pb-24 lg:pt-32">
          <div className="max-w-2xl">
            <SectionEyebrow variant="onDark">{t.badge}</SectionEyebrow>

            <h1 className="text-[2.65rem] font-extralight leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.hero.heading1}
              <br />
              <span className="font-serif italic text-(--brand-green)">{t.hero.heading2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/75 sm:text-lg">
              {t.hero.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              <Button
                href={`/${lang}/produse`}
                variant="outline"
                className="rounded-none border-white/25 bg-white/5 px-9 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:border-(--brand-green) hover:bg-(--brand-green)/15 hover:text-white"
              >
                {t.hero.ctaProducts}
              </Button>
              <Link
                href={`/${lang}/contact`}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65 underline-offset-[10px] transition-colors hover:text-white"
              >
                {t.hero.ctaContact}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FadeInOnScroll>
        <AboutSnippet />
      </FadeInOnScroll>

      {/* Timeline + stats */}
      <FadeInOnScroll>
        <section className="relative overflow-hidden border-y border-stone-200/80 bg-[#f0ece6] py-24 lg:py-32">
          <div
            className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-(--brand-green)/[0.06] blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full bg-amber-200/10 blur-[90px]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-14 max-w-2xl lg:mb-16">
              <SectionEyebrow>{t.timeline.label}</SectionEyebrow>
              <h2 className="text-3xl font-extralight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                {t.timeline.heading}{" "}
                <span className="font-serif italic text-stone-600">{t.timeline.italic}</span>
              </h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-5">
                <div className="relative pl-2">
                  <div className="absolute left-[21px] top-2 bottom-2 w-px bg-stone-300/80" aria-hidden />
                  <ul className="space-y-0">
                    {t.timeline.items.map((item) => (
                      <li key={item.year} className="relative flex gap-6 pb-10 last:pb-0">
                        <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-[#f0ece6] text-[10px] font-semibold text-stone-500">
                          {item.year.slice(-2)}
                        </div>
                        <div className="pt-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--brand-green)">
                            {item.year}
                          </p>
                          <p className="mt-1 text-base font-medium text-stone-900">{item.event}</p>
                          <p className="mt-0.5 text-sm leading-relaxed text-stone-600">{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <div className="overflow-hidden rounded-2xl border border-stone-300/90 bg-[#faf9f7] shadow-[0_20px_50px_rgba(28,25,23,0.06)]">
                  <div className="grid grid-cols-2 divide-x divide-y divide-stone-200/90">
                    {t.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="group relative bg-[#faf9f7] p-8 text-center transition-colors hover:bg-white lg:p-10"
                      >
                        <div className="flex min-h-[3.25rem] items-baseline justify-center gap-0.5">
                          {stat.num ? (
                            <>
                              <span className="text-3xl font-extralight tabular-nums text-stone-900 lg:text-4xl">
                                {stat.num}
                              </span>
                              <span className="text-xl font-extralight text-stone-900">{stat.suffix}</span>
                            </>
                          ) : (
                            <span className="text-3xl font-extralight text-stone-400 lg:text-4xl" aria-hidden>
                              —
                            </span>
                          )}
                        </div>
                        <span className="mt-3 block text-sm font-medium text-stone-900">{stat.label}</span>
                        <span className="mt-1 block text-xs leading-snug text-stone-500">{stat.sub}</span>
                        <div className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-(--brand-green) transition-all duration-500 group-hover:w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Principles */}
      <FadeInOnScroll>
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-14 max-w-2xl lg:mb-16">
              <SectionEyebrow>{t.values.label}</SectionEyebrow>
              <h2 className="text-3xl font-extralight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                {t.values.heading}{" "}
                <span className="font-serif italic text-stone-600">{t.values.italic}</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">
                {t.values.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 md:gap-px md:bg-stone-200 md:pt-px">
              {t.values.items.map((value, index) => (
                <div
                  key={value.title}
                  className="group relative border border-stone-200 bg-white p-8 transition-shadow hover:shadow-[0_24px_48px_rgba(28,25,23,0.06)] md:border-0 md:p-10 lg:p-11"
                >
                  <span className="pointer-events-none absolute right-6 top-6 text-5xl font-extralight text-stone-100 transition-colors group-hover:text-(--brand-green)/[0.12] lg:right-8 lg:top-8 lg:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative mb-7 flex h-12 w-12 items-center justify-center border border-stone-200 bg-stone-50">
                    <svg
                      className="h-6 w-6 text-stone-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.25}
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={VALUE_ICONS[index]} />
                    </svg>
                  </div>
                  <h3 className="relative text-lg font-semibold tracking-tight text-stone-900">{value.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-stone-600">{value.desc}</p>
                  <div className="relative mt-8 h-px w-10 bg-stone-200 transition-all duration-500 group-hover:w-16 group-hover:bg-(--brand-green)" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Story */}
      <FadeInOnScroll>
        <section className="border-y border-stone-200/80 bg-[#f0ece6] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200 shadow-[0_24px_60px_rgba(28,25,23,0.08)]">
                <Image
                  src={STORY_IMAGE}
                  alt="Living amenajat cu mobilier"
                  fill
                  className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0c0a09]/45 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
                    Est. 2007
                  </span>
                  <span className="mt-0.5 block text-sm font-light text-white">Soroca · Moldova</span>
                </div>
              </div>

              <div>
                <SectionEyebrow>{t.story.label}</SectionEyebrow>
                <h2 className="text-3xl font-extralight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                  {t.story.heading}{" "}
                  <span className="font-serif italic text-stone-600">{t.story.italic}</span>
                </h2>
                <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-stone-600">
                  <p>{t.story.para1}</p>
                  <p>{t.story.para2}</p>
                  <p className="font-medium text-stone-900">{t.story.para3}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Services */}
      <FadeInOnScroll>
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-14 flex flex-col justify-between gap-8 sm:mb-16 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <SectionEyebrow>{t.services.label}</SectionEyebrow>
                <h2 className="text-3xl font-extralight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                  {t.services.heading}{" "}
                  <span className="font-serif italic text-stone-600">{t.services.italic}</span>
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-stone-600 sm:text-base">{t.services.description}</p>
              </div>
              <Link
                href={`/${lang}/produse`}
                className="inline-flex shrink-0 items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500 transition-colors hover:text-stone-900 sm:self-auto"
              >
                {t.services.see}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {t.services.items.map((s) => (
                <div
                  key={s.title}
                  className="group relative flex flex-col border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(28,25,23,0.07)] lg:p-10"
                >
                  <div className="absolute left-0 top-0 h-0.5 w-0 bg-(--brand-green) transition-all duration-500 group-hover:w-full" />
                  <h3 className="mt-1 text-lg font-semibold leading-snug text-stone-900">{s.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">{s.desc}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{s.price}</span>
                    <Link
                      href={`/${lang}/produse`}
                      className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400 transition-colors hover:text-stone-900"
                    >
                      {t.services.see}
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Mission */}
      <FadeInOnScroll>
        <section className="bg-[#1c1917] py-24 text-white lg:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
            <span className="mb-8 block text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
              {t.mission.label}
            </span>
            <blockquote className="text-2xl font-extralight leading-snug tracking-tight text-white sm:text-3xl lg:text-[2rem]">
              {t.mission.quote1}{" "}
              <span className="font-serif italic text-(--brand-green)">{t.mission.italic}</span>
              {t.mission.quote2}
            </blockquote>
            <div className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {t.mission.principles.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50"
                >
                  <span className="h-1 w-1 rounded-full bg-(--brand-green)" aria-hidden />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </main>
  );
}

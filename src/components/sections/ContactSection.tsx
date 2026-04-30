"use client";

import { useLang } from "@/src/context/LangContext";

type ContactSectionProps = {
  showForm?: boolean;
  form?: React.ReactNode;
};

export default function ContactSection({ showForm = false, form }: ContactSectionProps) {
  const { dict } = useLang();
  const t = dict.contact;

  return (
    <section id="contact" className="bg-[#fafaf9]">
      <div className="border-b border-[#e7e5e4] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-[#1c1917]/20" />
              <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#1c1917]/50">
                {t.badge}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-light text-[#1c1917] leading-tight">
              {t.heading} <span className="italic font-normal">{t.italic}</span>
            </h1>
            <p className="mt-6 text-lg text-[#78716c] leading-relaxed">{t.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-12">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                {t.phone}
              </h3>
              <a href="tel:+37369727444" className="text-2xl lg:text-3xl font-light text-[#1c1917] hover:text-[#78716c] transition-colors">
                +373 697 27 444
              </a>
              <p className="mt-2 text-sm text-[#a8a29e]">{t.phoneHours}</p>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                {t.email}
              </h3>
              <a href="mailto:Labirint.info@mail.ru" className="text-xl lg:text-2xl font-light text-[#1c1917] hover:text-[#78716c] transition-colors">
                Labirint.info@mail.ru
              </a>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-4">
                {t.address}
              </h3>
              <p className="text-xl lg:text-2xl font-light text-[#1c1917] leading-relaxed">
                Soroca, strada Bechir 4
              </p>
              <p className="mt-2 text-sm text-[#a8a29e]">Republica Moldova</p>
            </div>

            <div className="pt-8 border-t border-[#e7e5e4]">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1c1917]/40 mb-6">
                {t.social}
              </h3>
              <div className="flex items-center gap-4">
                {[
                  { name: "Facebook", href: "https://facebook.com/labirint" },
                  { name: "Instagram", href: "https://instagram.com/labirint" },
                  { name: "Telegram", href: "https://t.me/labirint" },
                ].map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 border border-[#e7e5e4] text-sm text-[#57534e] hover:border-[#1c1917] hover:text-[#1c1917] transition-colors">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] bg-[#e7e5e4]">
              <iframe
                title="LABIRINT Soroca"
                src="https://www.google.com/maps?q=Soroca%20Strada%20Bechir%204&output=embed"
                className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-sm text-[#a8a29e] text-center">{t.mapHint}</p>
          </div>
        </div>

        {showForm && (
          <div className="mt-20 lg:mt-24 pt-16 lg:pt-20 border-t border-[#e7e5e4]">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-light text-[#1c1917]">{t.formHeading}</h2>
              <p className="mt-3 text-[#78716c]">{t.formDesc}</p>
            </div>
            <div className="max-w-2xl mx-auto">{form}</div>
          </div>
        )}
      </div>
    </section>
  );
}

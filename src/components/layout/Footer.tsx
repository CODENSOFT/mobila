"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/src/context/LangContext";

export default function Footer() {
  const { lang, dict } = useLang();
  const t = dict.footer;

  const footerLinks = {
    produse: [
      { label: t.links.dormitoare, href: `/${lang}/produse?categorie=Dormitor` },
      { label: t.links.bucatarii, href: `/${lang}/produse?categorie=Bucatarii` },
      { label: t.links.dulapuri, href: `/${lang}/produse?categorie=Dulapuri` },
      { label: t.links.scaune, href: `/${lang}/produse?categorie=Scaune` },
      { label: t.links.mese, href: `/${lang}/produse?categorie=Mese` },
    ],
    companie: [
      { label: t.links.despre, href: `/${lang}/despre` },
      { label: t.links.contact, href: `/${lang}/contact` },
    ],
  };

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-5 space-y-6">
            <Link href={`/${lang}`} className="inline-flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="LABIRINT Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span>
                <span className="block text-xl font-medium tracking-tight">LABIRINT</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-(--brand-green)">
                  {dict.nav.tagline}
                </span>
              </span>
            </Link>

            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              {t.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1DRxEK2czY/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/labirint.md/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Product links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              {t.productsHeading}
            </h4>
            <ul className="space-y-3">
              {footerLinks.produse.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              {t.companyHeading}
            </h4>
            <ul className="space-y-3">
              {footerLinks.companie.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              {t.links.contact}
            </h4>
            <div className="space-y-4">
              <a href="tel:+37369727444" className="block text-lg font-light text-white hover:text-white/80 transition-colors">
                +373 697 27 444
              </a>
              <a href="mailto:Labirint.info@mail.ru" className="block text-sm text-white/60 hover:text-white transition-colors">
                Labirint.info@mail.ru
              </a>
              <p className="text-sm text-white/60 leading-relaxed">
                Soroca, str. Bechir 4<br />
                Republica Moldova
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-6">
          <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
            <p className="text-xs text-white/40">
              Created by{" "}
              <a
                href="https://codensoft.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white"
              >
                Codensoft.md
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

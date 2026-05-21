"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import CartIcon from "../cart/CartIcon";
import { useLang } from "@/src/context/LangContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, dict } = useLang();
  const nav = dict.nav;

  const segments = pathname.split("/").filter(Boolean);
  const currentLang = segments[0] === "ro" || segments[0] === "ru" ? segments[0] : "ro";
  const restPath = segments.slice(1).join("/");

  const menuItems = [
    { href: `/${lang}`, label: nav.home },
    { href: `/${lang}/produse`, label: nav.products },
    { href: `/${lang}/despre`, label: nav.about },
    { href: `/${lang}/contact`, label: nav.contact },
  ];

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLang = useCallback((targetLang: string) => {
    localStorage.setItem("lang", targetLang);
    document.cookie = `lang=${targetLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    const newPath = restPath ? `/${targetLang}/${restPath}` : `/${targetLang}`;
    router.replace(newPath);
  }, [restPath, router]);

  const isLight = true;

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <nav className="flex h-20 lg:h-24 items-center justify-between">

          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="LABIRINT Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <div className="hidden sm:block">
              <span className={`block text-lg font-medium tracking-tight transition-colors duration-300 ${isLight ? "text-gray-900" : "text-white"}`}>
                LABIRINT
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-(--brand-green) transition-colors duration-300">
                {nav.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm tracking-wide transition-colors duration-300 ${
                    isLight
                      ? isActive ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"
                      : isActive ? "text-white font-medium" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  } ${isLight ? "bg-gray-900" : "bg-white"}`} />
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className={isLight ? "text-gray-900" : "text-white"}>
              <CartIcon />
            </div>

            {/* Language switcher */}
            <div className={`flex items-center gap-1 text-xs font-medium ${isLight ? "text-gray-500" : "text-white/70"}`}>
              <button
                type="button"
                onClick={() => switchLang("ro")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLang === "ro"
                    ? isLight ? "text-gray-900 font-semibold" : "text-white font-semibold"
                    : "hover:opacity-100 opacity-60"
                }`}
              >
                RO
              </button>
              <span className="opacity-30">|</span>
              <button
                type="button"
                onClick={() => switchLang("ru")}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  currentLang === "ru"
                    ? isLight ? "text-gray-900 font-semibold" : "text-white font-semibold"
                    : "hover:opacity-100 opacity-60"
                }`}
              >
                RU
              </button>
            </div>

            {/* Phone */}
            <a
              href="tel:069727444"
              className={`hidden md:flex items-center gap-2 text-sm transition-colors duration-300 ${
                isLight ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">0697 27 444</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 transition-colors duration-300 ${isLight ? "text-gray-900" : "text-white"}`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`block w-full h-px bg-current transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-full h-px bg-current transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-2/3 h-px bg-current transition-all duration-300 origin-center ${isOpen ? "w-full -rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="mx-auto max-w-[1400px] px-6 py-8">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-4 text-2xl font-light tracking-tight transition-colors ${
                    isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-900"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile language switcher */}
          <div className="mt-6 flex items-center gap-3 text-sm font-medium text-gray-500">
            <button
              type="button"
              onClick={() => { switchLang("ro"); setIsOpen(false); }}
              className={currentLang === "ro" ? "text-gray-900 font-semibold" : ""}
            >
              Română
            </button>
            <span className="opacity-30">|</span>
            <button
              type="button"
              onClick={() => { switchLang("ru"); setIsOpen(false); }}
              className={currentLang === "ru" ? "text-gray-900 font-semibold" : ""}
            >
              Русский
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <a href="tel:069727444" className="flex items-center gap-3 text-gray-900">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-lg font-medium">0697 27 444</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

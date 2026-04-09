"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import CartIcon from "../cart/CartIcon";

const menuItems = [
  { href: "/", label: "Acasă" },
  { href: "/produse", label: "Produse" },
  { href: "/despre", label: "Despre" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLight = !isHomePage || isScrolled;

  return (
    <header 
      className={`${isHomePage ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isLight
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-100"
            : "bg-transparent"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <nav className="flex h-20 lg:h-24 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 ${
              isLight 
                ? "border-gray-900 group-hover:bg-gray-900" 
                : "border-white/30 group-hover:bg-white group-hover:border-white"
            }`}>
              <svg 
                viewBox="0 0 24 24" 
                className={`w-5 h-5 transition-colors duration-300 ${isLight ? "text-gray-900 group-hover:text-white" : "text-white"}`}
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className={`block text-lg font-medium tracking-tight transition-colors duration-300 ${isLight ? "text-gray-900" : "text-white"}`}>
                LABIRINT
              </span>
              <span className={`block text-[9px] uppercase tracking-[0.3em] transition-colors duration-300 ${isLight ? "text-gray-400" : "text-white/60"}`}>
                Mobilier Premium
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  } ${isLight ? "bg-gray-900" : "bg-white"}`} />
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <div className={isLight ? "text-gray-900" : "text-white"}>
              <CartIcon />
            </div>

            {/* Phone - Hidden on mobile */}
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

            {/* CTA Button */}
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                isLight
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
            >
              Solicită Ofertă
            </Link>

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
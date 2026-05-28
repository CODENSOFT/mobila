"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const LOCALES = ["ro", "ru"];

export default function LangGuard() {
  const pathname = usePathname();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;

    const saved = localStorage.getItem("lang");
    if (!saved || !LOCALES.includes(saved)) return;

    const urlLang = LOCALES.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    );
    if (!urlLang || saved === urlLang) return;

    didRedirect.current = true;
    const rest = pathname.slice(urlLang.length + 1);
    window.location.replace(rest ? `/${saved}/${rest}` : `/${saved}`);
  }, [pathname]);

  return null;
}

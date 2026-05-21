"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const LOCALES = ["ro", "ru"];

export default function LangGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (!saved || !LOCALES.includes(saved)) return;

    const urlLang = LOCALES.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    );
    if (!urlLang || saved === urlLang) return;

    const rest = pathname.slice(urlLang.length + 1);
    router.replace(rest ? `/${saved}/${rest}` : `/${saved}`);
  }, [pathname, router]);

  return null;
}

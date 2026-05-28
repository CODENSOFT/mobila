"use client";

import { usePathname } from "next/navigation";

const HOME_PATHS = new Set(["/ro", "/ru", "/ro/", "/ru/", "/"]);

export default function NavbarSpacer() {
  const pathname = usePathname();
  if (HOME_PATHS.has(pathname)) return null;
  return <div className="h-14 lg:h-16" aria-hidden />;
}

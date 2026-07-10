import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ro", "ru"];
const DEFAULT_LOCALE = "ro";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Panou admin — no locale prefix (skip redirect below)
  if (pathname.startsWith("/panou-mobila-2026")) {
    return NextResponse.next();
  }

  const pathnameLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameLocale) {
    // If the user has a saved language preference that differs from the URL, redirect
    const savedLang = request.cookies.get("lang")?.value;
    if (savedLang && LOCALES.includes(savedLang) && savedLang !== pathnameLocale) {
      const rest = pathname.slice(pathnameLocale.length + 1);
      const newPathname = rest ? `/${savedLang}/${rest}` : `/${savedLang}`;
      return NextResponse.redirect(new URL(newPathname + search, request.url));
    }
    return NextResponse.next();
  }

  // No locale prefix — redirect to default locale (or saved preference)
  const savedLang = request.cookies.get("lang")?.value;
  const targetLocale = savedLang && LOCALES.includes(savedLang) ? savedLang : DEFAULT_LOCALE;
  request.nextUrl.pathname = `/${targetLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|admin|images|favicon\\.ico|favicon\\.png|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml).*)",
  ],
};

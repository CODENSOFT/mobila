import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ro", "ru"];
const DEFAULT_LOCALE = "ro";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Panou admin — no locale prefix (skip redirect below)
  if (pathname.startsWith("/panou-mobila-2026")) {
    return NextResponse.next();
  }

  // Locale redirect — send paths without /ro or /ru prefix to /ro
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|admin|images|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};

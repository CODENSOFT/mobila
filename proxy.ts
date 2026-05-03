import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ro", "ru"];
const DEFAULT_LOCALE = "ro";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin panel auth — protect /panou-mobila-2026 (except /login)
  if (pathname.startsWith("/panou-mobila-2026")) {
    if (
      pathname === "/panou-mobila-2026/login" ||
      pathname.startsWith("/panou-mobila-2026/login/")
    ) {
      return NextResponse.next();
    }
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.redirect(new URL("/panou-mobila-2026/login", request.url));
    }
    const cookie = request.cookies.get("admin_auth")?.value;
    if (cookie !== expected) {
      return NextResponse.redirect(new URL("/panou-mobila-2026/login", request.url));
    }
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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["ro", "ru"];
const DEFAULT_LOCALE = "ro";

function detectLocale(request: NextRequest): string {
  // "Limba de bază" trebuie să fie mereu româna.
  // Dacă userul alege manual `/${lang}`, acel slug rămâne sursa de adevăr.
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) return;

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|api|admin|images|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};

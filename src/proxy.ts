import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

/**
 * Next.js 16 proxy (replaces middleware.ts).
 *
 * Pipeline:
 *   1. i18n middleware first - resolves locale cookie/URL prefix.
 *   2. Auth guard on buyer routes (cookie mirrors `access_token`).
 *
 * JWT lives in localStorage (client-only), so this proxy checks a cookie mirror
 * that is set by `SessionCookieBridge` in the root layout. Missing cookie on a
 * protected path -> redirect to /login?next=<encoded path>.
 */
const intlHandler = createIntlMiddleware(routing);

const PROTECTED_PREFIXES = ['/cart', '/checkout', '/orders', '/addresses', '/profile'];

function authGuard(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get('access_token')?.value;
  if (token) return NextResponse.next();

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('next', pathname + (search ?? ''));
  return NextResponse.redirect(loginUrl);
}

export default function proxy(req: NextRequest) {
  // i18n first so locale routing/redirect is settled before auth checks.
  const intlResponse = intlHandler(req);

  // If intl middleware returned a redirect (e.g. /en/... -> /vi/...), respect it
  // and skip auth (the browser will follow the redirect to a clean public path).
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const authResponse = authGuard(req);

  // Preserve any cookies/headers the intl middleware set (e.g. NEXT_LOCALE).
  if (intlResponse && authResponse) {
    intlResponse.headers.forEach((value, key) => {
      if (!authResponse.headers.has(key)) {
        authResponse.headers.append(key, value);
      }
    });
    return authResponse;
  }

  return authResponse ?? intlResponse ?? NextResponse.next();
}

/**
 * Apply to every path except static, api, _next, favicon and files with extensions.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
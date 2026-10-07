import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy (thay thế middleware.ts cũ).
 * Bảo vệ các buyer routes: /cart, /checkout, /orders, /addresses, /profile.
 * Vì JWT nằm trong localStorage (chỉ client mới đọc được), proxy chỉ kiểm tra
 * một cookie mirror `access_token` mà client set qua một useEffect ở root layout.
 * Trong thực tế nếu không có cookie → chuyển hướng /login.
 */
const PROTECTED_PREFIXES = ["/cart", "/checkout", "/orders", "/addresses", "/profile"];

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  if (token) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname + (search ?? ""));
  return NextResponse.redirect(loginUrl);
}

/**
 * Áp dụng cho mọi path ngoại trừ static / api / _next / favicon.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores";
import { useLogout } from "@/hooks";
import { cartApi } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("common.header");
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: Boolean(user),
  });
  const cartCount = cart?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold text-red-600">
          {t("brand")}
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link href="/flash-sales" className="text-sm font-medium hover:text-red-600">
            {t("nav.flashSale")}
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-red-600">
            {t("nav.products")}
          </Link>
          {user && (
            <Link href="/orders" className="text-sm font-medium hover:text-red-600">
              {t("nav.orders")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {user ? (
            <>
              <Link
                href="/cart"
                className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={t("cart")}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                className="hidden text-sm font-medium hover:underline md:block"
              >
                {user.fullName}
              </Link>

              <Button size="sm" variant="outline" onClick={() => logout()}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary">
                  {t("register")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

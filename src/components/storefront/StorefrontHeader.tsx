"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export type StorefrontNavKey =
  | "home"
  | "flash-sale"
  | "category"
  | "voucher"
  | null;

export interface StorefrontHeaderProps {
  activeNav?: StorefrontNavKey;
  variant?: "default" | "compact";
  className?: string;
}

const NAV_ITEMS: { key: Exclude<StorefrontNavKey, null>; label: string; href: string }[] = [
  { key: "home", label: "Trang chủ", href: ROUTES.HOME },
  { key: "flash-sale", label: "Flash Sale", href: ROUTES.FLASH_SALE },
  { key: "category", label: "Danh mục", href: "/danh-muc" },
  { key: "voucher", label: "Voucher", href: ROUTES.VOUCHERS },
];

/**
 * StorefrontHeader – rule §5.
 * - variant="compact" dùng cho Giỏ/Checkout/ZaloPay.
 * - activeNav: truyền tay nếu muốn; nếu KHÔNG truyền, tự detect từ pathname.
 */
export function StorefrontHeader({
  activeNav,
  variant = "default",
  className,
}: StorefrontHeaderProps) {
  const pathname = usePathname() ?? "";
  const detected: StorefrontNavKey = (() => {
    if (pathname.startsWith(ROUTES.FLASH_SALE)) return "flash-sale";
    if (pathname.startsWith(ROUTES.VOUCHERS)) return "voucher";
    if (pathname.startsWith("/danh-muc")) return "category";
    if (pathname === ROUTES.HOME || pathname === "/") return "home";
    return null;
  })();
  const active = activeNav ?? detected;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-line bg-card/95 backdrop-blur",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center gap-3 px-4",
          variant === "compact" ? "h-12" : "h-16"
        )}
      >
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm font-bold text-white">
            VM
          </span>
          <span className="text-base font-semibold text-ink">Vibe Mart</span>
        </Link>

        {variant === "default" && (
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={item.key === active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  item.key === active
                    ? "bg-brand-soft font-semibold text-brand"
                    : "text-ink-2 hover:bg-page hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Link
            href={ROUTES.SEARCH}
            aria-label="Tìm kiếm"
            className="rounded-md p-2 text-ink-2 hover:bg-page hover:text-ink"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href={ROUTES.CART}
            aria-label="Giỏ hàng"
            className="rounded-md p-2 text-ink-2 hover:bg-page hover:text-ink"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link
            href={ROUTES.ACCOUNT}
            aria-label="Tài khoản"
            className="rounded-md p-2 text-ink-2 hover:bg-page hover:text-ink"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

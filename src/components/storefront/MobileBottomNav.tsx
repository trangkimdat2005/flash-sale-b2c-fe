"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export type MobileNavKey = "home" | "flash-sale" | "orders" | "me";

export interface MobileBottomNavProps {
  active?: MobileNavKey;
  className?: string;
}

const ITEMS: { key: MobileNavKey; label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "home", label: "Trang chủ", href: ROUTES.HOME, icon: Home },
  { key: "flash-sale", label: "Flash Sale", href: ROUTES.FLASH_SALE, icon: Zap },
  { key: "orders", label: "Đơn hàng", href: ROUTES.ORDERS, icon: Receipt },
  { key: "me", label: "Tôi", href: ROUTES.ACCOUNT, icon: User },
];

/**
 * MobileBottomNav – rule §5, §9: 4 tab, tự detect `active` từ pathname
 * (hoặc nhận tay qua prop).
 */
export function MobileBottomNav({ active: activeProp, className }: MobileBottomNavProps) {
  const pathname = usePathname() ?? "";
  const detected: MobileNavKey = (() => {
    if (pathname.startsWith(ROUTES.FLASH_SALE)) return "flash-sale";
    if (pathname.startsWith(ROUTES.ORDERS)) return "orders";
    if (pathname.startsWith(ROUTES.ACCOUNT) || pathname.startsWith(ROUTES.VOUCHERS)) return "me";
    return "home";
  })();
  const active = activeProp ?? detected;

  return (
    <nav
      aria-label="Điều hướng dưới"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden",
        className
      )}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2 text-[11px]",
              isActive ? "text-brand" : "text-ink-2"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

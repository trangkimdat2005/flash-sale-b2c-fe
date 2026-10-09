import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants";

/**
 * AuthHeader – header riêng cho trang xác thực (login, register, forgot-password).
 * Khác StorefrontHeader: gọn, 1 hàng, chỉ logo + 2 link điều hướng.
 * Rule docs/CLAUDE.md §5: tái sử dụng component, không copy header khác.
 */
export function AuthHeader() {
  const t = useTranslations("auth.chrome.header");
  return (
    <header
      className="w-full border-b border-line bg-card"
      data-testid="auth-header"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
          aria-label="Vibe Mart – Trang chủ"
        >
          <Image
            src="/brand/logo/vibe-mart-logo-mark-light.png"
            alt="Vibe Mart"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="text-base font-semibold text-ink">Vibe Mart</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-ink-2 sm:inline">{t("authLabel")}</span>
          <Link
            href="/tro-giup"
            className="text-ink-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {t("navHelp")}
          </Link>
          <span className="text-line" aria-hidden>
            |
          </span>
          <Link
            href={ROUTES.HOME}
            className="text-ink-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {t("navHome")}
          </Link>
        </div>
      </div>
    </header>
  );
}

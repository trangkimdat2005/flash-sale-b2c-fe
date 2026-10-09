import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * AuthFooter – footer riêng cho trang xác thực.
 * Gọn: copyright + 3 link pháp lý.
 */
export function AuthFooter() {
  const t = useTranslations("auth.chrome.footer");
  return (
    <footer
      className="w-full border-t border-line bg-page py-6"
      data-testid="auth-footer"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 text-sm text-ink-2 sm:flex-row">
        <p>{t("copyright")}</p>
        <nav className="flex items-center gap-4" aria-label="Footer">
          <Link
            href="/dieu-khoan"
            className="hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {t("terms")}
          </Link>
          <Link
            href="/chinh-sach-bao-mat"
            className="hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/lien-he"
            className="hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {t("contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("common.footer");
  const tNav = useTranslations("common.header.nav");
  const tHeader = useTranslations("common.header");

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 text-sm md:grid-cols-4">
          <div>
            <p className="font-bold text-red-600">FlashSale B2C</p>
            <p className="mt-2 text-zinc-500">
              Đồ án Kỹ thuật Phần mềm - Sàn Flash Sale B2C chống Over-selling.
            </p>
          </div>
          <div>
            <p className="font-medium">{t("shopping")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li><Link href="/flash-sales">{tNav("flashSale")}</Link></li>
              <li><Link href="/products">{tNav("products")}</Link></li>
              <li>
                <Link href="/cart">
                  {tHeader("cart", { defaultMessage: "Giỏ hàng" })}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium">{t("account")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li>
                <Link href="/profile">
                  {t("profile", { defaultMessage: "Hồ sơ" })}
                </Link>
              </li>
              <li><Link href="/orders">{tNav("orders")}</Link></li>
              <li>
                <Link href="/addresses">
                  {t("addresses", { defaultMessage: "Sổ địa chỉ" })}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium">{t("support")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li>{t("supportEmail")}</li>
              <li>{t("copyright")}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

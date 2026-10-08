import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Về Vibe Mart",
    links: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/ho-tro" },
      { label: "Đăng ký bán hàng", href: ROUTES.SELLER_REGISTER },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản", href: "/dieu-khoan" },
      { label: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    ],
  },
];

/**
 * StorefrontFooter – một bản duy nhất cho mọi trang người mua (rule §5).
 */
export function StorefrontFooter() {
  return (
    <footer className="mt-12 border-t border-line bg-card">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm font-bold text-white">
              VM
            </span>
            <span className="text-base font-semibold text-ink">Vibe Mart</span>
          </div>
          <p className="mt-3 text-sm text-ink-2">
            Sàn thương mại điện tử B2C – Flash Sale chống bán vượt kho.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1200px] px-4 py-4 text-xs text-ink-3">
          © {new Date().getFullYear()} Vibe Mart. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}

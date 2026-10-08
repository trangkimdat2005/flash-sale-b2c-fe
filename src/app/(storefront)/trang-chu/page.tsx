import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const QUICK_LINKS: { href: string; title: string; desc: string }[] = [
  {
    href: ROUTES.FLASH_SALE,
    title: "Flash Sale",
    desc: "Săn deal giá sốc mỗi ngày – chống bán vượt kho.",
  },
  {
    href: ROUTES.SEARCH,
    title: "Tìm sản phẩm",
    desc: "Tìm theo tên, danh mục hoặc shop yêu thích.",
  },
  {
    href: ROUTES.VOUCHERS,
    title: "Kho voucher",
    desc: "Lưu mã giảm giá để dùng khi thanh toán.",
  },
  {
    href: ROUTES.SELLER_REGISTER,
    title: "Đăng ký bán hàng",
    desc: "Mở shop trên Vibe Mart chỉ trong vài bước.",
  },
];

/**
 * Trang chủ Storefront (placeholder bước "lõi").
 * Sau khi có API sẽ render: banner Flash Sale, danh mục nổi bật, sản phẩm đề xuất.
 */
export default function TrangChuPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-brand-soft p-6">
        <h1 className="text-2xl font-semibold text-ink">Vibe Mart</h1>
        <p className="mt-1 max-w-prose text-sm text-ink-2">
          Sàn thương mại điện tử B2C với Flash Sale chống bán vượt kho.
          Đăng nhập để theo dõi đơn hàng, lưu voucher và bắt đầu mua sắm.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Khám phá nhanh</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-brand hover:bg-brand-soft/40"
            >
              <h3 className="text-sm font-semibold text-ink">{q.title}</h3>
              <p className="mt-1 text-xs text-ink-2">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

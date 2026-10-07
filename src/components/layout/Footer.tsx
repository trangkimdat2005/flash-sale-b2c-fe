import Link from "next/link";

export function Footer() {
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
            <p className="font-medium">Mua sắm</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li><Link href="/flash-sales">Flash Sale</Link></li>
              <li><Link href="/products">Sản phẩm</Link></li>
              <li><Link href="/cart">Giỏ hàng</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Tài khoản</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li><Link href="/profile">Hồ sơ</Link></li>
              <li><Link href="/orders">Đơn hàng</Link></li>
              <li><Link href="/addresses">Sổ địa chỉ</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Hỗ trợ</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li>Liên hệ: support@flashsale.utc2</li>
              <li>© 2026 UTC2</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
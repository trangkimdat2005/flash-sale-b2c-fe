import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm text-ink-2">
          Trang bạn truy cập không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/trang-chu">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

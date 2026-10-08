import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-danger">403</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">Không có quyền truy cập</h1>
        <p className="mt-2 text-sm text-ink-2">
          Bạn không có quyền vào khu vực này. Nếu bạn cho rằng đây là nhầm lẫn, hãy liên hệ quản trị.
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

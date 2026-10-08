import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BaoTriPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Tính năng đang bảo trì</h1>
        <p className="mt-2 text-sm text-ink-2">
          Vibe Mart đang nâng cấp khu vực này. Vui lòng quay lại sau ít phút.
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

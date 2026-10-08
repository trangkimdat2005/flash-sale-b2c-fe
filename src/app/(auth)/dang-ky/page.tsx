import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Dang ky - Vibe Mart" };
/**
 * Trang dang ky (route guard step 1).
 * Stub: khi middleware redirect toi day (user da login vao trang auth),
 * chua co UI that - se bo sung khi lam flow auth.
 */
export default function DangKyPage() {
  return (
    <main className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-4">
      <div className="w-full rounded-xl border border-line bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Dang ky</h1>
        <p className="mt-2 text-sm text-ink-2">
          Stub dang ky. Se duoc thay the khi lam flow auth that.
        </p>
        <div className="mt-6">
          <Button asChild variant="secondary" className="w-full">
            <Link href="/dang-nhap">Da co tai khoan? Dang nhap</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

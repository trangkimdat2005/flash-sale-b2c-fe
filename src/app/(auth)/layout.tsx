import type { ReactNode } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

/**
 * Layout `(auth)` – full-bleed, gồm AuthHeader + main + AuthFooter.
 * Áp dụng cho: /dang-nhap, /dang-ky, /quen-mat-khau, ...
 * Side-effect: tất cả route trong (auth) đều có header/footer (đã duyệt 2026-10-09).
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AuthHeader />
      <main className="flex-1">{children}</main>
      <AuthFooter />
    </div>
  );
}

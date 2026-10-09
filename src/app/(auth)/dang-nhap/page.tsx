"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { ROUTES, ROLES } from "@/lib/constants";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

/**
 * Trang đăng nhập – full layout Stitch (203897a8):
 * - Cột trái: AuthBrandPanel (ẩn trên mobile)
 * - Cột phải: LoginForm + SocialLoginButtons (giữa card)
 *
 * Redirect rule (plan 2026-10-09 quyết định 8):
 * - Đã login → về HOME (BUYER) hoặc SELLER_HOME/ADMIN_HOME
 * - Chưa login → render form
 *
 * Sau khi useLoginMutation thành công, store.setUser được gọi → re-render
 * → useEffect phát hiện user có role → redirect theo role.
 */
export default function DangNhapPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Redirect nếu đã login (ví dụ user vào /dang-nhap khi đã có session)
  useEffect(() => {
    if (!user) return;
    if (user.role === ROLES.SELLER) {
      router.replace(ROUTES.SELLER_HOME);
    } else if (user.role === ROLES.ADMIN) {
      router.replace(ROUTES.ADMIN_HOME);
    } else {
      router.replace(ROUTES.HOME);
    }
  }, [user, router]);

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6 rounded-xl border border-line bg-card p-8 shadow-sm">
          <LoginForm />
          <SocialLoginButtons />
        </div>
      </div>
    </div>
  );
}

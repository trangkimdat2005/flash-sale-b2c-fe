import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Server-side guard cho App Router page.tsx.
 * Kiểm tra cookie `access_token` (được proxy.ts set thêm từ localStorage không khả dụng SSR,
 * hoặc client-set cookie cho hydration). Nếu không có → redirect.
 *
 * Lưu ý: JWT chính nằm trong localStorage (client). Cookie ở đây chỉ là cờ "đã đăng nhập"
 * mà proxy.ts tự set sau khi refresh token thành công. Nếu cookie tồn tại → cho qua,
 * client sẽ tự rehydrate accessToken từ localStorage trước khi gọi API.
 */
export async function authGuard(nextPath?: string) {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.get("access_token")?.value;
  if (!hasAuth) {
    const target = nextPath ?? "/login";
    redirect(target);
  }
}

export async function requireRole(role: "BUYER" | "SELLER" | "ADMIN") {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("user_role")?.value;
  if (userRole !== role) {
    redirect("/");
  }
}
import { cookies } from "next/headers";
import { COOKIE_KEYS, type Role } from "@/lib/constants";

/**
 * Server-side auth guard (rule auth-jwt).
 * Đọc cookie "access_token", giải mã nhẹ phần payload (không verify chữ ký –
 * backend vẫn kiểm tra quyền thật ở mọi API).
 *
 * Chỉ dùng cho:
 *  - Quyết định render có/không (ẩn admin link khi không phải admin, …)
 *  - Redirect khỏi /seller/** nếu không phải SELLER
 * KHÔNG dùng để bảo vệ API – backend vẫn kiểm tra.
 */
export interface ServerSession {
  token: string;
  userId: string;
  email: string;
  role: Role;
  exp?: number;
}

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: Role | string;
  exp?: number;
  [k: string]: unknown;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Đọc session hiện tại từ cookie (chỉ server). Trả null nếu thiếu/hết hạn. */
export async function getServerSession(): Promise<ServerSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload || !payload.sub || !payload.role) return null;

  // exp tính theo giây
  if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
    return null;
  }

  return {
    token,
    userId: payload.sub,
    email: payload.email ?? "",
    role: payload.role as Role,
    exp: payload.exp,
  };
}

/** Throw-style: bắt buộc có session, dùng cho page bắt buộc đăng nhập. */
export async function requireServerSession(): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

/** Trả về session hoặc null; helper gọn cho page. */
export async function maybeSession(): Promise<ServerSession | null> {
  return getServerSession();
}

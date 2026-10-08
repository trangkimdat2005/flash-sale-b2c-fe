import { apiFetch } from "@/lib/api";
import { ROLES, type Role } from "@/lib/constants";

/**
 * Auth API – gọi backend Spring Boot.
 * KHÔNG dùng `fetch` trực tiếp trong component (rule §7).
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // giây
}

export interface AuthUserDto {
  id: string;
  email: string;
  fullName?: string;
  role: Role;
  permissions?: string[];
  storeStatus?: "PENDING" | "APPROVED" | "BANNED";
}

export async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  // TODO(api): xác nhận endpoint chính thức từ backend (thường /auth/login).
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    json: payload,
    withAuth: false,
  });
}

export async function fetchMe(): Promise<AuthUserDto> {
  // TODO(api): xác nhận endpoint (thường /auth/me).
  return apiFetch<AuthUserDto>("/auth/me", { method: "GET" });
}

export async function logoutRequest(): Promise<void> {
  // TODO(api): nếu backend có /auth/logout, gọi để revoke refresh token.
  await apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
}

/** Ánh xạ role phục vụ test/seed – không dùng trong production. */
export const ROLES_FOR_DEV = ROLES;

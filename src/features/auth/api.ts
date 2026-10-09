import { apiFetch } from '@/lib/api';
import { z } from 'zod';
import { emailSchema, passwordSchema } from './schemas';

/**
 * Auth API – gọi backend Spring Boot thật.
 * Contract: đối chiếu với swagger tại http://180.93.137.28/swagger-ui
 * ngày 2026-10-10.
 *
 * - POST /api/v1/auth/login     payload: { usernameOrEmail, password }
 * - POST /api/v1/auth/logout    payload: { refreshToken }
 * - GET  /api/v1/users/me       trả về UserResponse (cần Bearer)
 *
 * Mọi response thành công đều có dạng envelope
 * ApiResponse<T> = { success, code, message, data: T, timestamp }.
 * `apiFetch` đã tự extract `payload.data` nên ở đây chỉ cần khai báo T.
 *
 * Lưu ý: backend KHÔNG có field `role` / `permissions` trong UserResponse.
 * Role được backend truyền qua JWT claims; client đọc qua
 * `decodeJwt(token)` (sẽ có ở auth-jwt.mdc).
 */

const loginPayloadSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** UserResponse – từ backend (OpenAPI UserResponse schema). */
export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED' | string;
  createdAt: string; // ISO 8601
}

/** AuthResponse – từ backend. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string; // "Bearer"
  expiresIn: number; // giây
  user: UserResponse;
}

/** Alias cho FE – dùng ở useAuthStore. */
export type AuthUserDto = UserResponse;

/** FE form input. */
export interface LoginRequest {
  email: string;
  password: string;
}

export async function loginRequest(
  payload: LoginRequest
): Promise<AuthResponse> {
  const parsed = loginPayloadSchema.parse(payload);
  return apiFetch<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    json: {
      usernameOrEmail: parsed.email,
      password: parsed.password,
    },
    withAuth: false,
  });
}

export async function fetchMe(): Promise<UserResponse> {
  return apiFetch<UserResponse>('/api/v1/users/me', { method: 'GET' });
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await apiFetch<void>('/api/v1/auth/logout', {
    method: 'POST',
    json: { refreshToken },
  }).catch(() => undefined);
}

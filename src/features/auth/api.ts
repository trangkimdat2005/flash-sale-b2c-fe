import { apiFetch } from '@/lib/api';
import { ROLES, type Role } from '@/lib/constants';
import { identifierSchema, passwordSchema } from './schemas';
import { z } from 'zod';

/**
 * Auth API – gọi backend Spring Boot.
 * KHÔNG dùng `fetch` trực tiếp trong component (rule §7).
 *
 * Quyết định plan 2026-10-09: payload gửi cả 2 field (email, phoneNumber),
 * backend tự chọn dùng field nào dựa trên identifier.
 */

const loginPayloadSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

function splitIdentifier(identifier: string): {
  email?: string;
  phoneNumber?: string;
} {
  if (identifier.includes('@')) {
    return { email: identifier, phoneNumber: undefined };
  }
  return { email: undefined, phoneNumber: identifier };
}

export interface LoginRequest {
  identifier: string;
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
  storeStatus?: 'PENDING' | 'APPROVED' | 'BANNED';
}

export async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  // Validate client-side trước khi gửi (defense in depth)
  const parsed = loginPayloadSchema.parse(payload);
  const { email, phoneNumber } = splitIdentifier(parsed.identifier);
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    json: { email, phoneNumber, password: parsed.password },
    withAuth: false,
  });
}

export async function fetchMe(): Promise<AuthUserDto> {
  return apiFetch<AuthUserDto>('/auth/me', { method: 'GET' });
}

export async function logoutRequest(): Promise<void> {
  await apiFetch<void>('/auth/logout', { method: 'POST' }).catch(() => undefined);
}

export const ROLES_FOR_DEV = ROLES;

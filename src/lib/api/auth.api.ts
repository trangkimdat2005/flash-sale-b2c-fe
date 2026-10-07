import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  UserResponse,
} from "@/types";

export const authApi = {
  register: (body: RegisterRequest) =>
    apiFetch<AuthResponse>(ENDPOINTS.auth.register, {
      method: "POST",
      body,
      skipAuth: true,
    }),
  login: (body: LoginRequest) =>
    apiFetch<AuthResponse>(ENDPOINTS.auth.login, {
      method: "POST",
      body,
      skipAuth: true,
    }),
  refreshToken: (body: RefreshTokenRequest) =>
    apiFetch<AuthResponse>(ENDPOINTS.auth.refreshToken, {
      method: "POST",
      body,
      skipAuth: true,
    }),
  logout: () =>
    apiFetch<string>(ENDPOINTS.auth.logout, { method: "POST" }),
  me: () => apiFetch<UserResponse>(ENDPOINTS.users.me),
  changePassword: (body: { oldPassword: string; newPassword: string }) =>
    apiFetch<string>(ENDPOINTS.users.changePassword, {
      method: "PUT",
      body,
    }),
};
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore, type AuthUser } from "@/stores/auth.store";
import {
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
} from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import {
  loginRequest,
  fetchMe,
  logoutRequest,
  type LoginRequest,
  type UserResponse,
  type AuthResponse,
} from "./api";
import { decodeJwtPrimaryRole } from "./jwt";

/** Key theo mảng (rule api-data). */
const KEYS = {
  me: ["auth", "me"] as const,
};

/**
 * Map UserResponse (backend) + JWT authorities → AuthUser (FE store).
 * Backend không trả role trong user DTO — role lấy từ JWT `authorities`.
 */
function toAuthUser(u: UserResponse, accessToken: string): AuthUser {
  return {
    id: String(u.id),
    email: u.email,
    fullName: u.fullName,
    role: decodeJwtPrimaryRole(accessToken),
  };
}

/** useLoginMutation – lưu token + user, điều hướng theo role. */
export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginRequest) => loginRequest(input),
    onSuccess: async (res: AuthResponse) => {
      setAccessToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      const user = toAuthUser(res.user, res.accessToken);
      setUser(user);
      toast.success("Đăng nhập thành công");
      qc.invalidateQueries({ queryKey: KEYS.me });
      // Component chủ động router.push theo role.
    },
    onError: (err: Error) => {
      toast.error(err.message || "Đăng nhập thất bại");
    },
  });
}

/** useLogoutMutation – gọi backend /auth/logout với refreshToken. */
export function useLogoutMutation() {
  const reset = useAuthStore((s) => s.reset);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => {
      // Lấy refreshToken từ sessionStorage để gửi cho backend
      const rt =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("fs_refresh_token")
          : null;
      return logoutRequest(rt ?? "");
    },
    onSettled: () => {
      clearAccessToken();
      clearRefreshToken();
      reset();
      qc.clear();
      if (typeof window !== "undefined") {
        window.location.href = ROUTES.LOGIN;
      }
    },
  });
}

/** useMeQuery – lấy user hiện tại (dùng cho guard phía client). */
export function useMeQuery(enabled = true) {
  return useQuery<UserResponse>({
    queryKey: KEYS.me,
    queryFn: () => fetchMe(),
    enabled,
    staleTime: 60_000,
  });
}

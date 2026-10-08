"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { setAccessToken, clearAccessToken } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import {
  loginRequest,
  fetchMe,
  logoutRequest,
  type LoginRequest,
  type AuthUserDto,
} from "./api";

/** Key theo mảng (rule api-data). */
const KEYS = {
  me: ["auth", "me"] as const,
};

/** useLoginMutation – sau khi login lưu token, user, điều hướng theo role. */
export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginRequest) => loginRequest(input),
    onSuccess: async (res) => {
      setAccessToken(res.accessToken);
      try {
        const me = await fetchMe();
        setUser(me);
        toast.success("Đăng nhập thành công");
        qc.invalidateQueries({ queryKey: KEYS.me });
        // Điều hướng theo role: BUYER → HOME, SELLER → SELLER_HOME, ADMIN → ADMIN_HOME.
        // Component chủ động gọi router.push theo role sau khi mutation thành công.
      } catch {
        toast.error("Không lấy được thông tin người dùng");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Đăng nhập thất bại");
    },
  });
}

/** useLogoutMutation – xoá token, user, cache. */
export function useLogoutMutation() {
  const reset = useAuthStore((s) => s.reset);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      clearAccessToken();
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
  return useQuery<AuthUserDto>({
    queryKey: KEYS.me,
    queryFn: () => fetchMe(),
    enabled,
    staleTime: 60_000,
  });
}

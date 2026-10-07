"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/stores";
import { authApi } from "@/lib/api";

/** Hook xử lý logout + redirect. */
export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const pushToast = useUIStore((s) => s.pushToast);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Bỏ qua lỗi mạng — vẫn clear session phía client.
    }
    clear();
    pushToast({ type: "info", message: "Đã đăng xuất" });
    router.push("/login");
  };

  return { logout };
}

/** Hook sync store khi window focus. */
export function useAuthHydration() {
  useEffect(() => {
    // Zustand persist đã tự hydrate. Hook giữ cho code TS-friendly.
  }, []);
}
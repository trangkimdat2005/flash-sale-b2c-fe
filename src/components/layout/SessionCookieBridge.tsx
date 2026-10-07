"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Mount trong root Providers để mirror access_token từ Zustand persist (localStorage)
 * sang cookie httpOnly=false để Next.js proxy.ts (chạy trên edge) đọc được.
 * KHÔNG lưu refresh_token vì lý do bảo mật.
 */
export function SessionCookieBridge() {
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (accessToken) {
      document.cookie = `access_token=${accessToken}; path=/; max-age=3600; SameSite=Lax`;
    } else {
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    }
  }, [accessToken]);

  return null;
}
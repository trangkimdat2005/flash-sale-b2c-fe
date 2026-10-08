"use client";

import { useEffect } from "react";
import {
  COOKIE_KEYS,
  STORAGE_KEYS,
} from "@/lib/constants";

/**
 * SessionCookieBridge – đồng bộ localStorage "fs_access_token" <-> cookie
 * để Next.js middleware có thể đọc token phục vụ phân quyền route.
 *
 * KHÔNG dùng để xác thực server-side – backend vẫn verify JWT thật.
 */
export function SessionCookieBridge(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      const hasCookie = document.cookie
        .split(";")
        .some((c) => c.trim().startsWith(`${COOKIE_KEYS.ACCESS_TOKEN}=`));
      if (!hasCookie) {
        document.cookie = `${COOKIE_KEYS.ACCESS_TOKEN}=${encodeURIComponent(
          token
        )}; Path=/; SameSite=Lax; Max-Age=86400`;
      }
    }
  }, []);
  return null;
}

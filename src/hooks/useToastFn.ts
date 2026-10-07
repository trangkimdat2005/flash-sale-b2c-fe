"use client";

import { useUIStore } from "@/stores";

/**
 * Hook tiện ích cho toast: trả về object {success, error, info, warning}.
 */
export function useToast() {
  const pushToast = useUIStore((s) => s.pushToast);

  return {
    success: (m: string) => pushToast({ type: "success", message: m }),
    error: (m: string) => pushToast({ type: "error", message: m }),
    info: (m: string) => pushToast({ type: "info", message: m }),
    warning: (m: string) => pushToast({ type: "warning", message: m }),
  };
}
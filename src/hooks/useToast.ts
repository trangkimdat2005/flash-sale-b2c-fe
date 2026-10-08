"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores";

/**
 * Auto-dismiss toast sau 4s.
 */
export function useToastAutoDismiss(toastId: string, ms = 4000) {
  const dismiss = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    const t = setTimeout(() => dismiss(toastId), ms);
    return () => clearTimeout(t);
  }, [toastId, ms, dismiss]);
}
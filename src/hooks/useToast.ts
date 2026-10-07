"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/stores";

/**
 * Auto-dismiss toast sau 4s.
 */
export function useToastAutoDismiss(toastId: string, ms = 4000) {
  const dismiss = useUIStore((s) => s.dismissToast);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const t = setTimeout(() => dismiss(toastId), ms);
    return () => clearTimeout(t);
  }, [toastId, ms, dismiss]);

  return hydrated;
}
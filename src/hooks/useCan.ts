"use client";

import { useAuthStore } from "@/stores/auth.store";

/**
 * useCan(permission) – quyền theo code (vd: "product:update").
 * CHỈ là UX; backend vẫn kiểm tra thật (rule §9).
 */
export function useCan(permission: string): boolean {
  const permissions = useAuthStore((s) => s.user?.permissions);
  if (!permissions || permissions.length === 0) return false;
  return permissions.includes(permission) || permissions.includes("*");
}

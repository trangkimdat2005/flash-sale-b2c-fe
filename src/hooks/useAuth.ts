"use client";

import { useAuthStore } from "@/stores/auth.store";
import { ROLES, type Role } from "@/lib/constants";

/**
 * useAuth – selector gọn cho component (rule auth-jwt).
 * Trả về { user, role, isAuthenticated, isHydrated, setUser, logout }.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const setUser = useAuthStore((s) => s.setUser);
  const reset = useAuthStore((s) => s.reset);

  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isHydrated,
    setUser,
    logout: reset,
    isBuyer: user?.role === ROLES.BUYER,
    isSeller: user?.role === ROLES.SELLER,
    isAdmin: user?.role === ROLES.ADMIN,
  } as const;
}

export type { Role };

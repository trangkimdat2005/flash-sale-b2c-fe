"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponse | null;
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
  }) => void;
  setUser: (user: UserResponse) => void;
  clear: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
      isAuthenticated: () => Boolean(get().accessToken),
    }),
    {
      name: "fs_auth",
      // Lưu cả token để client fetch interceptor đọc được.
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    }
  )
);
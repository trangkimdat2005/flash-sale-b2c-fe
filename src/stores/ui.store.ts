"use client";

import { create } from "zustand";

interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface UIState {
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  pushToast: (t) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { ...t, id: Math.random().toString(36).slice(2) },
      ],
    })),
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
"use client";

import { create } from "zustand";

/**
 * Flash-sale realtime cache (rule websocket-realtime, state-management).
 * - In-memory, KHÔNG persist.
 * - Cập nhật trực tiếp từ STOMP, dùng queryClient.setQueryData ở hook
 *   để tránh refetch cả trang.
 */
export interface StockSnapshot {
  flashSaleItemId: string;
  sold: number;
  remaining: number;
  serverTime: string; // ISO
}

interface FlashSaleState {
  byItem: Record<string, StockSnapshot>;
  setSnapshot: (snap: StockSnapshot) => void;
  setMany: (snaps: StockSnapshot[]) => void;
  reset: () => void;
}

export const useFlashSaleStore = create<FlashSaleState>((set) => ({
  byItem: {},
  setSnapshot: (snap) =>
    set((state) => ({ byItem: { ...state.byItem, [snap.flashSaleItemId]: snap } })),
  setMany: (snaps) =>
    set(() => {
      const next: Record<string, StockSnapshot> = {};
      for (const s of snaps) next[s.flashSaleItemId] = s;
      return { byItem: next };
    }),
  reset: () => set({ byItem: {} }),
}));

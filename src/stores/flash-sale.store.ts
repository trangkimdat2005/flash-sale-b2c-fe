"use client";

import { create } from "zustand";

/**
 * Local cache của available stock & countdown cho Flash Sale.
 * Server vẫn là source of truth (xem docs §5.5 — REST là SoT).
 * WS chỉ cập nhật UI để UX mượt hơn.
 */
interface FlashSaleState {
  /** Map<flashSaleItemId, availableStock> */
  stockByItem: Record<number, number>;
  /** Map<slotId, status> */
  slotStatusById: Record<number, "UPCOMING" | "ACTIVE" | "ENDED">;
  setStock: (itemId: number, availableStock: number) => void;
  setSlotStatus: (slotId: number, status: "UPCOMING" | "ACTIVE" | "ENDED") => void;
  reset: () => void;
}

export const useFlashSaleStore = create<FlashSaleState>((set) => ({
  stockByItem: {},
  slotStatusById: {},
  setStock: (itemId, availableStock) =>
    set((s) => ({
      stockByItem: { ...s.stockByItem, [itemId]: availableStock },
    })),
  setSlotStatus: (slotId, status) =>
    set((s) => ({
      slotStatusById: { ...s.slotStatusById, [slotId]: status },
    })),
  reset: () => set({ stockByItem: {}, slotStatusById: {} }),
}));
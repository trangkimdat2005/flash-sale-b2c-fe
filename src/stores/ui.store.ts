"use client";

import { create } from "zustand";

/**
 * UI ephemeral state – modal, drawer, search box...
 * KHÔNG persist; chỉ sống trong session.
 */
interface UiState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  setCartOpen: (v) => set({ isCartOpen: v }),
  setSearchOpen: (v) => set({ isSearchOpen: v }),
}));

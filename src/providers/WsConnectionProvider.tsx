"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  createFlashSaleStompClient,
  type FlashSaleStompClient,
} from "@/lib/stomp";
import { getAccessToken } from "@/lib/api";

/**
 * WsConnectionProvider – mount STOMP duy nhất cho toàn app.
 * Hiện chỉ cung cấp factory; hook useFlashSaleWs vẫn tự subscribe khi cần.
 * Ở bước sau có thể refactor để share 1 connection duy nhất nếu cần.
 */
const WsCtx = createContext<{
  ensureClient: () => FlashSaleStompClient;
} | null>(null);

export function WsConnectionProvider({ children }: { children: ReactNode }) {
  const [instance] = useState(() => {
    return () => createFlashSaleStompClient(getAccessToken());
  });
  const value = useMemo(() => ({ ensureClient: instance }), [instance]);
  return <WsCtx.Provider value={value}>{children}</WsCtx.Provider>;
}

export function useWs(): { ensureClient: () => FlashSaleStompClient } {
  const ctx = useContext(WsCtx);
  if (!ctx) {
    return {
      // Fallback: tạo client độc lập nếu chưa có provider (vd: testing).
      ensureClient: () => createFlashSaleStompClient(getAccessToken()),
    };
  }
  return ctx;
}

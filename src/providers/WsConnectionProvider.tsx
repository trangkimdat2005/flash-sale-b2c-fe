"use client";

import { type ReactNode } from "react";
import { useFlashSaleWs } from "@/hooks";

/**
 * Mount hook kết nối SockJS+STOMP và subscribe các topic công khai.
 * Hook này chỉ cần 1 instance ở root → đặt trong Providers.
 */
export function WsConnectionProvider({ children }: { children: ReactNode }) {
  useFlashSaleWs();
  return <>{children}</>;
}
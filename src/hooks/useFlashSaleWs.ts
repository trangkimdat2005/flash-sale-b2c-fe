"use client";

import { useEffect, useRef } from "react";
import {
  createFlashSaleStompClient,
  type FlashSaleStompClient,
} from "@/lib/stomp";
import { getAccessToken } from "@/lib/api";
import { useFlashSaleStore, type StockSnapshot } from "@/stores/flash-sale.store";

/**
 * useFlashSaleWs - mount STOMP client duy nhất qua WsConnectionProvider.
 *
 * Vi du:
 *   useFlashSaleWs(`/topic/flash-sale/${slotId}/stock`, (msg) => { ... });
 */
export function useFlashSaleWs(
  destination: string | null,
  onMessage: (snapshot: StockSnapshot) => void
): void {
  const setSnapshot = useFlashSaleStore((s) => s.setSnapshot);
  const cbRef = useRef(onMessage);
  useEffect(() => {
    cbRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!destination) return;
    const token = getAccessToken();
    const conn: FlashSaleStompClient = createFlashSaleStompClient(token);
    const off = conn.subscribe(destination, (msg) => {
      try {
        const body = JSON.parse(msg.body) as StockSnapshot;
        if (body && body.flashSaleItemId) {
          setSnapshot(body);
          cbRef.current(body);
        }
      } catch {
        // ignore malformed
      }
    });
    return () => {
      off();
      conn.disconnect();
    };
  }, [destination, setSnapshot]);
}
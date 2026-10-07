"use client";

import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { FlashSaleWsEvent } from "@/types";
import { WS_URL } from "@/lib/api/endpoints";
import { useAuthStore, useFlashSaleStore } from "@/stores";

interface UseFlashSaleWsOptions {
  /** Subscribe các topic cụ thể. Nếu bỏ trống → chỉ connect. */
  onStockUpdate?: (e: FlashSaleWsEvent) => void;
  onSlotStatus?: (e: FlashSaleWsEvent) => void;
  onPrivateMessage?: (e: FlashSaleWsEvent) => void;
}

/**
 * Hook kết nối SockJS + STOMP tới backend /ws.
 * - Public topic: /topic/flash-sale/item/{itemId}/stock
 * - Public topic: /topic/flash-sale/slot/{slotId}/status
 * - Private queue: /user/queue/flash-sale/orders/{orderCode}/updates
 * Tự động reconnect, gắn token qua query param (xem docs §25.1).
 */
export function useFlashSaleWs(options: UseFlashSaleWsOptions = {}) {
  const clientRef = useRef<Client | null>(null);
  const subsRef = useRef<Array<{ unsubscribe: () => void }>>([]);
  const { onStockUpdate, onSlotStatus, onPrivateMessage } = options;

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    const token = useAuthStore.getState().accessToken;
    const client = new Client({
      // SockJS chấp nhận http(s) URL, STOMP qua ws/wss dùng trực tiếp.
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      connectHeaders: token ? { token } : {},
      // Token cũng gửi qua query cho backend dễ verify (docs §25.1).
      beforeConnect: () => {
        client.connectHeaders = { ...(token && { token }) };
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    });
    client.onConnect = () => {
      const subs = subsRef.current;

      // Subscribe các topic generic bằng prefix /topic/flash-sale/item/*/stock
      subs.push(
        client.subscribe("/topic/flash-sale/item/+/stock", (msg) => {
          try {
            const body = JSON.parse(msg.body);
            const data = body?.data as FlashSaleWsEvent | undefined;
            if (!data) return;
            if (typeof data.flashSaleItemId === "number") {
              useFlashSaleStore
                .getState()
                .setStock(data.flashSaleItemId, data.availableStock ?? 0);
            }
            onStockUpdate?.(data);
          } catch (e) {
            console.error("[WS] parse stock", e);
          }
        })
      );

      subs.push(
        client.subscribe("/topic/flash-sale/slot/+/status", (msg) => {
          try {
            const body = JSON.parse(msg.body);
            const data = body?.data as FlashSaleWsEvent | undefined;
            if (!data || typeof data.slotId !== "number") return;
            if (data.slotStatus) {
              useFlashSaleStore
                .getState()
                .setSlotStatus(data.slotId, data.slotStatus);
            }
            onSlotStatus?.(data);
          } catch (e) {
            console.error("[WS] parse slot status", e);
          }
        })
      );

      // Subscribe private queue user-specific
      if (token) {
        subs.push(
          client.subscribe(
            "/user/queue/flash-sale/reservation-result",
            (msg) => {
              try {
                const body = JSON.parse(msg.body);
                onPrivateMessage?.(body?.data);
              } catch (e) {
                console.error("[WS] parse private", e);
              }
            }
          )
        );
      }
    };
    client.onStompError = (frame) => {
      console.error("[WS] STOMP error", frame.headers["message"]);
    };
    client.activate();
    clientRef.current = client;
  }, [onStockUpdate, onSlotStatus, onPrivateMessage]);

  useEffect(() => {
    connect();
    return () => {
      subsRef.current.forEach((s) => s.unsubscribe());
      subsRef.current = [];
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [connect]);

  /** Subscribe riêng cho 1 đơn cụ thể (vd: trang chi tiết order). */
  const subscribeOrderUpdates = useCallback(
    (orderCode: string, handler: (e: FlashSaleWsEvent) => void) => {
      const client = clientRef.current;
      if (!client?.connected) return () => {};
      const sub = client.subscribe(
        `/user/queue/flash-sale/orders/${orderCode}/updates`,
        (msg) => {
          try {
            const body = JSON.parse(msg.body);
            handler(body?.data);
          } catch (e) {
            console.error("[WS] parse order updates", e);
          }
        }
      );
      return () => sub.unsubscribe();
    },
    []
  );

  return { subscribeOrderUpdates };
}

/**
 * Hook đọc số lượng tồn kho realtime của 1 Flash Sale item.
 * Trả về giá trị mới nhất từ store nếu có, fallback initial.
 */
export function useFlashSaleStock(itemId: number, initial: number): number {
  const fromStore = useFlashSaleStore((s) => s.stockByItem[itemId]);
  return typeof fromStore === "number" ? fromStore : initial;
}
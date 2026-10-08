import { Client, type IMessage, type StompConfig } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_RECONNECT_DELAY_MS } from "@/lib/constants";

/**
 * STOMP client factory (rule websocket-realtime).
 * - Tự reconnect với backoff đơn giản.
 * - Truyền JWT qua query `?access_token=` cho Spring Security.
 * - KHÔNG xử lý nghiệp vụ ở đây; chỉ mount, subscribe/unsubscribe do hook làm.
 */
export interface FlashSaleStompClient {
  client: Client;
  subscribe: (destination: string, cb: (msg: IMessage) => void) => () => void;
  disconnect: () => void;
}

function getWsUrl(): string {
  const raw = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/ws";
  return raw.replace(/\/$/, "");
}

export function createFlashSaleStompClient(
  accessToken: string | null
): FlashSaleStompClient {
  const wsUrl = getWsUrl();

  // SockJS tương thích tốt với Spring Boot; nếu backend chỉ hỗ trợ ws thuần,
  // truyền brokerURL thay vì webSocketFactory.
  const config: StompConfig = {
    webSocketFactory: () => new SockJS(wsUrl) as unknown as WebSocket,
    reconnectDelay: WS_RECONNECT_DELAY_MS,
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
    connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    debug: () => {
      // Tắt log mặc định để khỏi spam console – rule §11.
    },
  };

  const client = new Client(config);
  client.activate();

  const subscribe = (destination: string, cb: (msg: IMessage) => void) => {
    let sub: ReturnType<Client["subscribe"]> | null = null;
    const trySubscribe = () => {
      if (!client.connected) return;
      sub = client.subscribe(destination, cb);
    };
    if (client.connected) trySubscribe();
    else client.onConnect = () => trySubscribe();
    return () => {
      try {
        sub?.unsubscribe();
      } catch {
        // ignore
      }
    };
  };

  const disconnect = () => {
    try {
      client.deactivate();
    } catch {
      // ignore
    }
  };

  return { client, subscribe, disconnect };
}

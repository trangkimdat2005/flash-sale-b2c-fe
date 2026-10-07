export interface ProductReviewResponse {
  id: number;
  userId: number;
  productId: number;
  orderItemId: number;
  rating: number;
  comment: string | null;
  imageUrls?: string[];
  sellerReply: string | null;
  sellerReplyAt: string | null;
  status: "VISIBLE" | "HIDDEN";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  orderItemId: number;
  rating: number;
  comment?: string;
  imageUrls?: string[];
}

/**
 * WebSocket event payload (xem docs/api-document.md §25.3).
 * Wrap bên trong ApiResponse<T> khi nhận từ server.
 */
export type FlashSaleWsEventType =
  | "STOCK_DECREMENTED"
  | "STOCK_RESTORED"
  | "STOCK_RETURNED_UNSOLD"
  | "SLOT_ACTIVATED"
  | "SLOT_CLOSED"
  | "ORDER_RESERVED"
  | "ORDER_CANCELLED_TIMEOUT";

export interface FlashSaleWsEvent {
  eventType: FlashSaleWsEventType;
  slotId?: number;
  flashSaleItemId?: number;
  orderId?: number;
  userId?: number;
  availableStock?: number;
  allocatedStock?: number;
  totalAmount?: number;
  quantity?: number;
  orderCode?: string;
  expiresAt?: string;
  slotStatus?: SlotStatus;
  restoredQuantity?: number;
  occurredAt: string;
}

import type { SlotStatus } from "./flash-sale";
import type { PaymentResponse } from "./payment";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED_TIMEOUT"
  | "CANCELLED_USER";

export interface OrderItemResponse {
  id: number;
  variantId: number;
  flashSaleItemId: number | null;
  productName: string;
  variantName: string;
  priceAtPurchase: string;
  quantity: number;
  itemSubtotal: string;
}

export interface OrderResponse {
  id: number;
  orderCode: string;
  buyerId: number;
  storeId: number;
  storeName: string;
  slotId: number | null;
  voucherId: number | null;
  recipientName: string;
  recipientPhone: string;
  shippingAddressText: string;
  subtotalAmount: string;
  voucherDiscountAmount: string;
  totalAmount: string;
  commissionRate: number;
  platformFee: string;
  sellerAmount: string;
  status: OrderStatus;
  /** ISO datetime — deadline phải thanh toán (auto-cancel timeout). */
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  /** Payment record mới nhất (nếu có). */
  payment?: PaymentResponse | null;
}

export interface CheckoutItemRequest {
  variantId: number;
  quantity: number;
}

export interface CheckoutStoreOrderRequest {
  storeId: number;
  items: CheckoutItemRequest[];
  voucherCode?: string;
  note?: string;
}

export interface CreateOrderRequest {
  shippingAddressId: number;
  paymentMethod: "ZALOPAY" | "COD";
  storeOrders: CheckoutStoreOrderRequest[];
}
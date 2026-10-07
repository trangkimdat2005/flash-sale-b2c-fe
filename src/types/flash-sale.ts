export type SlotStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export interface PublicFlashSaleSlotResponse {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  reservationTtlSeconds: number;
  status: SlotStatus;
  items: PublicFlashSaleItemResponse[];
}

export interface PublicFlashSaleItemResponse {
  id: number;
  slotId: number;
  variantId: number;
  sku: string;
  variantName: string;
  productName: string;
  imageUrl: string | null;
  originalPrice: string;
  flashSalePrice: string;
  allocatedStock: number;
  availableStock: number;
  userPurchaseLimit: number;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ENDED";
}

export interface CreateReservationRequest {
  flashSaleItemId: number;
  addressId: number;
  quantity: number;
}

export interface ReservationResponse {
  orderId: number;
  orderCode: string;
  flashSaleItemId: number;
  quantity: number;
  totalAmount: string;
  status: string;
  expiresAt: string;
  message: string;
}
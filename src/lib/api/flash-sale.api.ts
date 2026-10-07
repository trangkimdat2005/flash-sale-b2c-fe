import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  CreateReservationRequest,
  PublicFlashSaleSlotResponse,
  ReservationResponse,
} from "@/types";
import { v4 as uuid } from "uuid";

export const flashSaleApi = {
  listSlots: () =>
    apiFetch<PublicFlashSaleSlotResponse[]>(ENDPOINTS.flashSales.publicSlots, {
      skipAuth: true,
    }),
  getSlot: (slotId: string | number) =>
    apiFetch<PublicFlashSaleSlotResponse>(
      `${ENDPOINTS.flashSales.publicSlots}/${slotId}`,
      { skipAuth: true }
    ),
  /**
   * Đặt chỗ Flash Sale. Gửi Idempotency-Key theo khuyến nghị backend
   * (xem docs §14.1 - yêu cầu retry an toàn).
   */
  reserve: (body: CreateReservationRequest) =>
    apiFetch<ReservationResponse>(ENDPOINTS.flashSales.reservations, {
      method: "POST",
      body,
      idempotencyKey: uuid(),
      retries: 2,
    }),
};
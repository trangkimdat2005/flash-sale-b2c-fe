import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type { CreateOrderRequest, OrderResponse } from "@/types";
import type { PageResponse } from "@/types";

export interface OrderListParams {
  page?: number;
  size?: number;
  status?: string;
}

export const orderApi = {
  /** Checkout sẽ tách đơn đa gian hàng → trả mảng các OrderResponse. */
  checkout: (body: CreateOrderRequest) =>
    apiFetch<OrderResponse[]>(ENDPOINTS.orders.checkout, {
      method: "POST",
      body,
    }),
  list: (params: OrderListParams = {}) => {
    const qs = new URLSearchParams();
    if (params.page != null) qs.set("page", String(params.page));
    if (params.size != null) qs.set("size", String(params.size));
    if (params.status) qs.set("status", params.status);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch<PageResponse<OrderResponse>>(
      `${ENDPOINTS.orders.list}${suffix}`
    );
  },
  myList: (params: OrderListParams = {}) => {
    const qs = new URLSearchParams();
    if (params.page != null) qs.set("page", String(params.page));
    if (params.size != null) qs.set("size", String(params.size));
    if (params.status) qs.set("status", params.status);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch<PageResponse<OrderResponse>>(
      `${ENDPOINTS.orders.myList}${suffix}`
    );
  },
  byId: (id: number) => apiFetch<OrderResponse>(ENDPOINTS.orders.byId(id)),
  byCode: (code: string) => apiFetch<OrderResponse>(ENDPOINTS.orders.byCode(code)),
  cancel: (id: number) =>
    apiFetch<string>(ENDPOINTS.orders.cancel(id), { method: "PATCH" }),
  cancelByCode: (code: string) =>
    apiFetch<string>(ENDPOINTS.orders.cancelByCode(code), { method: "PATCH" }),
};
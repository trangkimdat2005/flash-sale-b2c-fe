import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  AddToCartRequest,
  CartResponse,
  UpdateCartItemRequest,
} from "@/types";

export const cartApi = {
  get: () => apiFetch<CartResponse>(ENDPOINTS.cart.me),
  addItem: (body: AddToCartRequest) =>
    apiFetch<CartResponse>(ENDPOINTS.cart.items, {
      method: "POST",
      body,
    }),
  updateItem: (itemId: number, body: UpdateCartItemRequest) =>
    apiFetch<CartResponse>(ENDPOINTS.cart.itemById(itemId), {
      method: "PUT",
      body,
    }),
  deleteItem: (itemId: number) =>
    apiFetch<CartResponse>(ENDPOINTS.cart.itemById(itemId), {
      method: "DELETE",
    }),
  clear: () => apiFetch<string>(ENDPOINTS.cart.clear, { method: "DELETE" }),
};
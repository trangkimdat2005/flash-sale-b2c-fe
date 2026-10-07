/**
 * Tập trung tất cả API endpoints (theo docs/api-document.md).
 * Tiền tố `/api/v1`.
 */

export const ENDPOINTS = {
  // ============ AUTH ============
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refreshToken: "/auth/refresh-token",
    logout: "/auth/logout",
  },
  // ============ USERS ============
  users: {
    me: "/users/me",
    changePassword: "/users/me/change-password",
    addresses: "/users/addresses",
    addressById: (id: number) => `/users/addresses/${id}`,
    setDefaultAddress: (id: number) => `/users/addresses/${id}/default`,
  },
  // ============ CATEGORIES ============
  categories: {
    list: "/categories",
    byId: (id: number) => `/categories/${id}`,
    bySlug: (slug: string) => `/categories/slug/${slug}`,
  },
  // ============ STORES (public) ============
  stores: {
    byId: (id: number) => `/stores/${id}`,
    me: "/stores/me",
    updateMe: "/stores/me",
    myAddresses: "/stores/me/addresses",
  },
  // ============ PRODUCTS (public) ============
  products: {
    list: "/products",
    byId: (id: number) => `/products/${id}`,
  },
  // ============ FLASH SALE ============
  flashSales: {
    publicSlots: "/flash-sales/slots",
    reservations: "/flash-sales/reservations",
  },
  // ============ CART ============
  cart: {
    me: "/cart",
    clear: "/cart",
    items: "/cart/items",
    itemById: (id: number) => `/cart/items/${id}`,
  },
  // ============ ORDERS ============
  orders: {
    checkout: "/orders/checkout",
    list: "/orders",
    myList: "/orders/me",
    byId: (id: number) => `/orders/${id}`,
    byCode: (code: string) => `/orders/code/${code}`,
    cancel: (id: number) => `/orders/${id}/cancel`,
    cancelByCode: (code: string) => `/orders/code/${code}/cancel`,
  },
  // ============ VOUCHERS ============
  vouchers: {
    platform: "/vouchers/platform",
    byStore: (storeId: number) => `/vouchers/store/${storeId}`,
    apply: "/vouchers/apply",
  },
} as const;

/** WebSocket endpoint (xem docs/api-document.md §25.1). */
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/ws";

/** Base URL của backend REST API. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";
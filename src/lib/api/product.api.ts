import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  CategoryResponse,
  ProductDetailResponse,
  ProductFilterRequest,
  ProductSummaryResponse,
  StoreResponse,
} from "@/types";
import type { PageResponse } from "@/types";

export const categoryApi = {
  list: () => apiFetch<CategoryResponse[]>(ENDPOINTS.categories.list, { skipAuth: true }),
  byId: (id: number) =>
    apiFetch<CategoryResponse>(ENDPOINTS.categories.byId(id), { skipAuth: true }),
  bySlug: (slug: string) =>
    apiFetch<CategoryResponse>(ENDPOINTS.categories.bySlug(slug), {
      skipAuth: true,
    }),
};

export const productApi = {
  list: (filter: ProductFilterRequest = {}) =>
    apiFetch<PageResponse<ProductSummaryResponse>>(
      ENDPOINTS.products.list + toQuery(filter),
      { skipAuth: true }
    ),
  byId: (id: number) =>
    apiFetch<ProductDetailResponse>(ENDPOINTS.products.byId(id), {
      skipAuth: true,
    }),
};

export const storeApi = {
  byId: (id: number) =>
    apiFetch<StoreResponse>(ENDPOINTS.stores.byId(id), { skipAuth: true }),
};

function toQuery(obj: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
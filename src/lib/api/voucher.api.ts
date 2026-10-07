import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  ApplyVoucherRequest,
  VoucherCalculationResponse,
  VoucherResponse,
} from "@/types";

export const voucherApi = {
  platform: () =>
    apiFetch<VoucherResponse[]>(ENDPOINTS.vouchers.platform, { skipAuth: true }),
  byStore: (storeId: number) =>
    apiFetch<VoucherResponse[]>(ENDPOINTS.vouchers.byStore(storeId), {
      skipAuth: true,
    }),
  apply: (body: ApplyVoucherRequest) =>
    apiFetch<VoucherCalculationResponse>(ENDPOINTS.vouchers.apply, {
      method: "POST",
      body,
    }),
};
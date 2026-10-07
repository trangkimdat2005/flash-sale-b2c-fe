export type DiscountType = "PERCENT" | "FIXED_AMOUNT";

export interface VoucherResponse {
  id: number;
  code: string;
  storeId: number | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: string;
  maxDiscountAmount: string | null;
  totalQuantity: number;
  usedQuantity: number;
  userUsageLimit: number;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "EXPIRED" | "EXHAUSTED" | "DISABLED";
  createdAt: string;
}

export interface VoucherCalculationResponse {
  voucherId: number;
  code: string;
  discountAmount: string;
  finalAmount: string;
}

export interface ApplyVoucherRequest {
  code: string;
  storeId?: number;
  subtotalAmount: number;
}
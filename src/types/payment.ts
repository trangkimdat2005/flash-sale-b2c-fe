export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED";

export type PaymentMethod = "ZALOPAY" | "COD";

export interface PaymentResponse {
  id: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  transactionCode: string;
  gatewayTransId: string | null;
  amount: string;
  qrCodeData: string | null;
  paymentUrl: string | null;
  status: PaymentStatus;
  paidAt: string | null;
  refundedAt: string | null;
  refundReason: string | null;
  createdAt: string;
}
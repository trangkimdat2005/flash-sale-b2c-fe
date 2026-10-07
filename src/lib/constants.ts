/**
 * Hằng số dùng chung.
 * @see docs/api-document.md §26 (Bảng mã lỗi tổng hợp).
 */

export const ROLE = {
  BUYER: "BUYER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED_TIMEOUT: "Đã hết hạn",
  CANCELLED_USER: "Đã hủy",
};

export const SLOT_STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Sắp diễn ra",
  ACTIVE: "Đang diễn ra",
  ENDED: "Đã kết thúc",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Đang xử lý",
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  EXPIRED: "Hết hạn",
  REFUNDED: "Đã hoàn tiền",
};

export const DEFAULT_RESERVATION_TTL_SECONDS = 300;

export const VIETNAM_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Khánh Hòa",
] as const;
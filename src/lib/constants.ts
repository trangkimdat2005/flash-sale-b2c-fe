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
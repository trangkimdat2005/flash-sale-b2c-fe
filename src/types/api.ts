/**
 * Cấu trúc response chuẩn của Backend Flash Sale B2C UTC2.
 * Mọi API (kể cả lỗi) đều bọc trong ApiResponse<T>.
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
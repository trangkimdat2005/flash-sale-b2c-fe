import { z } from "zod";

/**
 * Zod schemas dùng chung (rule validation-forms).
 * Message tiếng Việt – ưu tiên dịch qua i18n sau, bước này hard-code để dùng được.
 */

export const emailSchema = z
  .string()
  .min(1, "Vui lòng nhập email")
  .email("Email không hợp lệ");

export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(64, "Mật khẩu tối đa 64 ký tự");

export const phoneVnSchema = z
  .string()
  .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ");

export const nonEmptyString = (label: string) =>
  z.string().min(1, `Vui lòng nhập ${label}`);

import { z } from 'zod';
import { passwordSchema } from '@/lib/validators/common';

/**
 * emailSchema – email format theo zod.
 * Backend contract (swagger 2026-10-10): LoginRequest chỉ nhận 1 field
 * `usernameOrEmail` (string, max 100). Backend chấp nhận cả email
 * lẫn phone/username trong cùng 1 field này.
 *
 * Client-side chỉ validate email format (đơn giản nhất cho MVP).
 * Nếu cần phone/username support, đổi thành regex phoneVnSchema.
 */
export const emailSchema = z
  .string()
  .min(1, 'Vui lòng nhập email hoặc số điện thoại')
  .max(100, 'Email quá dài (tối đa 100 ký tự)')
  .email('Email không hợp lệ');

export { passwordSchema };

/**
 * loginSchema – dùng trong LoginForm.
 * Field `email` (zod email format) + `password`.
 * Gửi sang backend dưới key `usernameOrEmail` (xem api.ts).
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

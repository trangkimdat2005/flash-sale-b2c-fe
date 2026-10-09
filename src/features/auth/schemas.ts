import { z } from 'zod';
import { passwordSchema } from '@/lib/validators/common';

/**
 * identifierSchema – nhận email hoặc số điện thoại Việt Nam.
 * - Email: format chuẩn (zod .email)
 * - SĐT VN: 0[3-9]xxxxxxxx hoặc +84[3-9]xxxxxxxx (10 số sau prefix)
 * - Ưu tiên email: nếu có '@' thì validate email; nếu không thì validate phone
 *
 * Quyết định plan 2026-10-09 (đã duyệt): chấp nhận cả 2, dùng regex phoneVnSchema.
 */
const isPhoneVn = (v: string): boolean => /^(0|\+84)[3-9]\d{8}$/.test(v);

export const identifierSchema = z
  .string()
  .min(1, 'Vui lòng nhập email hoặc số điện thoại')
  .superRefine((value, ctx) => {
    if (value.includes('@')) {
      // email path
      const emailOk = z.string().email().safeParse(value).success;
      if (!emailOk) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email không hợp lệ',
        });
      }
    } else if (!isPhoneVn(value)) {
      // phone path
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)',
      });
    }
  });

export { passwordSchema };

/**
 * loginSchema – dùng trong LoginForm (SP4).
 * Field `identifier` (email|phone) + `password`.
 * Map sang API payload { email?, phoneNumber?, password } ở api.ts.
 */
export const loginSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").trim(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ").trim(),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100).trim(),
    phone: z
      .string()
      .regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
    role: z.enum(["BUYER", "SELLER"]).optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
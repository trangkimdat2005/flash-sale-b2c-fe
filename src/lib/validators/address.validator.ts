import { z } from "zod";

export const addressSchema = z.object({
  contactName: z.string().min(2, "Tên người nhận tối thiểu 2 ký tự").max(100),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  province: z.string().min(1, "Chọn tỉnh/thành phố"),
  district: z.string().min(1, "Nhập quận/huyện"),
  ward: z.string().min(1, "Nhập phường/xã"),
  detailAddress: z.string().min(1, "Nhập địa chỉ chi tiết").max(255),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressSchema>;
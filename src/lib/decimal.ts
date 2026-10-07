import Decimal from "decimal.js";

/**
 * Helper chuyển đổi tiền tệ an toàn (tránh sai số float).
 * Backend trả về BigDecimal được serialize thành string.
 */
export const money = (value: string | number | Decimal): Decimal =>
  new Decimal(value ?? 0);

export const formatVND = (
  value: string | number | Decimal,
  withSymbol = true
): string => {
  const d = money(value);
  const formatted = d.toNumber().toLocaleString("vi-VN");
  return withSymbol ? `${formatted} ₫` : formatted;
};

export const calcPercent = (
  total: string | number | Decimal,
  percent: number
): Decimal => money(total).mul(percent);

export const calcDiscount = (
  total: string | number | Decimal,
  discountValue: number,
  discountType: "PERCENT" | "FIXED_AMOUNT",
  maxDiscountAmount?: string | number | null
): Decimal => {
  const t = money(total);
  let discount = money(0);
  if (discountType === "PERCENT") {
    discount = t.mul(discountValue).div(100);
    if (maxDiscountAmount != null) {
      discount = Decimal.min(discount, money(maxDiscountAmount));
    }
  } else {
    discount = Decimal.min(money(discountValue), t);
  }
  return discount;
};
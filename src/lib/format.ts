import Decimal from "decimal.js";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format helpers – rule §6.
 * Tiền: BigDecimal (rule: KHÔNG float) → "1.290.000₫"
 * Số lớn: "1,2k", "12,3k", "1,28 tỷ₫"
 * Ngày giờ: vi-VN locale.
 */

const VND_SUFFIX = "₫";

/** Trả về Decimal từ string | number | Decimal (server trả về BigDecimal → string). */
export function toDecimal(value: string | number | Decimal): Decimal {
  return value instanceof Decimal ? value : new Decimal(value ?? 0);
}

/** Format VND: 1.290.000₫ */
export function formatVND(value: string | number | Decimal): string {
  const n = toDecimal(value);
  const grouped = n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped}${VND_SUFFIX}`;
}

/** Rút gọn số lớn cho dashboard / card. Locale vi: "1,2k", "12,3k", "1,28 tỷ₫" */
export function formatShortNumber(value: string | number | Decimal): string {
  const n = Number(toDecimal(value).toString());
  const fmt = (s: string) => s.replace(".", ",");
  if (n < 1_000) return n.toString();
  if (n < 1_000_000) return `${fmt((n / 1_000).toFixed(1).replace(/\.0$/, ""))}k`;
  if (n < 1_000_000_000) return `${fmt((n / 1_000_000).toFixed(1).replace(/\.0$/, ""))}k`;
  return `${fmt((n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, ""))} tỷ${VND_SUFFIX}`;
}

/** "14:00 – 01/10/2026" */
export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return `${format(d, "HH:mm", { locale: vi })} – ${format(d, "dd/MM/yyyy", { locale: vi })}`;
}

/** "5 phút trước" */
export function formatRelative(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return formatDistanceToNow(d, { addSuffix: true, locale: vi });
}

/** "01/10/2026" */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  return format(d, "dd/MM/yyyy", { locale: vi });
}

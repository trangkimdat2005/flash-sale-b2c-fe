"use client";

import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_BADGE,
  SLOT_STATUS_LABELS,
  SLOT_STATUS_BADGE,
  FLASH_SALE_ITEM_STATUS_LABELS,
  FLASH_SALE_ITEM_STATUS_BADGE,
  STORE_STATUS_LABELS,
  STORE_STATUS_BADGE,
  USER_STATUS_LABELS,
  USER_STATUS_BADGE,
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_BADGE,
  VOUCHER_STATUS_LABELS,
  VOUCHER_STATUS_BADGE,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_BADGE,
} from "@/lib/constants";

/**
 * StatusBadge – rule §5: tự tra nhãn + màu từ `lib/constants`.
 * - type: bảng enum (order, payment, slot, store, user, product, voucher, review, flashSaleItem).
 * - status: enum string từ backend.
 */

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "sale";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  neutral: "bg-page text-ink-2",
  sale: "bg-sale-soft text-sale",
};

export type StatusType =
  | "order"
  | "payment"
  | "slot"
  | "flashSaleItem"
  | "store"
  | "user"
  | "product"
  | "voucher"
  | "review";

export interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

interface Table {
  labels: Record<string, string>;
  tones: Record<string, BadgeTone | string>;
}

const TABLES: Record<StatusType, Table> = {
  order: { labels: ORDER_STATUS_LABELS, tones: ORDER_STATUS_BADGE },
  payment: { labels: PAYMENT_STATUS_LABELS, tones: PAYMENT_STATUS_BADGE },
  slot: { labels: SLOT_STATUS_LABELS, tones: SLOT_STATUS_BADGE },
  flashSaleItem: {
    labels: FLASH_SALE_ITEM_STATUS_LABELS,
    tones: FLASH_SALE_ITEM_STATUS_BADGE,
  },
  store: { labels: STORE_STATUS_LABELS, tones: STORE_STATUS_BADGE },
  user: { labels: USER_STATUS_LABELS, tones: USER_STATUS_BADGE },
  product: { labels: PRODUCT_STATUS_LABELS, tones: PRODUCT_STATUS_BADGE },
  voucher: { labels: VOUCHER_STATUS_LABELS, tones: VOUCHER_STATUS_BADGE },
  review: { labels: REVIEW_STATUS_LABELS, tones: REVIEW_STATUS_BADGE },
};

const FALLBACK_LABEL = "Không xác định";

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const table = TABLES[type];
  const label = table.labels[status] ?? status ?? FALLBACK_LABEL;
  const tone = (table.tones[status] ?? "neutral") as BadgeTone;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {label}
    </span>
  );
}

import { clsx, type ClassValue } from "clsx";

/** Kết hợp className có điều kiện — thay thế nhẹ cho `clsx`. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format ISO date sang locale vi-VN ngắn gọn. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Tính khoảng cách giữa 2 mốc thời gian (ms). */
export function diffMs(from: Date | string, to: Date | string): number {
  const a = typeof from === "string" ? new Date(from) : from;
  const b = typeof to === "string" ? new Date(to) : to;
  return b.getTime() - a.getTime();
}

/** Format mm:ss từ ms (>0). */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
  const s = (totalSec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
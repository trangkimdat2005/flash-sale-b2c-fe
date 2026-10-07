"use client";

import { cn } from "@/lib/utils";

interface StockProgressBarProps {
  available: number;
  allocated: number;
  className?: string;
}

/**
 * Thanh tiến trình tồn kho realtime Flash Sale.
 * Số càng thấp → màu đỏ càng đậm (FOMO).
 */
export function StockProgressBar({ available, allocated, className }: StockProgressBarProps) {
  const total = Math.max(1, allocated);
  const percent = Math.max(0, Math.min(100, (available / total) * 100));
  const soldPercent = 100 - percent;

  const barColor =
    percent <= 10
      ? "bg-rose-600"
      : percent <= 30
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-zinc-700 dark:text-zinc-300">
          Đã bán <span className="font-bold">{Math.round(soldPercent)}%</span>
        </span>
        <span className={cn(
          "font-bold",
          percent <= 10 ? "text-rose-600" : "text-zinc-700 dark:text-zinc-300"
        )}>
          Còn {available}/{allocated}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={cn("h-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
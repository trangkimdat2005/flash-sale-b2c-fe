import { cn } from "@/lib/utils";
import { formatVND, toDecimal } from "@/lib/format";

/**
 * PriceText – rule §3, §6:
 * - Giá: 600 + tabular-nums.
 * - Có thể hiện giá gốc gạch ngang + badge %.
 * - Không tự tính % từ client nếu backend đã trả.
 */
export interface PriceTextProps {
  price: string | number;
  originalPrice?: string | number;
  /** % giảm (vd: 25 = -25%); nếu không truyền sẽ tự tính khi có originalPrice. */
  percent?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
} as const;

export function PriceText({
  price,
  originalPrice,
  percent,
  size = "md",
  className,
}: PriceTextProps) {
  const finalText = formatVND(price);

  let pct: number | undefined = percent;
  if (pct === undefined && originalPrice !== undefined) {
    const p = toDecimal(price);
    const o = toDecimal(originalPrice);
    if (o.gt(0) && p.lt(o)) {
      pct = o.minus(p).div(o).mul(100).toDP(0).toNumber();
    }
  }

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-semibold tabular-nums text-sale",
          sizeClasses[size]
        )}
      >
        {finalText}
      </span>
      {originalPrice !== undefined && (
        <span className="text-xs tabular-nums text-ink-3 line-through">
          {formatVND(originalPrice)}
        </span>
      )}
      {pct !== undefined && pct > 0 && (
        <span className="rounded-md bg-sale-soft px-1.5 py-0.5 text-[10px] font-semibold text-sale">
          -{pct}%
        </span>
      )}
    </div>
  );
}

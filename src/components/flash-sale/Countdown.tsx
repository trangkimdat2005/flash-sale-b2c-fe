"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CountdownProps {
  target: string;
  onExpire?: () => void;
  className?: string;
  /** Format label "Sắp mở" / "Đang diễn ra" / "Còn" */
  label?: string;
}

/**
 * Hiển thị đếm ngược HH:MM:SS (hoặc MM:SS nếu dưới 1 giờ).
 * Tự động gọi `onExpire` khi hết thời gian.
 */
export function Countdown({ target, onExpire, className, label }: CountdownProps) {
  const t = useTranslations("flash-sale.countdown");
  const resolvedLabel = label ?? t("defaultLabel");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const msLeft = new Date(target).getTime() - now;
  const isExpired = msLeft <= 0;

  useEffect(() => {
    if (isExpired) onExpire?.();
  }, [isExpired, onExpire]);

  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const formatted = h > 0
    ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {resolvedLabel}
      </span>
      <span className="font-mono text-2xl font-bold tabular-nums text-red-600">
        {formatted}
      </span>
    </div>
  );
}
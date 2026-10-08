"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Countdown - rule §5, §8 muc 1:
 * - Tinh theo gio server (nhan `endsAt` ISO tu backend).
 * - Lay `serverNow` tu prop; mac dinh dung Date.now() neu khong truyen.
 * - Tu re-render moi giay; cleanup khi unmount.
 */
export interface CountdownLabels {
  day: string;
  hour: string;
  minute: string;
  second: string;
  finished: string;
}

const DEFAULT_LABELS: CountdownLabels = {
  day: "ngày",
  hour: "giờ",
  minute: "phút",
  second: "giây",
  finished: "Đã kết thúc",
};

export interface CountdownProps {
  endsAt: string;
  /** ISO tu server; neu bo trong dung gio client (chi phu hop preview). */
  serverNow?: string;
  className?: string;
  /** "long" = HH:MM:SS ; "short" = MM:SS ; "compact" = chi 1 dong "01:23:45" */
  variant?: "long" | "short" | "compact";
  onFinish?: () => void;
  labels?: Partial<CountdownLabels>;
}

function diffParts(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 36000) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, finished: clamped === 0 };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function Countdown({
  endsAt,
  serverNow,
  className,
  variant = "long",
  onFinish,
  labels,
}: CountdownProps) {
  const [now, setNow] = useState<number>(() =>
    serverNow ? new Date(serverNow).getTime() : Date.now()
  );

  // Neu serverNow doi (vd: remount voi thoi diem moi), reset base time.
  const [lastServerNow, setLastServerNow] = useState<string | undefined>(serverNow);
  if (serverNow !== lastServerNow) {
    setLastServerNow(serverNow);
    if (serverNow) setNow(new Date(serverNow).getTime());
  }

  useEffect(() => {
    const id = setInterval(() => {
      setNow((prev) => (serverNow ? prev + 1000 : Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [serverNow]);

  const { days, hours, minutes, seconds, finished } = diffParts(
    new Date(endsAt).getTime() - now
  );

  useEffect(() => {
    if (finished) onFinish?.();
  }, [finished, onFinish]);

  const L: CountdownLabels = { ...DEFAULT_LABELS, ...labels };

  if (variant === "compact") {
    return (
      <span
        className={cn("font-semibold tabular-nums text-sale", className)}
        suppressHydrationWarning
      >
        {finished
          ? L.finished
          : `${pad(days * 24 + hours)}:${pad(minutes)}:${pad(seconds)}`}
      </span>
    );
  }

  if (variant === "short") {
    return (
      <span
        className={cn("font-mono tabular-nums text-ink", className)}
        suppressHydrationWarning
      >
        {pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  return (
    <div
      className={cn("flex items-center gap-1 font-mono tabular-nums", className)}
      suppressHydrationWarning
    >
      <TimeBlock value={days} label={L.day} hidden={days === 0} />
      <Sep />
      <TimeBlock value={hours} label={L.hour} />
      <Sep />
      <TimeBlock value={minutes} label={L.minute} />
      <Sep />
      <TimeBlock value={seconds} label={L.second} />
    </div>
  );
}

function TimeBlock({ value, label, hidden }: { value: number; label: string; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <span className="inline-flex flex-col items-center">
      <span className="rounded-md bg-card px-2 py-1 text-sm font-semibold text-ink ring-1 ring-line">
        {pad(value)}
      </span>
      <span className="mt-0.5 text-[10px] text-ink-3">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-ink-3">:</span>;
}
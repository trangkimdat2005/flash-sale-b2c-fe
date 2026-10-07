"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils";

/**
 * Hook đếm ngược đến 1 mốc thời gian (ISO string). Tính bằng setInterval 1s.
 * Trả về { msLeft, formatted } — formatted ở dạng "MM:SS" hoặc "HH:MM:SS".
 */
export function useCountdown(target: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!target) return { msLeft: 0, formatted: "00:00", isExpired: true };
  const msLeft = new Date(target).getTime() - now;
  const isExpired = msLeft <= 0;
  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const formatted =
    h > 0
      ? `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : formatCountdown(msLeft);
  return { msLeft: Math.max(0, msLeft), formatted, isExpired };
}
"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * MinWidthGuard – rule §10: Seller/Admin chỉ desktop ≥1280px.
 * Dưới ngưỡng hiện thông báo thay vì cố render.
 */
export interface MinWidthGuardProps {
  minWidth: number;
  fallbackMessage: string;
  children: ReactNode;
}

export function MinWidthGuard({ minWidth, fallbackMessage, children }: MinWidthGuardProps) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setOk(window.innerWidth >= minWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [minWidth]);

  if (ok === null) return null;
  if (!ok) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div className="max-w-sm rounded-xl border border-line bg-card p-6">
          <h2 className="text-base font-semibold text-ink">Màn hình quá nhỏ</h2>
          <p className="mt-2 text-sm text-ink-2">{fallbackMessage}</p>
          <p className="mt-3 text-xs text-ink-3">
            Yêu cầu tối thiểu {minWidth}px chiều ngang.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

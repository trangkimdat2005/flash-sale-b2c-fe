"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * StorefrontShell – chỗ để thêm effect (vd: cuộn về đầu khi đổi route).
 * Bước sau có thể thêm: chặn route khi giỏ hàng có sản phẩm hết hạn Flash Sale, ...
 */
export function StorefrontShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {children}
    </div>
  );
}

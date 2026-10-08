"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PortalTopbarProps {
  /** Tên portal hiển thị bên trái (VD: "Seller Center"). */
  title: string;
  userName?: string;
}

/**
 * PortalTopbar – topbar chung cho Seller/Admin (rule §5).
 */
export function PortalTopbar({ title, userName = "Người dùng" }: PortalTopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-card px-4">
      <h1 className="text-sm font-semibold text-ink">{title}</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Thông báo">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-1 text-ink-2">
          {userName}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

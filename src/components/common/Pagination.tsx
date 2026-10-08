"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  page: number; // 1-based
  totalPages: number;
  onChange: (page: number) => void;
  variant?: "full" | "compact" | "table" | "mobile";
  totalItems?: number; // cho "table": "Hiển thị 1–20 trong 248"
  pageSize?: number;
  className?: string;
}

export function Pagination(props: PaginationProps) {
  const { variant = "full" } = props;
  if (variant === "compact") return <Compact {...props} />;
  if (variant === "table") return <Table {...props} />;
  if (variant === "mobile") return <Mobile {...props} />;
  return <Full {...props} />;
}

function Full({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = buildPageList(page, totalPages);
  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-ink-3">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "primary" : "ghost"}
            size="sm"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Button>
        )
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

function Compact({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className={cn("flex items-center gap-1 text-sm text-ink-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="tabular-nums">
        {page}/{totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Table({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
  className,
}: PaginationProps) {
  if (!totalItems || !pageSize) return <Full {...{ page, totalPages, onChange, className }} />;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-2 sm:flex-row",
        className
      )}
    >
      <p className="text-xs text-ink-2">
        Hiển thị <span className="tabular-nums">{from}</span>–
        <span className="tabular-nums">{to}</span> trong{" "}
        <span className="tabular-nums">{totalItems}</span>
      </p>
      <Full page={page} totalPages={totalPages} onChange={onChange} />
    </div>
  );
}

function Mobile({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Trước
      </Button>
      <span className="text-sm text-ink-2 tabular-nums">
        {page} / {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Sau
      </Button>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const list: (number | "…")[] = [1];
  if (current > 4) list.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) list.push(i);
  if (current < total - 3) list.push("…");
  list.push(total);
  return list;
}

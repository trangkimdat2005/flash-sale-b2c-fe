"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Bảng dữ liệu (rule §4 mục 5): hàng cao 56px, viền ngang mảnh, không sọc ngựa vằn.
 * Đặt width 100% và cuộn ngang nếu nhiều cột.
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-xl border border-line bg-card">
    <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";

export const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-page text-ink-2", className)} {...props} />
);
TableHeader.displayName = "TableHeader";

export const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-line", className)} {...props} />
);
TableBody.displayName = "TableBody";

export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn("h-14 transition-colors hover:bg-page/60", className)}
    {...props}
  />
);
TableRow.displayName = "TableRow";

export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn("h-10 px-4 text-left align-middle text-xs font-medium uppercase tracking-wide text-ink-2", className)}
    {...props}
  />
);
TableHead.displayName = "TableHead";

export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 align-middle", className)} {...props} />
);
TableCell.displayName = "TableCell";

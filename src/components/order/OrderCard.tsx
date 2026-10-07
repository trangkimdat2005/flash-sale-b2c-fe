"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";
import type { OrderResponse, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const badgeVariantMap: Record<
  OrderStatus,
  "default" | "info" | "success" | "warning" | "danger"
> = {
  PENDING_PAYMENT: "warning",
  PAID: "info",
  CONFIRMED: "info",
  SHIPPING: "info",
  COMPLETED: "success",
  CANCELLED_TIMEOUT: "danger",
  CANCELLED_USER: "danger",
};

interface OrderCardProps {
  order: OrderResponse;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold">{order.orderCode}</p>
          <p className="text-xs text-zinc-500">
            {order.storeName} · {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={badgeVariantMap[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
        <span className="text-zinc-500">
          {order.items.length} sản phẩm
        </span>
        <span className="font-bold text-red-600">
          {formatVND(order.totalAmount)}
        </span>
      </div>

      <div className="mt-2 flex gap-1 overflow-hidden">
        {order.items.slice(0, 4).map((it) => (
          <div
            key={it.id}
            className={cn(
              "h-12 w-20 shrink-0 rounded bg-zinc-100 dark:bg-zinc-800",
              "flex items-center justify-center text-[10px] text-zinc-400"
            )}
          >
            {it.productName}
          </div>
        ))}
      </div>
    </Link>
  );
}
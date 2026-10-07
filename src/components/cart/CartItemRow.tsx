"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api";
import { useUIStore } from "@/stores";
import { Button } from "@/components/ui";
import { formatVND } from "@/lib/decimal";
import type { CartItemResponse } from "@/types";

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItemRow({ item }: CartItemProps) {
  const queryClient = useQueryClient();
  const pushToast = useUIStore((s) => s.pushToast);

  const updateMutation = useMutation({
    mutationFn: (quantity: number) => cartApi.updateItem(item.id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e: Error) => pushToast({ type: "error", message: e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => cartApi.deleteItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      pushToast({ type: "success", message: "Đã xóa sản phẩm khỏi giỏ" });
    },
    onError: (e: Error) => pushToast({ type: "error", message: e.message }),
  });

  return (
    <div className="flex gap-3 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <Link href={`/products/${item.variantId}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.variantId}`}
            className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            {item.productName}
          </Link>
          <p className="text-xs text-zinc-500">{item.variantName}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-red-600">
            {formatVND(item.price)}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={item.quantity}
              disabled={updateMutation.isPending}
              onChange={(e) =>
                updateMutation.mutate(Number(e.target.value))
              }
              className="h-8 rounded border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Array.from(
                { length: Math.min(item.stockQuantity, 10) },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="ghost"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
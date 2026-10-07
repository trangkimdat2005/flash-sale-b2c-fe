"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api";
import { CartItemRow } from "./CartItemRow";
import { Button, Skeleton } from "@/components/ui";
import { formatVND } from "@/lib/decimal";

export function CartView() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:bg-rose-950 dark:text-rose-100">
        Không tải được giỏ hàng. Vui lòng thử lại.
      </div>
    );
  }

  if (!data || data.storeGroups.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline"
        >
          Tiếp tục mua sắm →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {data.storeGroups.map((group) => (
          <div
            key={group.storeId}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <Link
                href={`/stores/${group.storeId}`}
                className="font-medium hover:underline"
              >
                {group.storeName}
              </Link>
              <span className="text-sm text-zinc-500">
                {group.items.length} sản phẩm
              </span>
            </div>
            <div>
              {group.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-sm font-medium dark:border-zinc-800">
              <span>Tạm tính</span>
              <span className="font-semibold text-red-600">
                {formatVND(group.storeSubtotal)}
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending}
          className="text-sm text-zinc-500 hover:underline"
        >
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">Tổng giỏ hàng</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Số lượng</dt>
            <dd className="font-medium">{data.totalItems}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base dark:border-zinc-800">
            <dt className="font-medium">Tổng cộng</dt>
            <dd className="font-bold text-red-600">
              {formatVND(data.grandTotal)}
            </dd>
          </div>
        </dl>
        <Link href="/checkout" className="mt-4 block">
          <Button fullWidth size="lg" variant="primary">
            Tiến hành thanh toán
          </Button>
        </Link>
        <p className="mt-3 text-xs text-zinc-500">
          Đơn hàng sẽ được tách theo từng gian hàng khi thanh toán.
        </p>
      </aside>
    </div>
  );
}
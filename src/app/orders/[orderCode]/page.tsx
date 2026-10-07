"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { QrCard } from "@/components/flash-sale";
import { Countdown } from "@/components/flash-sale";
import { orderApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { useFlashSaleWs } from "@/hooks/useFlashSaleWs";
import { formatVND } from "@/lib/decimal";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/constants";
import { ApiError } from "@/lib/api/errors";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  // Next 16: params là Promise
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [resolvedCode, setResolvedCode] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedCode(p.orderCode));
  }, [params]);

  useEffect(() => {
    if (!accessToken) router.replace(`/login?next=/orders`);
  }, [accessToken, router]);

  const order = useQuery({
    queryKey: ["order", resolvedCode],
    queryFn: () => orderApi.byCode(resolvedCode!),
    enabled: !!resolvedCode && !!accessToken,
    refetchInterval: 10_000, // fallback nếu WS chưa kịp update
  });

  const cancel = useMutation({
    mutationFn: () => orderApi.cancelByCode(resolvedCode!),
    onSuccess: () => {
      toast.success("Đã hủy đơn");
      qc.invalidateQueries({ queryKey: ["order", resolvedCode] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Hủy thất bại");
    },
  });

  // Subscribe WS update cho order này
  const wsRef = useRef<ReturnType<typeof useFlashSaleWs> | null>(null);
  wsRef.current = useFlashSaleWs();
  useEffect(() => {
    if (!resolvedCode) return;
    const ws = wsRef.current;
    if (!ws) return;
    const unsub = ws.subscribeOrderUpdates(resolvedCode, () => {
      qc.invalidateQueries({ queryKey: ["order", resolvedCode] });
    });
    return () => unsub?.();
  }, [resolvedCode, qc]);

  if (!accessToken || !resolvedCode) return null;
  if (order.isLoading) {
    return (
      <main className="p-10 text-center text-sm">Đang tải đơn hàng...</main>
    );
  }
  if (!order.data) {
    return <main className="p-10 text-center text-sm">Không tìm thấy đơn hàng.</main>;
  }

  const o = order.data;
  const ttlTarget = o.expiresAt ?? null;

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Đơn #{o.orderCode}</h1>
          <Badge
            variant={
            o.status === "PAID" || o.status === "CONFIRMED" || o.status === "SHIPPING" || o.status === "COMPLETED"
              ? "success"
              : o.status === "CANCELLED_TIMEOUT" || o.status === "CANCELLED_USER"
                ? "default"
                : "warning"
          }
          >
            {ORDER_STATUS_LABEL[o.status] ?? o.status}
          </Badge>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm text-zinc-500">Cửa hàng</p>
            <p className="font-medium">{o.storeName}</p>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {o.items.map((it) => (
              <li key={it.id} className="flex justify-between py-2 text-sm">
                <span>
                  {it.productName} × {it.quantity}
                </span>
                <span>{formatVND(it.itemSubtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-3 font-bold">
            <span>Tổng</span>
            <span className="text-red-600">{formatVND(o.totalAmount)}</span>
          </div>
        </div>

        {o.status === "PENDING_PAYMENT" && o.payment?.qrCodeData && (
          <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:bg-amber-950">
            <div className="flex items-center justify-between">
              <Badge variant="warning">Chờ thanh toán</Badge>
              {ttlTarget && (
                <Countdown target={ttlTarget} label="Hết hạn sau" />
              )}
            </div>
            <h2 className="mt-3 text-lg font-semibold">
              Quét QR ZaloPay để hoàn tất
            </h2>
            <p className="text-xs text-zinc-500">
              Trạng thái: {PAYMENT_STATUS_LABEL[o.payment.status] ?? o.payment.status}
            </p>
            <div className="mt-3 flex justify-center">
              <QrCard order={o} payment={o.payment} />
            </div>
            <p className="mt-2 text-center text-sm font-semibold">
              Số tiền: {formatVND(o.payment.amount)}
            </p>
          </div>
        )}

        {(o.status === "PENDING_PAYMENT") && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => cancel.mutate()}
              loading={cancel.isPending}
            >
              Hủy đơn
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
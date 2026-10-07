"use client";

import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Button, Badge } from "@/components/ui";
import { Countdown } from "./Countdown";
import type { OrderResponse, PaymentResponse } from "@/types";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";

interface QrCardProps {
  order: OrderResponse;
  payment: PaymentResponse;
}

export function QrCard({ order, payment }: QrCardProps) {
  const t = useTranslations("flash-sale");
  const tPay = useTranslations("payment.status");
  // Backend trả về qr_code_data cho ZaloPay QR động.
  const qrValue =
    payment.qrCodeData ??
    payment.paymentUrl ??
    `zalopay://payment?orderCode=${order.orderCode}`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {t("qr.scanInstruction")}
          </p>
          <p className="mt-1 font-mono text-sm font-bold">
            {order.orderCode}
          </p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {formatVND(order.totalAmount)}
          </p>
        </div>

        <div className="rounded-lg border-4 border-red-600 bg-white">
          <QRCodeSVG
            value={qrValue}
            size={220}
            level="H"
            includeMargin={false}
          />
        </div>

        {payment.status === "PENDING" && order.expiresAt && (
          <Countdown
            target={order.expiresAt}
            label={t("countdown.paymentIn")}
            onExpire={() => {
              // Backend sẽ tự timeout. Trang sẽ tự reload khi WS báo event CANCELLED_TIMEOUT.
            }}
          />
        )}

        <Badge
          variant={
            payment.status === "SUCCESS"
              ? "success"
              : payment.status === "FAILED" || payment.status === "EXPIRED"
              ? "danger"
              : "info"
          }
        >
          {tPay(payment.status)}
        </Badge>

        <div className="w-full space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
          <Row label={t("qr.order")} value={order.orderCode} />
          <Row label={t("qr.method")} value={t("qr.methodZaloPay")} />
          <Row label={t("qr.amount")} value={formatVND(order.totalAmount)} />
          <Row label={t("qr.txCode")} value={payment.transactionCode} />
          <Row label={t("qr.createdAt")} value={formatDate(payment.createdAt)} />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          {t("qr.refresh")}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
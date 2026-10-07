"use client";

import { useState } from "react";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { StockProgressBar, Countdown, BuyModal } from "@/components/flash-sale";
import { useFlashSaleStock } from "@/hooks/useFlashSaleWs";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import type {
  PublicFlashSaleItemResponse,
  PublicFlashSaleSlotResponse,
} from "@/types";

type Props = {
  slot: PublicFlashSaleSlotResponse;
};

export function SlotDetailClient({ slot }: Props) {
  const [selected, setSelected] = useState<PublicFlashSaleItemResponse | null>(null);
  const toast = useToast();
  const isAuth = useAuthStore((s) => s.accessToken) != null;

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{slot.title}</h1>
            <p className="text-sm text-zinc-500">
              {formatDate(slot.startTime)} → {formatDate(slot.endTime)}
            </p>
          </div>
          <Countdown
            target={slot.status === "UPCOMING" ? slot.startTime : slot.endTime}
            className="text-lg"
            label={slot.status === "UPCOMING" ? "Bắt đầu sau" : "Kết thúc sau"}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slot.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onBuy={() => {
              if (!isAuth) {
                toast.warning("Vui lòng đăng nhập để mua");
                return;
              }
              setSelected(item);
            }}
          />
        ))}
      </div>

      {selected && (
        <BuyModal
          item={selected}
          open={!!selected}
          addresses={[]}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function ItemCard({
  item,
  onBuy,
}: {
  item: PublicFlashSaleItemResponse;
  onBuy: () => void;
}) {
  const stock = useFlashSaleStock(item.id, item.availableStock);
  const total = item.allocatedStock;
  const flashPrice = Number(item.flashSalePrice);
  const originalPrice = Number(item.originalPrice);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {flashPrice < originalPrice && (
        <Badge variant="danger">
          -{Math.round(((originalPrice - flashPrice) / originalPrice) * 100)}%
        </Badge>
      )}
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold">
        {item.productName}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">{item.variantName}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">
          {formatVND(flashPrice)}
        </span>
        {flashPrice < originalPrice && (
          <span className="text-xs text-zinc-400 line-through">
            {formatVND(originalPrice)}
          </span>
        )}
      </div>

      <StockProgressBar
        available={stock}
        allocated={total}
      />

      <Button
        className="mt-3 w-full"
        disabled={stock <= 0 || item.status !== "APPROVED"}
        onClick={onBuy}
      >
        {stock <= 0 ? "Hết hàng" : "Mua ngay"}
      </Button>
    </div>
  );
}
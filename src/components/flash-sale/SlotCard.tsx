"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCountdown } from "@/hooks";
import { Badge } from "@/components/ui";
import { Countdown } from "./Countdown";
import type { PublicFlashSaleSlotResponse } from "@/types";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slot: PublicFlashSaleSlotResponse;
}

export function SlotCard({ slot }: SlotCardProps) {
  const t = useTranslations("flash-sale");
  const target =
    slot.status === "UPCOMING"
      ? slot.startTime
      : slot.status === "ACTIVE"
      ? slot.endTime
      : null;

  const countdownLabel =
    slot.status === "UPCOMING"
      ? t("slot.startsIn")
      : slot.status === "ACTIVE"
      ? t("slot.endsIn")
      : t("slot.ended");

  const firstItem = slot.items[0];

  return (
    <Link
      href={`/flash-sales/${slot.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
        slot.status === "ACTIVE" && "ring-2 ring-red-500"
      )}
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-red-500 via-rose-500 to-orange-400">
        <div className="absolute inset-0 flex items-end p-4 text-white">
          <div>
            <Badge variant={slot.status === "ACTIVE" ? "danger" : slot.status === "UPCOMING" ? "info" : "default"}>
              {t(`status.${slot.status}`)}
            </Badge>
            <h3 className="mt-2 text-lg font-semibold leading-tight line-clamp-2">
              {slot.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          {firstItem && (
            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {firstItem.productName} · {firstItem.variantName}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            {t("list.items", { count: slot.items.length })}
          </p>
        </div>
        {target && slot.status !== "ENDED" && (
          <Countdown target={target} label={countdownLabel} className="shrink-0" />
        )}
      </div>
    </Link>
  );
}
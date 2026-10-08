"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Modal, Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { useUIStore } from "@/stores";
import type { AddressResponse, PublicFlashSaleItemResponse } from "@/types";

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  item: PublicFlashSaleItemResponse | null;
  addresses: AddressResponse[];
}

export function BuyModal({ open, onClose, item, addresses }: BuyModalProps) {
  const router = useRouter();
  const t = useTranslations("flash-sale.buyModal");
  const pushToast = useUIStore((s) => s.pushToast);
  const [addressId, setAddressId] = useState<number | null>(
    addresses.find((a) => a.isDefault)?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const maxQuantity = Math.min(item.userPurchaseLimit, item.availableStock);

  const handleSubmit = async () => {
    if (!addressId) {
      pushToast({ type: "error", message: t("selectAddressError") });
      return;
    }
    if (quantity > maxQuantity) {
      pushToast({ type: "error", message: t("quantityError", { max: maxQuantity }) });
      return;
    }
    setSubmitting(true);
    try {
      const res = await flashSaleApi.reserve({
        flashSaleItemId: item.id,
        addressId,
        quantity,
      });
      pushToast({
        type: "success",
        message: t("success"),
      });
      onClose();
      router.push(`/orders/${res.orderCode}`);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : t("errorGeneric");
      pushToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t("title")}>
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {item.productName}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {t("sku")}: {item.sku} · {t("stockOf", { available: item.availableStock, allocated: item.allocatedStock })}
          </p>
          <p className="mt-1 text-xs">
            {t("purchaseLimit", { limit: item.userPurchaseLimit })}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t("addressLabel")}
          </label>
          <select
            value={addressId ?? ""}
            onChange={(e) => setAddressId(Number(e.target.value))}
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">{t("selectAddress")}</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.contactName} - {a.phone} - {a.ward}, {a.district}
              </option>
            ))}
          </select>
          {addresses.length === 0 && (
            <p className="mt-2 text-xs text-rose-600">
              {t("noAddress")}{" "}
              <a href="/addresses" className="underline">
                {t("addressBook")}
              </a>{" "}
              {t("toAdd")}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t("quantity")}</label>
          <Input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
          <p className="mt-1 text-xs text-zinc-500">
            {t("maxQuantity", { max: maxQuantity })}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!addressId || maxQuantity <= 0}
          >
            {t("submit")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
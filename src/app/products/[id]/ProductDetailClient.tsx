"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { productApi, cartApi } from "@/lib/api";
import { formatVND } from "@/lib/decimal";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";

type Props = {
  productId: number;
};

export function ProductDetailClient({ productId }: Props) {
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const t = useTranslations("product.detail");
  const tCommon = useTranslations("common");
  const isAuth = useAuthStore((s) => s.accessToken != null);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.byId(productId),
  });

  const addMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t("addSuccess"));
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t("addError"));
    },
  });

  if (isLoading) return <p className="text-sm text-zinc-500">{tCommon("loading")}</p>;
  if (!product) return <p>{t("notFound")}</p>;

  const selected = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="aspect-square rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {/* placeholder */}
      </div>

      <div>
        <Badge variant="info">{product.storeName}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-4 text-3xl font-bold text-red-600">
          {formatVND(selected?.originalPrice ?? product.minPrice)}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">{t("variants")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  selected?.id === v.id
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950"
                    : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                {v.variantName}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1"
            >
              -
            </button>
            <span className="px-3">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1"
            >
              +
            </button>
          </div>
          <Button
            disabled={!selected || selected.stockQuantity <= 0 || addMutation.isPending}
            onClick={() => {
              if (!isAuth) {
                router.push(`/login?next=/products/${productId}`);
                return;
              }
              addMutation.mutate({
                variantId: selected!.id,
                quantity: qty,
              });
            }}
          >
            {selected && selected.stockQuantity <= 0 ? t("outOfStock") : t("addToCart")}
          </Button>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          {t("stock", { count: selected?.stockQuantity ?? 0 })}
        </p>
      </div>
    </div>
  );
}

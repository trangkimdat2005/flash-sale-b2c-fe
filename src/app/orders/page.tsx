"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { OrderCard } from "@/components/order";
import { orderApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

export default function OrdersPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const t = useTranslations();

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/orders");
  }, [accessToken, router]);

  const orders = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: () => orderApi.myList({ page: 0, size: 20 }),
    enabled: !!accessToken,
  });

  if (!accessToken) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("order.list.title")}</h1>
        {orders.isLoading ? (
          <p className="text-sm text-zinc-500">{t("common.loading")}</p>
        ) : orders.data?.items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {t("order.list.empty")}{" "}
            <Link href="/products" className="text-red-600 underline">
              {t("common.goShopping")}
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {orders.data?.items.map((o) => (
              <OrderCard key={o.orderCode} order={o} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { CartView } from "@/components/cart";
import { useAuthStore } from "@/stores/auth.store";

export default function CartPage() {
  const t = useTranslations("cart.view");
  const tc = useTranslations("common");
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    // Hydration hoàn tất mà chưa có token → redirect.
    if (typeof window !== "undefined" && !accessToken) {
      router.replace("/login?next=/cart");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-zinc-500">
          {tc("redirecting")}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
        <CartView />
      </main>
      <Footer />
    </>
  );
}
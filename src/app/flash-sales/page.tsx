import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/flash-sale";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "flash-sale.list" });
  return {
    title: `${t("title")} - FlashSale B2C`,
  };
}

export default async function FlashSalesPage() {
  const t = await getTranslations("flash-sale.list");
  const tStatus = await getTranslations("flash-sale.status");
  const tSlot = await getTranslations("flash-sale.slot");
  const slots = await flashSaleApi.listSlots();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <Link
              key={slot.id}
              href={`/flash-sales/${slot.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge
                  variant={
                    slot.status === "ACTIVE"
                      ? "danger"
                      : slot.status === "UPCOMING"
                        ? "info"
                        : "default"
                  }
                >
                  {tStatus(slot.status)}
                </Badge>
                {slot.status === "UPCOMING" && (
                  <Countdown target={slot.startTime} label={tSlot("startsIn")} />
                )}
                {slot.status === "ACTIVE" && (
                  <Countdown target={slot.endTime} label={tSlot("endsIn")} />
                )}
              </div>
              <h2 className="text-lg font-semibold">{slot.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(slot.startTime)} → {formatDate(slot.endTime)}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {t("items", { count: slot.items.length })}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

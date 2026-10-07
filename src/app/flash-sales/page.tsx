import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";
import { SLOT_STATUS_LABEL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/flash-sale";

export const metadata = { title: "Flash Sale - Sản phẩm giá sốc" };

export default async function FlashSalesPage() {
  const slots = await flashSaleApi.listSlots();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Tất cả Flash Sale</h1>
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
                  {SLOT_STATUS_LABEL[slot.status]}
                </Badge>
                {slot.status === "UPCOMING" && (
                  <Countdown target={slot.startTime} label="Bắt đầu sau" />
                )}
                {slot.status === "ACTIVE" && (
                  <Countdown target={slot.endTime} label="Kết thúc sau" />
                )}
              </div>
              <h2 className="text-lg font-semibold">{slot.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(slot.startTime)} → {formatDate(slot.endTime)}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {slot.items.length} sản phẩm
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
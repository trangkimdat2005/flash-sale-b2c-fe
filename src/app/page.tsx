import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: `${t("title")} - FlashSale B2C`,
  };
}

/**
 * Trang chủ: Hero + danh sách Flash Sale đang/sắp diễn ra.
 * Đây là Server Component — fetch trực tiếp qua apiFetch().
 */
export default async function HomePage() {
  const t = await getTranslations("home");
  const tHero = await getTranslations("home.hero");
  const tStatus = await getTranslations("flash-sale.status");

  let slots: Awaited<ReturnType<typeof flashSaleApi.listSlots>> = [];
  let loadError = false;

  try {
    slots = await flashSaleApi.listSlots();
  } catch {
    loadError = true;
  }

  const active = slots.find((s) => s.status === "ACTIVE");
  const upcoming = slots.filter((s) => s.status === "UPCOMING").slice(0, 4);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-8 text-white">
          <Badge variant="warning">{tHero("badge")}</Badge>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            {tHero("title")}
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">
            {tHero("subtitle")}
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/flash-sales">
              <Button variant="secondary" size="lg">
                {tHero("viewAll")}
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-white"
              >
                {tHero("browseProducts")}
              </Button>
            </Link>
          </div>
        </section>

        {loadError ? (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            {t("loadError")}
          </div>
        ) : (
          <>
            {active && (
              <section className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="danger">{t("activeSection")}</Badge>
                  <h2 className="text-xl font-bold">{active.title}</h2>
                </div>
                <Link
                  href={`/flash-sales/${active.id}`}
                  className="block rounded-xl border-2 border-red-500 bg-white p-4 hover:shadow-lg dark:bg-zinc-900"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {active.items[0]?.productName} - {active.items[0]?.variantName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {tStatus(active.status)} · {t("productCount", { count: active.items.length })}
                  </p>
                </Link>
              </section>
            )}

            {upcoming.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-bold">{t("upcomingSection")}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {upcoming.map((slot) => (
                    <Link
                      key={slot.id}
                      href={`/flash-sales/${slot.id}`}
                      className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <Badge variant="info">{tStatus(slot.status)}</Badge>
                      <h3 className="mt-2 font-semibold">{slot.title}</h3>
                      <p className="text-xs text-zinc-500">
                        {t("productCount", { count: slot.items.length })}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

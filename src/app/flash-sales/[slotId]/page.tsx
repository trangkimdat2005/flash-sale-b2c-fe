import { Header, Footer } from "@/components/layout";
import { flashSaleApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { SlotDetailClient } from "./SlotDetailClient";

export default async function SlotDetailPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;
  let slot;
  try {
    slot = await flashSaleApi.getSlot(slotId);
  } catch {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <SlotDetailClient slot={slot} />
      </main>
      <Footer />
    </>
  );
}
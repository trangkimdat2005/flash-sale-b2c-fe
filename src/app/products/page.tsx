import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { ProductListClient } from "./ProductListClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product.list" });
  return {
    title: `${t("title")} - FlashSale B2C`,
  };
}

export default async function ProductsPage() {
  const t = await getTranslations("product.list");
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
        <ProductListClient />
      </main>
      <Footer />
    </>
  );
}

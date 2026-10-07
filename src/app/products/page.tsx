import { Header, Footer } from "@/components/layout";
import { ProductListClient } from "./ProductListClient";

export const metadata = { title: "Sản phẩm - FlashSale B2C" };

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Khám phá sản phẩm</h1>
        <ProductListClient />
      </main>
      <Footer />
    </>
  );
}
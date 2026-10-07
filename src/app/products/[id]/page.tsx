import { Header, Footer } from "@/components/layout";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <ProductDetailClient productId={Number(id)} />
      </main>
      <Footer />
    </>
  );
}
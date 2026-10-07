"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Input as InputField } from "@/components/ui";
import { productApi, categoryApi } from "@/lib/api";
import { formatVND } from "@/lib/decimal";
import type { ProductSummaryResponse } from "@/types";

export function ProductListClient() {
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(0);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });

  const products = useQuery({
    queryKey: ["products", { keyword, categoryId, page }],
    queryFn: () =>
      productApi.list({
        keyword: keyword || undefined,
        categoryId,
        page,
        size: 12,
      }),
  });

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <InputField
          label="Tìm kiếm"
          placeholder="Nhập tên sản phẩm..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
        />
        <div>
          <h3 className="mb-2 text-sm font-semibold">Danh mục</h3>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  setCategoryId(undefined);
                  setPage(0);
                }}
                className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  !categoryId ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : ""
                }`}
              >
                Tất cả
              </button>
            </li>
            {categories.data?.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id);
                    setPage(0);
                  }}
                  className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    categoryId === c.id ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : ""
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section>
        {products.isLoading ? (
          <p className="text-sm text-zinc-500">Đang tải...</p>
        ) : products.data?.items.length === 0 ? (
          <p className="text-sm text-zinc-500">Không có sản phẩm phù hợp.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.data?.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {products.data && products.data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-zinc-500">
              Trang {page + 1} / {products.data.totalPages}
            </span>
            <button
              type="button"
              disabled={!products.data.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: ProductSummaryResponse }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">{product.storeName}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">
          {formatVND(product.minPrice)}
        </span>
        {product.maxPrice > product.minPrice && (
          <span className="text-xs text-zinc-400">- {formatVND(product.maxPrice)}</span>
        )}
      </div>
    </Link>
  );
}
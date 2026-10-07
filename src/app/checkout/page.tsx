"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { cartApi, orderApi, voucherApi, addressApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { money, formatVND } from "@/lib/decimal";
import { ApiError } from "@/lib/api/errors";
import type { AddressResponse, CartStoreGroup as CartGroup } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"ZALOPAY" | "COD">("ZALOPAY");
  const [voucherCode, setVoucherCode] = useState<Record<number, string>>({});
  const [voucherDiscount, setVoucherDiscount] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/checkout");
  }, [accessToken, router]);

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: !!accessToken,
  });

  const checkoutMutation = useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: (orders) => {
      toast.success(`Đã tạo ${orders.length} đơn hàng`);
      router.push(`/orders/${orders[0].orderCode}`);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Thanh toán thất bại");
    },
  });

  if (!accessToken) return null;
  if (cart.isLoading) {
    return <main className="p-10 text-center text-sm">Đang tải...</main>;
  }
  if (!cart.data || cart.data.storeGroups.length === 0) {
    return (
      <>
        <Header />
        <main className="p-10 text-center text-sm text-zinc-500">
          Giỏ hàng trống. <a href="/products" className="text-red-600 underline">Mua sắm ngay</a>
        </main>
        <Footer />
      </>
    );
  }

  const groups = cart.data.storeGroups;

  const submit = async () => {
    if (!addressId) {
      toast.warning("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    const storeOrders = groups.map((g: CartGroup) => ({
      storeId: g.storeId,
      items: g.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      voucherCode: voucherCode[g.storeId] || undefined,
      note: undefined as string | undefined,
    }));
    checkoutMutation.mutate({
      shippingAddressId: addressId,
      paymentMethod,
      storeOrders,
    });
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Thanh toán</h1>

        <Section title="Địa chỉ giao hàng">
          <AddressSelector selectedId={addressId} onSelect={setAddressId} />
        </Section>

        <Section title="Phương thức thanh toán">
          <div className="flex gap-3">
            {(["ZALOPAY", "COD"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-md border px-4 py-2 text-sm ${
                  paymentMethod === m
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {m === "ZALOPAY" ? "ZaloPay QR" : "Thanh toán khi nhận (COD)"}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Đơn hàng theo cửa hàng">
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.storeId} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="font-semibold">{g.storeName}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {g.items.map((it) => (
                    <li key={it.variantId} className="flex justify-between">
                      <span>{it.productName} × {it.quantity}</span>
                      <span>{formatVND(Number(it.price) * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-end gap-2">
                  <InputField
                    label="Mã giảm giá"
                    value={voucherCode[g.storeId] ?? ""}
                    onChange={(e) =>
                      setVoucherCode((p) => ({ ...p, [g.storeId]: e.target.value }))
                    }
                    placeholder="VD: SALE10"
                  />
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const code = voucherCode[g.storeId];
                      if (!code) return;
                      try {
                        const res = await voucherApi.apply({
                          code,
                          storeId: g.storeId,
                          subtotalAmount: g.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
                        });
                        setVoucherDiscount((p) => ({ ...p, [g.storeId]: res.discountAmount }));
                        toast.success(`Giảm ${formatVND(res.discountAmount)}`);
                      } catch (err) {
                        toast.error(err instanceof ApiError ? err.message : "Mã không hợp lệ");
                      }
                    }}
                  >
                    Áp dụng
                  </Button>
                </div>
                {voucherDiscount[g.storeId] ? (
                  <p className="mt-1 text-xs text-emerald-600">
                    Đã giảm: -{formatVND(voucherDiscount[g.storeId])}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={submit}
            loading={checkoutMutation.isPending}
          >
            Đặt hàng
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function AddressSelector({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const { data: addresses } = useQuery<AddressResponse[]>({
    queryKey: ["addresses"],
    queryFn: () => addressApi.list(),
  });

  if (!addresses || addresses.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Bạn chưa có địa chỉ. <a href="/addresses" className="text-red-600 underline">Thêm địa chỉ</a>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {addresses.map((a) => (
<label
        key={a.id}
        className={`block rounded-md border p-3 text-sm cursor-pointer ${
          selectedId === a.id
            ? "border-red-500 bg-red-50 dark:bg-red-950"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <input
          type="radio"
          name="address"
          className="mr-2"
          checked={selectedId === a.id}
          onChange={() => onSelect(a.id)}
        />
        <strong>{a.contactName}</strong> · {a.phone}
        <br />
        <span className="text-zinc-500">
          {a.detailAddress}, {a.ward}, {a.district}, {a.province}
        </span>
      </label>
      ))}
    </div>
  );
}
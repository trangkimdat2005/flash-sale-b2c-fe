"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { addressApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { VIETNAM_PROVINCES } from "@/lib/constants";
import { ApiError } from "@/lib/api/errors";
import { addressSchema } from "@/lib/validators/address.validator";
import type { AddressResponse } from "@/types";

export default function AddressesPage() {
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const t = useTranslations("address.list");
  const tCommon = useTranslations("common");

  const [editing, setEditing] = useState<AddressResponse | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/addresses");
  }, [accessToken, router]);

  const addresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressApi.list(),
    enabled: !!accessToken,
  });

  const del = useMutation({
    mutationFn: addressApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(t("deleteSuccess"));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("deleteError")),
  });

  const setDefault = useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(t("setDefaultSuccess"));
    },
  });

  if (!accessToken) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            {t("add")}
          </Button>
        </div>

        {addresses.isLoading ? (
          <p className="text-sm text-zinc-500">{tCommon("loading")}</p>
        ) : addresses.data?.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("empty")}</p>
        ) : (
          <div className="space-y-3">
            {addresses.data?.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-semibold">
                    {a.contactName} · {a.phone}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {a.detailAddress}, {a.ward}, {a.district}, {a.province}
                  </p>
                  {a.isDefault && (
                    <span className="mt-1 inline-block rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">
                      {t("default")}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!a.isDefault && (
                    <Button size="sm" variant="outline" onClick={() => setDefault.mutate(a.id)}>
                      {t("setDefault")}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { setEditing(a); setFormOpen(true); }}>
                    {t("edit")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => del.mutate(a.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {formOpen && (
          <AddressForm
            initial={editing}
            onClose={() => setFormOpen(false)}
            onSaved={() => {
              setFormOpen(false);
              qc.invalidateQueries({ queryKey: ["addresses"] });
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

function AddressForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: AddressResponse | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const tList = useTranslations("address.list");
  const tForm = useTranslations("address.form");
  const tCommon = useTranslations("common");
  const [form, setForm] = useState({
    contactName: initial?.contactName ?? "",
    phone: initial?.phone ?? "",
    province: initial?.province ?? "",
    district: initial?.district ?? "",
    ward: initial?.ward ?? "",
    detailAddress: initial?.detailAddress ?? "",
    isDefault: initial?.isDefault ?? false,
  });

  const save = useMutation({
    mutationFn: async () => {
      const parsed = addressSchema.parse({
        contactName: form.contactName,
        phone: form.phone,
        province: form.province,
        district: form.district,
        ward: form.ward,
        detailAddress: form.detailAddress,
      });
      if (initial) {
        return addressApi.update(initial.id, parsed);
      }
      return addressApi.create({ ...parsed, isDefault: form.isDefault });
    },
    onSuccess: () => {
      toast.success(tList("saveSuccess"));
      onSaved();
    },
    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error(tForm("validationError"));
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">
          {initial ? tForm("editTitle") : tForm("addTitle")}
        </h2>
        <div className="space-y-3">
          <InputField
            label={tForm("contactName")}
            value={form.contactName}
            onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
          />
          <InputField
            label={tForm("phone")}
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <label className="block">
            <span className="mb-1 block text-sm">{tForm("province")}</span>
            <select
              value={form.province}
              onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">{tForm("selectPlaceholder")}</option>
              {VIETNAM_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <InputField
            label={tForm("district")}
            value={form.district}
            onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
          />
          <InputField
            label={tForm("ward")}
            value={form.ward}
            onChange={(e) => setForm((p) => ({ ...p, ward: e.target.value }))}
          />
          <InputField
            label={tForm("detail")}
            value={form.detailAddress}
            onChange={(e) => setForm((p) => ({ ...p, detailAddress: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
            />
            {tForm("isDefault")}
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{tCommon("cancel")}</Button>
          <Button onClick={() => save.mutate()} loading={save.isPending}>
            {tCommon("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

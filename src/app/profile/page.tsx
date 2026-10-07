"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { changePasswordSchema } from "@/lib/validators/auth.validator";

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);
  const userProfile = useAuthStore((s) => s.user);

  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/profile");
  }, [accessToken, router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    enabled: !!accessToken,
  });

  const changePwd = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công");
      setPwd({ oldPassword: "", newPassword: "", confirm: "" });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Lỗi"),
  });

  const logout = () => {
    useAuthStore.getState().clear();
    router.push("/login");
  };

  if (!accessToken) return null;

  const profile = me.data ?? userProfile;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Tài khoản của tôi</h1>

        {profile && (
          <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">Thông tin cá nhân</h2>
            <dl className="space-y-1 text-sm">
              <Row label="Email" value={profile.email} />
              <Row label="Họ tên" value={profile.fullName ?? "—"} />
              <Row label="Số điện thoại" value={profile.phone ?? "—"} />
            </dl>
          </section>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 font-semibold">Đổi mật khẩu</h2>
          <div className="space-y-3">
            <InputField
              label="Mật khẩu hiện tại"
              type="password"
              value={pwd.oldPassword}
              onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))}
            />
            <InputField
              label="Mật khẩu mới"
              type="password"
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <InputField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={pwd.confirm}
              onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
            />
            <Button
              onClick={() => {
                try {
                  const parsed = changePasswordSchema.parse(pwd);
                  changePwd.mutate({
                    oldPassword: parsed.oldPassword,
                    newPassword: parsed.newPassword,
                  });
                } catch (e) {
                  toast.error("Mật khẩu xác nhận không khớp");
                }
              }}
              loading={changePwd.isPending}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={logout}>
            Đăng xuất
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-100 py-1 dark:border-zinc-800">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
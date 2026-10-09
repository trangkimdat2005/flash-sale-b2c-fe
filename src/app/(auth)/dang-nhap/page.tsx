"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, loginSchema, type LoginInput } from "@/features/auth";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DangNhapPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const login = useLoginMutation();

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, {
      onSuccess: () => {
        // TODO: điều hướng theo role ở bước sau (sau khi store có role thật).
        router.push(ROUTES.HOME);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <h1 className="text-xl font-semibold text-ink">Đăng nhập</h1>
        <p className="mt-1 text-sm text-ink-2">Chào mừng bạn quay lại Vibe Mart.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="identifier">Email hoặc Số điện thoại</Label>
        <Input
          id="identifier"
          type="text"
          autoComplete="username"
          inputMode="email"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="text-xs text-danger">{errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-danger">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>

      <p className="text-center text-xs text-ink-2">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="text-brand hover:underline">
          Đăng ký
        </Link>
      </p>
    </form>
  );
}

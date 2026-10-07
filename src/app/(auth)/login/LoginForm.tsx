"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { loginSchema } from "@/lib/validators/auth.validator";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const res = await authApi.login(values);
      setSession({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      toast.success("Đăng nhập thành công!");
      const next = search.get("next") || "/";
      router.push(next);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        label="Mật khẩu"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" loading={submitting} className="w-full">
        Đăng nhập
      </Button>
      <p className="text-center text-sm text-zinc-500">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-red-600 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}
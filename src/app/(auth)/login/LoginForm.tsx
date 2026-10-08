"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth.login");
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
      toast.success(t("success"));
      const next = search.get("next") || "/";
      router.push(next);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t("errorGeneric");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        label={t("password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" loading={submitting} className="w-full">
        {t("submit")}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-sale hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth.validator";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToast();
  const t = useTranslations("auth.register");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    try {
      await authApi.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
      });
      // Auto-login sau khi đăng ký
      const session = await authApi.login({
        email: values.email,
        password: values.password,
      });
      setSession({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      toast.success(t("success"));
      router.push("/");
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
        label={t("fullName")}
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <InputField
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        label={t("phone")}
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <InputField
        label={t("password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <InputField
        label={t("confirmPassword")}
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" loading={submitting} className="w-full">
        {t("submit")}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-red-600 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}

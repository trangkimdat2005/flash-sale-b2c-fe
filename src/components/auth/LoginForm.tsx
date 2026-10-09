"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  useLoginMutation,
  loginSchema,
  type LoginInput,
} from '@/features/auth';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * LoginForm – form đăng nhập (RHF + Zod, identifierSchema từ SP6).
 * Submit → useLoginMutation → onSuccess redirect theo role.
 *
 * Plan 2026-10-09 quyết định 6: gửi { email?, phoneNumber?, password }
 * Plan 2026-10-09 quyết định 7: OAuth buttons TODO (sẽ làm ở SP5)
 */
export function LoginForm() {
  const t = useTranslations('auth.login');
  const tErr = useTranslations('auth.errors');
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const login = useLoginMutation();

  const onSubmit = (data: LoginInput) => {
    setApiError(null);
    login.mutate(data, {
      onSuccess: () => {
        toast.success(t('title'));
        router.push(ROUTES.HOME);
      },
      onError: () => {
        setApiError(tErr('invalidCredentials'));
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      data-testid="login-form"
    >
      <div>
        <h1 className="text-xl font-semibold text-ink">{t('title')}</h1>
        <p className="mt-1 text-sm text-ink-2">{t('subtitle')}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t('identifierLabel')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder={t('identifierPlaceholder')}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-danger" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t('passwordLabel')}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder={t('passwordPlaceholder')}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-2 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-danger" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end text-sm">
        <Link
          href="/quen-mat-khau"
          className="text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          {t('forgotPassword')}
        </Link>
      </div>

      {apiError && (
        <p className="text-xs text-danger" role="alert">
          {apiError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={login.isPending}
        data-testid="login-submit"
      >
        {login.isPending ? t('submitPending') : t('submit')}
      </Button>

      <p className="text-center text-xs text-ink-2">
        {t('noAccount')}{' '}
        <Link
          href={ROUTES.REGISTER}
          className="text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          {t('signupCta')}
        </Link>
      </p>
    </form>
  );
}

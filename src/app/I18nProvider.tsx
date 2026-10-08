import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";

/**
 * Bọc NextIntlClientProvider cho mọi layout/page.
 * (Provider Providers đã ở app/layout.tsx; đây chỉ thêm i18n.)
 */
export default async function I18nProvider({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

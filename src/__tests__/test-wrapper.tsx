import { NextIntlClientProvider } from 'next-intl';
import viMessages from '@/../messages/vi.json';
import enMessages from '@/../messages/en.json';

/**
 * Test wrapper for components that use next-intl hooks.
 * - Provides NextIntlClientProvider with vi locale (default) + en fallback
 * - Use this in render(<TestWrapper>...</TestWrapper>) for any component
 *   that calls useTranslations / useFormatter / useLocale from next-intl
 *
 * Note: import messages from disk ensures parity tests work without
 * mocking. For locale switch tests, pass locale="en" via prop.
 */
export function TestWrapper({
  children,
  locale = 'vi',
}: {
  children: React.ReactNode;
  locale?: 'vi' | 'en';
}) {
  const messages = locale === 'en' ? enMessages : viMessages;
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

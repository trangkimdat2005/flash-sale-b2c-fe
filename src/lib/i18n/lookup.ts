/**
 * Lookup helper for i18n messages.
 *
 * Provides a synchronous, framework-free way to read a message by namespace +
 * path. Useful for:
 *   - Server-side code that needs a label before rendering (e.g. generating
 *     metadata, error toasts from API client, server logs).
 *   - Unit tests that verify message structure without spinning up next-intl.
 *
 * Messages are loaded via `import()` so that test setups (Vitest) can stub
 * the read with `vi.mock`.
 */
import viMessages from '../../../messages/vi.json';
import enMessages from '../../../messages/en.json';

export type Locale = 'vi' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = ['vi', 'en'] as const;

const MESSAGE_BUNDLES: Record<Locale, Record<string, unknown>> = {
  vi: viMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
};

export function isLocale(value: unknown): value is Locale {
  return value === 'vi' || value === 'en';
}

/**
 * Walk a messages bundle by a dotted path.
 *
 * @example
 *   getMessage('vi', 'common.loading')          // -> "Đang tải..."
 *   getMessage('en', 'order.status.PAID')        // -> "Paid"
 */
export function getMessage(
  locale: Locale,
  path: string
): string | undefined {
  const bundle = MESSAGE_BUNDLES[locale];
  if (!bundle) return undefined;

  const segments = path.split('.');
  let current: unknown = bundle;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Return all messages for a top-level namespace, keyed by locale.
 *
 * @example
 *   getMessagesByNamespace('home')['vi'].hero.title
 */
export function getMessagesByNamespace(
  namespace: string
): Record<Locale, Record<string, unknown>> {
  const result = {} as Record<Locale, Record<string, unknown>>;
  for (const locale of SUPPORTED_LOCALES) {
    const bundle = MESSAGE_BUNDLES[locale];
    result[locale] = (bundle?.[namespace] as Record<string, unknown>) ?? {};
  }
  return result;
}

/**
 * List the top-level namespaces defined in the messages files.
 * Useful for verifying all keys are mirrored across locales.
 */
export function listNamespaces(): string[] {
  const namespaces = new Set<string>();
  for (const bundle of Object.values(MESSAGE_BUNDLES)) {
    for (const key of Object.keys(bundle)) {
      namespaces.add(key);
    }
  }
  return Array.from(namespaces).sort();
}
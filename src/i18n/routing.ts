/**
 * i18n config (rule i18n.mdc).
 * Locale mặc định: vi. Cấu hình cho next-intl v4 (App Router).
 */
import { defineRouting } from "next-intl/routing";

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Bước "lõi" chưa bật prefix-locale để tránh đổi URL ngay lập tức.
  // Bật sau: localePrefix: 'always' và dùng middleware kết hợp.
  localePrefix: "as-needed",
});

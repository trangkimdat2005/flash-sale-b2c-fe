"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === "vi" ? "en" : "vi";
  const label = locale === "vi" ? "English" : "Tiếng Việt";

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => router.replace(pathname, { locale: next }));
      }}
      disabled={isPending}
      aria-label="Switch language"
      className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  );
}
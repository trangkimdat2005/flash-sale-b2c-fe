import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * AuthBrandPanel – cột trái của trang auth, hiển thị:
 *  - Logo + wordmark Vibe Mart
 *  - Title + intro copy
 *  - 3 benefit cards (với 1 badge "HOT DEAL")
 *  - Inline SVG icons (plan 2026-10-09 quyết định 4: KHÔNG dùng lucide)
 *
 * Khác store: hiển thị ngay trên nền gradient brand-soft → white
 * (chấp nhận dùng 1 gradient vì nó là panel brand, không vi phạm rule §4.2
 *  quá nhiều – chỉ 1 khu vực duy nhất có gradient).
 */
export function AuthBrandPanel() {
  const t = useTranslations('auth.brand');
  return (
    <aside
      className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-soft via-card to-page p-10 lg:flex"
      data-testid="auth-brand-panel"
    >
      {/* Top: logo + wordmark */}
      <div className="flex items-center gap-3">
        <Image
          src="/brand/logo/vibe-mart-logo-mark-on-square.png"
          alt="Vibe Mart"
          width={40}
          height={40}
          priority
          className="h-10 w-10"
        />
        <span className="text-lg font-semibold text-ink">Vibe Mart</span>
      </div>

      {/* Middle: title + intro + benefits */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold leading-tight text-ink lg:text-3xl">
            {t('title')}
          </h2>
          <p className="text-sm leading-relaxed text-ink-2 lg:text-base">
            {t('intro')}
          </p>
        </div>

        <div className="space-y-3">
          <Benefit
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M8 13h.01M12 13h.01M16 13h.01" />
              </svg>
            }
            title={t('benefit1Title')}
            desc={t('benefit1Desc')}
          />
          <Benefit
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
              </svg>
            }
            title={t('benefit2Title')}
            desc={t('benefit2Desc')}
            badge={t('benefit2Badge')}
          />
          <Benefit
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
                <path d="M16 12h.01M12 12h.01M8 12h.01" />
                <path d="M22 17h-6M19 14v6" />
              </svg>
            }
            title={t('benefit3Title')}
            desc={t('benefit3Desc')}
          />
        </div>
      </div>

      {/* Bottom: small decoration */}
      <div className="text-xs text-ink-3">
        <p>© 2026 Vibe Mart</p>
      </div>
    </aside>
  );
}

function Benefit({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-card/60 p-3 backdrop-blur-sm">
      <div className="shrink-0 text-brand">{icon}</div>
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink">{title}</p>
          {badge && (
            <span className="rounded-md bg-sale px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-ink-2">{desc}</p>
      </div>
    </div>
  );
}

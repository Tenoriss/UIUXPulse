import { Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

/**
 * Public marketing layout: sticky editorial header, breakout content area,
 * quiet footer with the "we never modify sites" disclaimer.
 */
export function PublicLayout() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-micro focus:text-canvas"
      >
        {t('common.skipToContent')}
      </a>

      <PublicHeader />

      <main id="main-content" key={location.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

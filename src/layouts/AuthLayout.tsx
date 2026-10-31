import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher } from '@/components/brand/LanguageSwitcher';
import { Badge } from '@/components/ui';

/**
 * Split auth layout:
 * left  — form column on canvas, vertically centred, generous gutters
 * right — editorial quote panel in sage wash (hidden below lg)
 */
export function AuthLayout() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh bg-canvas">
      <div className="flex w-full flex-col lg:w-[54%]">
        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to={routes.home}
              className="hidden items-center gap-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink sm:inline-flex"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              {t('nav.home')}
            </Link>
          </div>
        </header>

        <main id="main-content" className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm animate-fade-up">
            <Outlet />
          </div>
        </main>

        <footer className="px-6 pb-8 text-center sm:px-10">
          <p className="mx-auto max-w-sm text-micro leading-relaxed text-ink-muted">
            {t('auth.previewNotice')}
          </p>
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-line bg-surface-muted lg:block lg:w-[46%]">
        <div className="absolute inset-0 dot-grid opacity-50" aria-hidden="true" />
        <div
          className="absolute -right-24 top-1/4 size-96 rounded-full bg-sage-wash/70 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Badge tone="sage" dot>
            {t('home.available')}
          </Badge>

          <div className="max-w-md">
            <p className="font-serif text-h2 leading-[1.08] text-ink">
              {t('auth.asideTitle')}
            </p>
            <p className="mt-5 text-body text-ink-soft">{t('auth.asideBody')}</p>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5 text-micro text-ink-muted">
            <span>{t('common.tagline')}</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

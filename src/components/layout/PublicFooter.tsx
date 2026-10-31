import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { footerNav } from '@/config/navigation';
import { routes, site } from '@/config/site';
import { useI18n } from '@/i18n';
import { Logo } from '@/components/brand/Logo';
import { Container } from './Container';

export function PublicFooter({ className }: { className?: string }) {
  const { t, formatDate } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className={cn('mt-24 border-t border-line bg-canvas', className)}>
      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-body text-ink-soft">{t('footer.description')}</p>

            <a
              href={`mailto:${site.email}`}
              className="group mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              {site.email}
              <ArrowUpRight
                className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.titleKey}>
                <p className="eyebrow mb-4">{group.titleKey ? t(group.titleKey) : ''}</p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.titleKey}-${item.labelKey}`}>
                      {item.external ? (
                        <a
                          href={item.to}
                          className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                        >
                          {t(item.labelKey)}
                        </a>
                      ) : (
                        <Link
                          to={item.to}
                          className="inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                        >
                          {t(item.labelKey)}
                          {item.badgeKey && (
                            <span className="rounded-pill border border-line px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-[0.08em] text-ink-faint">
                              {t(item.badgeKey)}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <p className="max-w-2xl text-micro leading-relaxed text-ink-faint">
            {t('footer.disclaimer')}
          </p>

          <div className="mt-6 flex flex-col gap-3 text-micro text-ink-faint sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-5">
              <Link to={routes.methodology} className="transition-colors hover:text-ink-soft">
                {t('footer.privacy')}
              </Link>
              <Link to={routes.methodology} className="transition-colors hover:text-ink-soft">
                {t('footer.terms')}
              </Link>
              <span className="tabular-nums">{formatDate(Date.now(), { year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

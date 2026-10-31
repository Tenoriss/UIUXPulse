import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { routes } from '@/config/site';
import { publicNav } from '@/config/navigation';
import { useI18n } from '@/i18n';
import { useScrolled } from '@/hooks/useScrolled';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { LinkButton, IconButton } from '@/components/ui';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher, LanguageList } from '@/components/brand/LanguageSwitcher';
import { Container } from './Container';
import { HeaderNavLink } from './NavLink';

export function PublicHeader() {
  const { t } = useI18n();
  const scrolled = useScrolled(12);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useLockBodyScroll(mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-500 ease-[var(--ease-editorial)]',
        scrolled
          ? 'border-b border-line/80 bg-canvas/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-18">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {publicNav.map((item) => (
            <HeaderNavLink key={`${item.to}-${item.labelKey}`} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            to={routes.signIn}
            className="text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
          >
            {t('nav.signIn')}
          </Link>
          <LinkButton to={routes.signUp} size="sm" tone="dark">
            {t('nav.signUp')}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </LinkButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <IconButton
            label={mobileOpen ? t('common.closeMenu') : t('common.openMenu')}
            icon={mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            tone="outline"
            size="sm"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          />
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="fixed inset-x-0 top-16 bottom-0 z-30 overflow-y-auto border-t border-line bg-canvas px-5 pb-10 pt-6 sm:top-18 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {publicNav.map((item, index) => (
            <div key={`${item.to}-${item.labelKey}`} className="border-b border-line">
              <Link
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-baseline gap-4 py-4 text-2xl font-serif text-ink"
              >
                <span className="text-micro tabular-nums text-ink-faint">
                  0{index + 1}
                </span>
                {t(item.labelKey)}
              </Link>
            </div>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <LinkButton
            to={routes.signUp}
            size="lg"
            fullWidth
            onClick={() => setMobileOpen(false)}
          >
            {t('nav.signUp')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
          <Link
            to={routes.signIn}
            onClick={() => setMobileOpen(false)}
            className="py-3 text-center text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4"
          >
            {t('nav.signIn')}
          </Link>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="eyebrow mb-3">{t('common.language')}</p>
          <LanguageList />
        </div>
      </div>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { routes } from '@/config/site';
import { publicNav } from '@/config/navigation';
import { useI18n } from '@/i18n';
import { useScrolled } from '@/hooks/useScrolled';
import { IconButton, LinkButton } from '@/components/ui';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher } from '@/components/brand/LanguageSwitcher';
import { Container } from './Container';
import { MobileNavDrawer } from './MobileNavDrawer';
import { HeaderNavLink } from './NavLink';

export function PublicHeader() {
  const { t } = useI18n();
  const scrolled = useScrolled(12);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
        <Logo withMascot />

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
          <LinkButton to={routes.register} size="sm" tone="dark">
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

      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={publicNav}
      />
    </header>
  );
}

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { routes } from '@/config/site';
import type { NavItem } from '@/types/navigation';
import { useI18n } from '@/i18n';
import { LanguageList } from '@/components/brand/LanguageSwitcher';
import { IconButton, LinkButton } from '@/components/ui';

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

/**
 * Full-height mobile navigation drawer.
 *
 * Rendered through a portal on purpose. Inside the header it would inherit the
 * sticky header's stacking context and — more importantly — any `overflow-hidden`
 * or `backdrop-filter` on an ancestor (the header blurs on scroll, the hero
 * section clips its glow), which silently breaks `position: fixed` and makes the
 * drawer scroll with the page instead of on its own.
 *
 * Scrolling is handled here, not on `<body>`: the body stays locked while the
 * drawer is open and the drawer's own list is the scroll container, so a long
 * menu always scrolls.
 */
export function MobileNavDrawer({ open, onClose, items }: MobileNavDrawerProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Pad for the scrollbar so the page behind does not shift when locked.
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Scrim */}
      <button
        type="button"
        aria-label={t('common.closeMenu')}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px] animate-fade-in"
      />

      {/* Panel: the scroll container is this element */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label={t('common.menu')}
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-line bg-canvas shadow-clay-lg animate-slide-in-right"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 sm:h-18">
          <p className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {t('common.menu')}
          </p>
          <IconButton
            label={t('common.closeMenu')}
            icon={<X className="size-5" />}
            tone="outline"
            size="sm"
            onClick={onClose}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-2">
          <nav aria-label={t('common.menu')} className="flex flex-col">
            {items.map((item, index) => (
              <div key={`${item.to}-${item.labelKey}`} className="border-b border-line">
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="flex items-baseline gap-4 py-4 font-serif text-2xl text-ink"
                >
                  <span className="text-micro tabular-nums text-ink-muted">
                    0{index + 1}
                  </span>
                  {t(item.labelKey)}
                </Link>
              </div>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <LinkButton to={routes.signUp} size="lg" fullWidth onClick={onClose}>
              {t('nav.signUp')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <Link
              to={routes.signIn}
              onClick={onClose}
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
      </div>
    </div>,
    document.body,
  );
}

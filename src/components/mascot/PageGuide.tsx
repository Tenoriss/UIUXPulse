import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import { usePageGuide } from '@/hooks/usePageGuide';
import { useDismissable } from '@/hooks/useDismissable';
import { useRef } from 'react';

const STORAGE_KEY = 'uiuxpulse.guide.hidden';

/**
 * Pip — the page guide.
 *
 * A small floating mascot that explains the page you are on. It is a *helper*,
 * never a gate: it can be dismissed for the session, it never covers the main
 * action on mobile, and its text is the same content exposed to screen readers
 * via `role="status"`.
 */
export function PageGuide() {
  const { t } = useI18n();
  const guide = usePageGuide();
  const { pathname } = useLocation();
  const bubbleRef = useRef<HTMLDivElement>(null);

  const [hidden, setHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });
  const [open, setOpen] = useState(false);

  // Close the bubble on navigation so it never describes the wrong page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useDismissable(bubbleRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
  });

  if (hidden) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 sm:p-6">
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
        {/* ---------------------------------------------------------- Bubble */}
        {open && (
          <div
            ref={bubbleRef}
            role="status"
            aria-live="polite"
            className="clay-surface-lg w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-white/[0.08] bg-surface p-4 animate-scale-in sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-sage-deep">
                  {guide.name} · {guide.page}
                </p>
                <h2 className="mt-2 font-serif text-[1.25rem] font-medium leading-snug text-ink">
                  {guide.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('modal.close')}
                className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-[var(--duration-instant)] hover:bg-surface-muted hover:text-ink"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
              {guide.body}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
              {guide.action && guide.actionTo ? (
                <Link
                  to={guide.actionTo}
                  onClick={() => setOpen(false)}
                  className="group inline-flex items-center gap-1.5 text-micro font-medium text-sage-deep transition-colors hover:text-sage-ink"
                >
                  {guide.action}
                  <ArrowRight
                    className="size-3 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <span className="text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint">
                  {guide.name}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setHidden(true);
                  window.localStorage.setItem(STORAGE_KEY, '1');
                }}
                className="text-[0.625rem] text-ink-muted underline decoration-line-strong underline-offset-2 transition-colors hover:text-ink"
              >
                {t('guide.hide')}
              </button>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- Avatar */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={t('guide.open', { page: guide.page })}
            className={cn(
              'group relative flex size-14 items-center justify-center rounded-full border border-white/[0.08] bg-surface-muted',
              'clay-surface transition-transform duration-[var(--duration-quick)] ease-[var(--ease-editorial)]',
              'hover:-translate-y-0.5 focus-visible:outline-none',
              open && 'ring-2 ring-sage-deep/50 ring-offset-2 ring-offset-canvas',
            )}
          >
            <img
              src="/images/mascot-pip-sm.png"
              alt=""
              width={160}
              height={160}
              aria-hidden="true"
              className="size-11 object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ imageRendering: 'pixelated' }}
            />
            {!open && (
              <span
                className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-sage-deep shadow-[0_0_0_2px_var(--color-surface)] animate-pulse-dot"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

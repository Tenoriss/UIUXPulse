import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useI18n } from '@/i18n';
import { IconButton } from './Button';

export type ModalSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  /** Prevent closing via backdrop click or Escape. */
  dismissible?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  eyebrow,
  children,
  footer,
  size = 'md',
  dismissible = true,
  className,
}: ModalProps) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusTarget =
      panel?.querySelector<HTMLElement>(
        '[data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) ?? panel;
    focusTarget?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!panel) return;

      if (event.key === 'Escape' && dismissible) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label={t('modal.close')}
        tabIndex={-1}
        onClick={dismissible ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[3px] animate-fade-in"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-t-2xl border border-line bg-surface shadow-clay-lg animate-slide-up sm:rounded-2xl sm:animate-scale-in',
          sizeStyles[size],
          className,
        )}
      >
        <div className="grain-top flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl">
          <div className="flex items-start justify-between gap-6 px-6 pt-6 pb-1 sm:px-8 sm:pt-8">
            <div className="space-y-2">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && (
                <h2
                  id={titleId}
                  className="font-serif text-[1.75rem] leading-[1.1] tracking-[-0.015em] text-ink"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="max-w-prose text-body text-ink-soft">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              label={t('modal.close')}
              icon={<X className="size-4" />}
              size="sm"
              onClick={onClose}
              className="-mr-1.5 -mt-1 shrink-0"
            />
          </div>

          {children && (
            <div className="overflow-y-auto px-6 py-5 text-body text-ink-soft sm:px-8">
              {children}
            </div>
          )}

          {footer && (
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-surface-muted/40 px-6 py-4 sm:px-8">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

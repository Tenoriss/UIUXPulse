import { FlaskConical, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';

export interface DemoBannerProps {
  onDismiss?: () => void;
  className?: string;
  /** Compact variant for inline use inside a card. */
  compact?: boolean;
}

/**
 * The one banner every demo surface carries.
 *
 * Deliberately loud: results are the screen most likely to be mistaken for real
 * analysis, so the disclaimer is a bordered block above the content rather than
 * a footnote under it.
 */
export function DemoBanner({ onDismiss, className, compact = false }: DemoBannerProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border border-ochre/35 bg-ochre-soft/60',
        compact ? 'px-3 py-2.5' : 'px-4 py-3.5',
        className,
      )}
      role="note"
    >
      <FlaskConical
        className="mt-0.5 size-4 shrink-0 text-ochre-ink"
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[0.8125rem] font-medium text-ochre-ink">{t('results.demoBadge')}</p>
        <p className="mt-0.5 text-micro text-ink-soft">{t('results.demoNotice')}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t('common.close')}
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

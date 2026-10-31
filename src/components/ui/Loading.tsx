import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';

/** Thin indeterminate progress line — used at the top of a route transition. */
export function LoadingBar({ className }: { className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className={cn('h-[2px] w-full overflow-hidden bg-line/70', className)}
    >
      <div className="h-full w-1/3 animate-[shimmer_1.4s_linear_infinite] bg-sage-deep/70" />
    </div>
  );
}

/** Orbital spinner in sage. Restrained, no bouncing dots. */
export function Spinner({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size }}
      className={cn('inline-block animate-spin rounded-full border-sage/40 border-t-sage-deep', className)}
    >
      <span className="sr-only">Loading</span>
    </span>
  );
}

export interface LoadingStateProps {
  label?: string;
  description?: string;
  /** Number of skeleton lines; 0 hides the skeleton block. */
  rows?: number;
  className?: string;
}

/** Full-section loading state with editorial skeleton lines. */
export function LoadingState({ label, description, rows = 3, className }: LoadingStateProps) {
  const { t } = useI18n();
  const resolvedLabel = label ?? t('states.loading');
  const resolvedDescription = description ?? t('states.loadingBody');

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col gap-6 rounded-lg border border-line bg-surface p-6 sm:p-9',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Spinner size={16} />
        <div>
          <p className="text-[0.8125rem] font-medium text-ink">{resolvedLabel}</p>
          <p className="text-micro text-ink-muted">{resolvedDescription}</p>
        </div>
      </div>

      {rows > 0 && (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-3 animate-pulse-soft rounded-pill bg-surface-muted',
                index === 0 ? 'w-2/5' : index === 1 ? 'w-full' : 'w-3/4',
              )}
              style={{ animationDelay: `${index * 120}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Inline skeleton block for cards and list rows. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse-soft rounded-md bg-surface-muted', className)}
    />
  );
}

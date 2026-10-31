import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { EmptyStateProps } from '@/types/ui';

export function EmptyState({
  icon: Icon = Sparkles,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        variant === 'default'
          ? 'rounded-lg border border-line bg-surface/70 px-6 py-14 sm:px-10 sm:py-16'
          : 'px-2 py-6',
        className,
      )}
    >
      <span className="mb-6 flex size-12 items-center justify-center rounded-full border border-line bg-surface-muted/70 text-ink-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
      </span>

      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}

      <h3 className="max-w-md font-serif text-h3 text-ink">{title}</h3>

      {description && (
        <p className="mt-3 max-w-sm text-body text-ink-soft">{description}</p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

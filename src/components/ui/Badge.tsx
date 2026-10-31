import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { StatusTone } from '@/types/ui';

const toneStyles: Record<StatusTone, string> = {
  neutral: 'border-line bg-surface text-ink-soft',
  sage: 'border-sage/45 bg-sage-wash text-sage-ink',
  taupe: 'border-taupe/60 bg-taupe-soft/60 text-ink-soft',
  clay: 'border-clay/30 bg-clay-soft text-clay-ink',
  ochre: 'border-ochre/30 bg-ochre-soft text-ochre-ink',
};

const dotStyles: Record<StatusTone, string> = {
  neutral: 'bg-ink-faint',
  sage: 'bg-sage-deep',
  taupe: 'bg-taupe',
  clay: 'bg-clay',
  ochre: 'bg-ochre',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  /** Leading status dot. */
  dot?: boolean;
  size?: 'sm' | 'md';
  icon?: ReactNode;
}

/**
 * Badge is non-interactive display text (never a button), so it may sit below
 * the 24px target-size floor. Interactive chips must use Button instead.
 */
export function Badge({
  tone = 'neutral',
  dot = false,
  size = 'sm',
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border font-medium tracking-[0.01em] whitespace-nowrap',
        size === 'sm' ? 'h-6 px-2.5 text-[0.6875rem]' : 'h-7 px-3 text-micro',
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn('size-1.5 rounded-full', dotStyles[tone])}
        />
      )}
      {icon}
      {children}
    </span>
  );
}

/** Editorial section marker, e.g. "(06)" or a numbered index. */
export function IndexBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'font-sans text-micro tabular-nums tracking-[0.04em] text-ink-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}

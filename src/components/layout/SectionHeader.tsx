import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionHeaderProps {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** `split` puts the title left and description right on wide screens. */
  align?: 'stacked' | 'split';
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  action,
  align = 'split',
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('w-full', className)}>
      {(eyebrow || index) && (
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {index && <span className="text-micro tabular-nums text-ink-faint">({index})</span>}
        </div>
      )}

      <div
        className={cn(
          'flex flex-col gap-6',
          align === 'split' && 'lg:flex-row lg:items-end lg:justify-between lg:gap-16',
        )}
      >
        <h2
          className={cn(
            'max-w-2xl font-serif text-h2 text-ink',
            align === 'split' && 'lg:max-w-xl',
            titleClassName,
          )}
        >
          {title}
        </h2>

        <div
          className={cn(
            'flex flex-col gap-5',
            align === 'split' && 'lg:max-w-md lg:items-end',
          )}
        >
          {description && (
            <p className={cn('text-body text-ink-soft', align === 'split' && 'lg:text-right')}>
              {description}
            </p>
          )}
          {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}

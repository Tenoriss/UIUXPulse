import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Editorial section marker: small tracked label on the left, index `(06)` on
 * the right, separated by a hairline — the rhythm used throughout the
 * reference design for every major section.
 */
export function SectionLabel({
  label,
  index,
  className,
}: {
  label: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between gap-6 border-b border-line pb-4',
        className,
      )}
    >
      <p className="eyebrow">{label}</p>
      {index && (
        <span className="text-micro tabular-nums tracking-[0.04em] text-ink-muted">
          ({index})
        </span>
      )}
    </div>
  );
}

export interface StatItem {
  value: string;
  label: string;
}

/**
 * Large serif numerals with a small caption underneath — the "7 / Years of
 * experience" band from the reference. Rules between columns, no cards.
 */
export function StatBand({
  items,
  className,
}: {
  items: StatItem[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        'grid grid-cols-1 gap-px bg-line sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse gap-2 bg-canvas px-6 py-6 first:pl-0 sm:py-8"
        >
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {item.label}
          </dt>
          <dd className="font-serif text-mega leading-none text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Numbered editorial row: `01` + serif title + body, optional meta on the
 * right. Used for principles / philosophy lists instead of card grids.
 */
export function NumberedRow({
  index,
  title,
  children,
  meta,
  className,
}: {
  index: string;
  title: string;
  children?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group grid gap-4 border-b border-line py-8 sm:grid-cols-[64px_1fr_auto] sm:gap-8',
        className,
      )}
    >
      <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
        {index}
      </span>
      <div className="max-w-xl">
        <h3 className="font-serif text-h3 text-ink transition-colors duration-300 group-hover:text-sage-ink">
          {title}
        </h3>
        {children && (
          <p className="mt-3 text-body text-ink-soft">{children}</p>
        )}
      </div>
      {meta && <div className="text-micro text-ink-muted sm:pt-2 sm:text-right">{meta}</div>}
    </div>
  );
}

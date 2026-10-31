import { cn } from '@/lib/cn';

export interface AvailabilityPillProps {
  label: string;
  className?: string;
  /** `pill` floats over hero imagery; `inline` sits in normal flow. */
  variant?: 'pill' | 'inline';
}

/**
 * "Available for work" style status pill with a slowly pulsing dot — the one
 * animated element that carries meaning, so it is exempt from idle decoration.
 */
export function AvailabilityPill({
  label,
  className,
  variant = 'pill',
}: AvailabilityPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border font-medium',
        variant === 'pill'
          ? 'border-line bg-surface/85 px-3.5 py-1.5 text-[0.6875rem] tracking-[0.02em] text-ink shadow-clay backdrop-blur-md'
          : 'border-line bg-surface/60 px-3 py-1 text-micro text-ink-soft',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-sage-deep" />
        <span className="relative size-1.5 rounded-full bg-sage-deep" />
      </span>
      {label}
    </span>
  );
}

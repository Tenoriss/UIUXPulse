import { cn } from '@/lib/cn';

/**
 * Availability status: a clay capsule with a pulsing dot.
 * The pulse is the one animated element that carries meaning.
 */
export function AvailabilityPill({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'clay-surface inline-flex items-center gap-2 rounded-pill border border-white/[0.07] bg-surface/90 px-3.5 py-1.5',
        'font-display text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink-soft backdrop-blur-md',
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

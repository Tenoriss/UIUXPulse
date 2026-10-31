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

/**
 * Pixel-sprite avatar on a clay plinth — the product's mascot sits on a
 * raised clay disc so the flat sprite still reads as a physical object.
 */
export function ClayAvatar({
  src,
  alt,
  className,
  size = 'md',
}: {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: { frame: 'size-20', img: 'size-16' },
    md: { frame: 'size-28', img: 'size-23' },
    lg: { frame: 'size-36', img: 'size-30' },
  } as const;

  const dims = sizes[size];

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'clay-surface-lg flex items-center justify-center rounded-full border border-white/[0.08] bg-surface-muted',
          dims.frame,
        )}
      >
        <img
          src={src}
          alt={alt}
          width={512}
          height={512}
          className={cn('object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.6)]', dims.img)}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}

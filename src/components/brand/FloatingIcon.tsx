import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface FloatingIconProps {
  icon: LucideIcon;
  /** Tailwind position utilities for the field container. */
  className?: string;
  /** Visual weight: `solid` is a clay tile, `glyph` is bare. */
  variant?: 'solid' | 'glyph';
  /** Tint of the clay tile. */
  tone?: 'sage' | 'clay' | 'taupe' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  /** Animation rhythm — varied per icon so the field never looks mechanical. */
  speed?: 'slow' | 'normal' | 'fast';
  /** Static rotation in degrees, preserved through the float animation. */
  rotate?: number;
  /** Stagger in seconds so icons do not move in sync. */
  delay?: number;
  label?: string;
}

const sizeStyles = {
  sm: { tile: 'size-10 rounded-lg', glyph: 'size-4' },
  md: { tile: 'size-13 rounded-xl', glyph: 'size-5' },
  lg: { tile: 'size-17 rounded-2xl', glyph: 'size-7' },
} as const;

const toneStyles = {
  sage: 'bg-sage-wash text-sage-ink',
  clay: 'bg-clay-soft text-clay-ink',
  taupe: 'bg-taupe-soft text-taupe',
  ink: 'bg-surface text-ink-soft',
} as const;

const speedStyles = {
  slow: 'animate-float-slow',
  normal: 'animate-float',
  fast: 'animate-float-fast',
} as const;

/**
 * A single floating clay tile.
 *
 * The motion is buoyant rather than spinning: a slow vertical translation with
 * a 2° rotation change, each icon offset by `delay` so the group reads as a
 * loose constellation. Motion is suppressed under `prefers-reduced-motion` by
 * the global rule, and the whole field is decorative (hidden from AT).
 */
export function FloatingIcon({
  icon: Icon,
  className,
  variant = 'solid',
  tone = 'sage',
  size = 'md',
  speed = 'normal',
  rotate = 0,
  delay = 0,
  label,
}: FloatingIconProps) {
  const dims = sizeStyles[size];

  return (
    <div
      className={cn('absolute', speedStyles[speed], className)}
      style={{
        animationDelay: `${delay}s`,
        ['--icon-rotate' as string]: `${rotate}deg`,
      }}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {variant === 'solid' ? (
        <div
          className={cn(
            'clay-surface flex items-center justify-center border border-white/[0.06]',
            dims.tile,
            toneStyles[tone],
          )}
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <Icon className={dims.glyph} strokeWidth={1.6} />
        </div>
      ) : (
        <Icon className="size-6 text-ink-faint" strokeWidth={1.2} />
      )}
    </div>
  );
}

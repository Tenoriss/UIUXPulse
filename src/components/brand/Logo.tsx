import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { routes } from '@/config/site';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('size-8 text-ink', className)}
    >
      {/* Pulse line inside a soft clay circle */}
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.16" />
      <circle cx="16" cy="16" r="10.5" fill="var(--color-sage-wash)" />
      <path
        d="M7.5 16.4h4.1l2.2-4.6 3.4 9.1 2.6-6.2 1.5 3.1h3.2"
        fill="none"
        stroke="var(--color-sage-deep)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pixel mascot on a clay tile. Used in the header lockup so the character is
 * present from the first pixel of the page, without occupying hero space.
 */
export function MascotMark({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'clay-surface inline-flex shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-surface-muted',
        size === 'sm' ? 'size-8' : 'size-10',
        className,
      )}
    >
      <img
        src="/images/avatar-tile.png"
        alt=""
        width={192}
        height={192}
        aria-hidden="true"
        className={cn('object-contain', size === 'sm' ? 'size-7' : 'size-9')}
        style={{ imageRendering: 'pixelated' }}
      />
    </span>
  );
}

export interface LogoProps {
  to?: string;
  className?: string;
  showWordmark?: boolean;
  /** Compact variant for the dashboard sidebar. */
  size?: 'sm' | 'md';
  /** Show the pixel mascot next to the wordmark (public header + auth). */
  withMascot?: boolean;
}

export function Logo({
  to = routes.home,
  className,
  showWordmark = true,
  size = 'md',
  withMascot = false,
}: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-sm transition-opacity hover:opacity-85',
        className,
      )}
      aria-label="UIUXPulse — home"
    >
      {withMascot ? (
        <MascotMark size={size === 'sm' ? 'sm' : 'md'} />
      ) : (
        <LogoMark className={size === 'sm' ? 'size-7' : 'size-8'} />
      )}

      {showWordmark && (
        <span
          className={cn(
            'font-display font-semibold tracking-[-0.01em] text-ink',
            size === 'sm' ? 'text-[1.0625rem]' : 'text-[1.1875rem]',
          )}
        >
          UIUX<span className="text-sage-deep">Pulse</span>
        </span>
      )}
    </Link>
  );
}

import { cn } from '@/lib/cn';
import { useAuth } from '@/services/auth.context';

/** The brand mascot, used whenever the account has no custom photo. */
export const DEFAULT_AVATAR_SRC = '/images/avatar-tile.png';

export interface UserAvatarProps {
  /** Overrides the stored avatar — used for live previews before saving. */
  src?: string | null;
  /** Accessible name of the person, for the alternative text. */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Adds the clay rim used on raised surfaces. */
  raised?: boolean;
}

const sizeStyles = {
  xs: 'size-6 text-[0.5625rem]',
  sm: 'size-8 text-[0.625rem]',
  md: 'size-10 text-[0.75rem]',
  lg: 'size-14 text-[0.9375rem]',
  xl: 'size-20 text-[1.25rem]',
} as const;

/**
 * Avatar for the signed-in account.
 *
 * The pixel mascot stays the default and is drawn with `image-rendering:
 * pixelated`; a custom photo is a square, already-cropped data URL. When no
 * photo exists, initials stand in while the mascot loads and for accessibility.
 */
export function UserAvatar({ src, name, size = 'sm', className, raised = true }: UserAvatarProps) {
  const { user } = useAuth();
  const resolvedSrc = src === undefined ? user?.avatarUrl ?? null : src;
  const label = (name ?? user?.name ?? '').trim();
  const initials = label
    ? label
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : '';

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted',
        raised ? 'clay-surface' : 'border border-line',
        sizeStyles[size],
        className,
      )}
    >
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt=""
          className="size-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <>
          <span className="absolute inset-0 flex items-center justify-center font-medium text-ink-muted">
            {initials}
          </span>
          <img
            src={DEFAULT_AVATAR_SRC}
            alt=""
            width={192}
            height={192}
            className="relative size-full object-contain p-0.5"
            style={{ imageRendering: 'pixelated' }}
            aria-hidden="true"
          />
        </>
      )}
    </span>
  );
}

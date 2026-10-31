import { cn } from '@/lib/cn';
import type { Size, Tone } from '@/types/ui';

/**
 * Button style contract.
 *
 * Kept in a module with no component exports so React Fast Refresh can update
 * Button.tsx in place; link variants import the same strings so button
 * appearance never drifts between <button> and <a>.
 *
 * Design notes:
 * - pill geometry (the only place a fully rounded shape is allowed)
 * - clay top-light + bottom-shadow instead of hard drop shadows
 * - a 1px translate on press, no scale springs
 */
export const buttonBase =
  'group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-editorial)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 active:translate-y-px';

const toneStyles: Record<Tone, string> = {
  dark: 'bg-ink text-canvas border border-ink shadow-clay hover:bg-ink-soft hover:border-ink-soft',
  sage: 'bg-sage-deep text-canvas border border-sage-deep shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-sage-ink hover:border-sage-ink',
  neutral:
    'bg-surface text-ink border border-line shadow-clay hover:border-line-strong hover:bg-surface-muted',
  outline:
    'bg-transparent text-ink border border-line-strong hover:bg-surface hover:border-ink/25',
  ghost: 'bg-transparent text-ink-soft border border-transparent hover:bg-surface-muted/70 hover:text-ink',
  destructive:
    'bg-clay-ink text-on-clay border border-clay-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-clay-deep hover:border-clay-deep',
};

/**
 * Sizes are deliberately >= 36px tall so every control clears the WCAG 2.2
 * 24x24px minimum target size with margin (2.5.8 Target Size Minimum).
 */
const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-[0.875rem]',
  lg: 'h-13 px-7 text-[0.9375rem]',
};

const iconOnlySizeStyles: Record<Size, string> = {
  sm: 'size-9 p-0',
  md: 'size-11 p-0',
  lg: 'size-13 p-0',
};

export interface ButtonStyleOptions {
  tone?: Tone;
  size?: Size;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export function buttonStyles({
  tone = 'dark',
  size = 'md',
  fullWidth,
  iconOnly,
}: ButtonStyleOptions = {}) {
  return cn(
    buttonBase,
    'rounded-pill',
    toneStyles[tone],
    iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
    fullWidth && 'w-full',
  );
}


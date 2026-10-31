import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Size, Tone } from '@/types/ui';
import { buttonStyles } from './buttonStyles';

export type { ButtonStyleOptions } from './buttonStyles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    tone = 'dark',
    size = 'md',
    fullWidth,
    loading = false,
    iconOnly = false,
    leadingIcon,
    trailingIcon,
    className,
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles({ tone, size, fullWidth, iconOnly }), className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        leadingIcon
      )}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});

/** Icon-only button with a required accessible label. */
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconOnly'> {
  label: string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, icon, tone = 'ghost', size = 'md', className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        tone={tone}
        size={size}
        iconOnly
        aria-label={label}
        title={label}
        className={className}
        {...props}
      >
        {icon}
      </Button>
    );
  },
);

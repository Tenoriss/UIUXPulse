import { forwardRef, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { buttonStyles, type ButtonStyleOptions } from './Button';

export interface LinkButtonProps extends LinkProps, ButtonStyleOptions {
  children: ReactNode;
}

/** Router-aware link that inherits the exact button appearance. */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    { tone, size, fullWidth, iconOnly, className, children, ...props },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={cn(buttonStyles({ tone, size, fullWidth, iconOnly }), className)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

export interface ExternalLinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    ButtonStyleOptions {
  children: ReactNode;
}

/** Anchor styled as a button, for outbound or mailto links. */
export const ExternalLinkButton = forwardRef<HTMLAnchorElement, ExternalLinkButtonProps>(
  function ExternalLinkButton(
    { tone, size, fullWidth, iconOnly, className, children, ...props },
    ref,
  ) {
    return (
      <a
        ref={ref}
        className={cn(buttonStyles({ tone, size, fullWidth, iconOnly }), className)}
        {...props}
      >
        {children}
      </a>
    );
  },
);

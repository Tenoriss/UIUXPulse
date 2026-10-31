import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Card — a quiet clay surface.
 * Deliberately only three variants so pages stay consistent.
 */
export type CardVariant = 'surface' | 'muted' | 'flush';

const variantStyles: Record<CardVariant, string> = {
  surface: 'clay-surface bg-surface border border-line',
  muted: 'clay-inset bg-surface-muted border border-line',
  flush: 'bg-transparent border border-line',
};

const CardContext = createContext<{ variant: CardVariant }>({ variant: 'surface' });

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Adds a soft lift + border shift on hover. Use only for clickable cards. */
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-9',
} as const;

export function Card({
  variant = 'surface',
  interactive = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={cn(
          'relative rounded-lg',
          variantStyles[variant],
          paddingStyles[padding],
          interactive &&
            'interactive-surface hover:-translate-y-0.5 hover:border-line-strong hover:shadow-clay-lg',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  as: Tag = 'h3',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return (
    <Tag className={cn('font-serif text-h4 leading-tight text-ink', className)} {...props}>
      {children}
    </Tag>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-[0.8125rem] leading-relaxed text-ink-soft', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-body text-ink-soft', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Eyebrow number label used in editorial card lists, e.g. "01". */
export function CardIndex({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('eyebrow text-ink-muted', className)}>{children}</span>;
}

export function useCardVariant() {
  return useContext(CardContext).variant;
}

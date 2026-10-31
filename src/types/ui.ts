import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Shared visual emphasis scale used by buttons, badges, and alerts. */
export type Tone =
  | 'neutral'
  | 'sage'
  | 'dark'
  | 'outline'
  | 'ghost'
  | 'destructive';

/** Semantic status used by badges and states. */
export type StatusTone = 'neutral' | 'sage' | 'taupe' | 'clay' | 'ochre';

export type Size = 'sm' | 'md' | 'lg';

export type ToastVariant = 'success' | 'info' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. `0` keeps the toast until dismissed. */
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastRecord extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
  /** `default` is a bordered panel; `bare` drops the frame for inline use. */
  variant?: 'default' | 'bare';
}

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
  disabled?: boolean;
}

export interface DropdownItem<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  /** Renders a separator above this item. */
  separated?: boolean;
  /** Trailing hint, e.g. a shortcut or status. */
  hint?: string;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
}

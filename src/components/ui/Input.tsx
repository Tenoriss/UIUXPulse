import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

export const fieldShell =
  'clay-inset w-full rounded-md border border-line bg-surface-sunken text-ink transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-editorial)] placeholder:text-ink-faint hover:border-line-strong focus:border-sage-deep disabled:cursor-not-allowed disabled:bg-surface-muted/50 disabled:text-ink-muted';

export const fieldFocus =
  'focus:outline-none focus-visible:border-sage focus-visible:ring-2 focus-visible:ring-sage/35 focus-visible:ring-offset-0';

export const fieldInvalid =
  'border-clay/60 bg-clay-soft/30 hover:border-clay/70 focus-visible:border-clay focus-visible:ring-clay/25';

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
  /** Id of the error paragraph, so the control can reference it. */
  errorId?: string;
  /** Id of the hint paragraph, so the control can reference it. */
  hintId?: string;
}

/** Shared label / hint / error scaffold for any form control. */
export function Field({
  label,
  hint,
  error,
  required,
  optionalLabel,
  className,
  children,
  htmlFor,
  errorId,
  hintId,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor={htmlFor}
            className="text-[0.8125rem] font-medium text-ink tracking-[-0.005em]"
          >
            {label}
            {required && <span className="ml-1 text-sage-deep">*</span>}
          </label>
          {optionalLabel && !required && (
            <span className="text-micro text-ink-muted">{optionalLabel}</span>
          )}
        </div>
      )}
      {children}
      {error ? (
        <p id={errorId} className="text-micro text-clay-ink" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-micro text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
  containerClassName?: string;
  fieldClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    optionalLabel,
    leadingIcon,
    trailingSlot,
    className,
    containerClassName,
    id,
    required,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [ariaDescribedBy, error ? errorId : hint ? hintId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      htmlFor={inputId}
      errorId={errorId}
      hintId={hintId}
      className={containerClassName}
    >
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldShell,
            fieldFocus,
            error && fieldInvalid,
            'h-11 px-3.5 text-body',
            leadingIcon ? 'pl-10' : undefined,
            trailingSlot ? 'pr-11' : undefined,
            className,
          )}
          {...props}
        />
        {trailingSlot && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailingSlot}</span>
        )}
      </div>
    </Field>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, optionalLabel, className, containerClassName, id, required, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      htmlFor={textareaId}
      className={containerClassName}
    >
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(
          fieldShell,
          fieldFocus,
          error && fieldInvalid,
          'min-h-28 resize-y px-3.5 py-3 text-body',
          className,
        )}
        {...props}
      />
    </Field>
  );
});

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <span className="relative flex items-center">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className="peer size-4 shrink-0 cursor-pointer appearance-none rounded-xs border border-line-strong bg-surface transition-colors duration-200 checked:border-sage-deep checked:bg-sage-deep checked:shadow-[0_0_0_3px_rgb(143_160_132_/_0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <path
            d="M1.5 6.2 4.4 9 10.5 2.6"
            fill="none"
            stroke="var(--color-canvas)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <label
        htmlFor={checkboxId}
        className="cursor-pointer select-none text-[0.8125rem] leading-[1.5] text-ink-soft"
      >
        {label}
      </label>
    </div>
  );
});

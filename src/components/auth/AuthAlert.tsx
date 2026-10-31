import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Form-level message.
 *
 * Field errors stay inline under their input; this is for problems that belong
 * to the whole form (wrong credentials, duplicate email) or for confirmations.
 * `role="alert"` makes screen readers announce it as soon as it appears.
 */
export function AuthAlert({
  tone = 'error',
  children,
  className,
}: {
  tone?: 'error' | 'success';
  children: ReactNode;
  className?: string;
}) {
  const Icon = tone === 'error' ? CircleAlert : CircleCheck;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2.5 rounded-md border px-3.5 py-3 text-[0.8125rem] leading-relaxed',
        tone === 'error'
          ? 'border-clay/35 bg-clay-soft text-clay-ink'
          : 'border-sage/40 bg-sage-wash text-sage-ink',
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

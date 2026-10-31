import { useEffect } from 'react';
import { Check, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';
import { useI18n } from '@/i18n';
import type { ToastRecord, ToastVariant } from '@/types/ui';

const variantMeta: Record<
  ToastVariant,
  { icon: typeof Check; accent: string; ring: string }
> = {
  success: { icon: Check, accent: 'text-sage-deep', ring: 'bg-sage-wash' },
  info: { icon: Info, accent: 'text-ink-soft', ring: 'bg-surface-muted' },
  error: { icon: TriangleAlert, accent: 'text-clay', ring: 'bg-clay-soft' },
};

function ToastItem({ record }: { record: ToastRecord }) {
  const { dismiss } = useToast();
  const { t } = useI18n();
  const meta = variantMeta[record.variant];
  const Icon = meta.icon;

  useEffect(() => {
    if (record.duration <= 0) return;
    const id = window.setTimeout(() => dismiss(record.id), record.duration);
    return () => window.clearTimeout(id);
  }, [record.id, record.duration, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-clay-lg animate-slide-in-right"
    >
      <span
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          meta.ring,
        )}
      >
        <Icon className={cn('size-3.5', meta.accent)} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1 space-y-0.5 pr-1">
        <p className="text-[0.8125rem] font-medium leading-snug text-ink">{record.title}</p>
        {record.description && (
          <p className="text-micro text-ink-muted">{record.description}</p>
        )}
        {record.action && (
          <button
            type="button"
            onClick={() => {
              record.action?.onClick();
              dismiss(record.id);
            }}
            className="mt-1.5 text-micro font-medium text-sage-deep underline decoration-sage/60 underline-offset-2 transition-colors hover:text-sage-ink"
          >
            {record.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => dismiss(record.id)}
        aria-label={t('toast.dismiss')}
        className="-mr-1 -mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-surface-muted hover:text-ink"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Rendered once by `ToastProvider`; consumes the toast queue. */
export function ToastViewport() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2.5 p-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-88 sm:items-end sm:p-0">
      {toasts.map((record) => (
        <ToastItem key={record.id} record={record} />
      ))}
    </div>
  );
}

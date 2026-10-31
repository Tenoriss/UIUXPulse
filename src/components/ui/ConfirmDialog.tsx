import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  /** Irreversible-action label. Never the primary colour of the app. */
  confirmLabel: string;
  cancelLabel: string;
  /** Extra context above the actions, e.g. a warning about related records. */
  warning?: ReactNode;
  loading?: boolean;
  className?: string;
}

/**
 * Destructive confirmation.
 *
 * Deliberately a focused modal rather than a dropdown action: deletion is the
 * only irreversible operation in the workspace, so it gets a sentence of
 * context, an explicit named target, and a confirm button that is styled as a
 * warning (`clay`) instead of the ordinary dark primary.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  warning,
  loading = false,
  className,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => undefined : onClose}
      title={title}
      size="sm"
      dismissible={!loading}
      className={className}
      footer={
        <>
          <Button tone="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button tone="destructive" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description && <p className="text-body text-ink-soft">{description}</p>}

      {warning && (
        <div
          className={cn(
            'mt-4 flex gap-2.5 rounded-md border border-clay/30 bg-clay-soft px-3.5 py-3',
            'text-[0.8125rem] leading-relaxed text-clay-ink',
          )}
        >
          {warning}
        </div>
      )}
    </Modal>
  );
}

import { Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';

export const PROGRESS_STEPS = ['prepare', 'pages', 'criteria', 'finalize'] as const;
export type ProgressStep = (typeof PROGRESS_STEPS)[number];

export interface ProgressPanelProps {
  /** Index of the step currently running; `PROGRESS_STEPS.length` means done. */
  current: number;
  failed?: boolean;
}

/**
 * Simulated progress for the save.
 *
 * The four labels describe what the app is actually doing with the record —
 * assembling the config, registering pages, resolving criteria, writing the
 * record. None of them claim a website was visited, and the panel says so.
 */
export function ProgressPanel({ current, failed = false }: ProgressPanelProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-serif text-h3 text-ink">{t('evaluation.progress.title')}</h2>
          <Badge tone="taupe">{t('evaluation.progress.demoBadge')}</Badge>
        </div>
        <p className="text-body text-ink-soft">{t('evaluation.progress.lead')}</p>
      </div>

      <ol className="flex flex-col divide-y divide-line border-y border-line">
        {PROGRESS_STEPS.map((step, index) => {
          const isDone = index < current;
          const isActive = index === current && !failed;

          return (
            <li
              key={step}
              className="flex items-center gap-3 py-3.5"
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border',
                  isDone
                    ? 'border-sage/45 bg-sage-wash text-sage-ink'
                    : isActive
                      ? 'border-sage-deep bg-sage-deep/10 text-sage-ink'
                      : 'border-line text-ink-faint',
                )}
                aria-hidden="true"
              >
                {isDone ? (
                  <Check className="size-3" strokeWidth={2.6} />
                ) : isActive ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <span className="text-[0.625rem] tabular-nums">{index + 1}</span>
                )}
              </span>

              <span
                className={cn(
                  'min-w-0 flex-1 text-[0.8125rem]',
                  isDone || isActive ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {t(`evaluation.progress.steps.${step}`)}
              </span>

              <span className="shrink-0 text-micro text-ink-faint">
                {isDone
                  ? t('evaluation.progress.done')
                  : isActive
                    ? t('evaluation.progress.active')
                    : t('evaluation.progress.pending')}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="text-micro text-ink-muted">{t('evaluation.demoNotice')}</p>
    </div>
  );
}

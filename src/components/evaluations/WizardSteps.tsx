import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';

/** The four configuration steps, in order. `review` is the last one. */
export const WIZARD_STEPS = ['website', 'pages', 'settings', 'review'] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

export interface WizardStepsProps {
  current: WizardStep;
  /** Steps that have been completed, so the rail can mark them done. */
  completed?: WizardStep[];
}

/**
 * Step rail.
 *
 * A numbered, hairline-separated row rather than a progress bar: it reads like
 * an index, matches the editorial language of the rest of the product, and
 * wraps to two lines on a phone instead of overflowing.
 */
export function WizardSteps({ current, completed = [] }: WizardStepsProps) {
  const { t } = useI18n();
  const currentIndex = WIZARD_STEPS.indexOf(current);

  return (
    <nav aria-label={t('evaluation.flowLabel')}>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 sm:flex sm:items-center sm:gap-0">
        {WIZARD_STEPS.map((step, index) => {
          const isCurrent = step === current;
          const isDone = completed.includes(step) || index < currentIndex;

          return (
            <li
              key={step}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex min-w-0 items-center gap-2.5 sm:flex-1 sm:border-l sm:border-line sm:pl-4 sm:first:border-l-0 sm:first:pl-0',
              )}
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] tabular-nums transition-colors',
                  isCurrent
                    ? 'border-sage-deep bg-sage-deep text-canvas'
                    : isDone
                      ? 'border-sage/45 bg-sage-wash text-sage-ink'
                      : 'border-line text-ink-faint',
                )}
                aria-hidden="true"
              >
                {isDone && !isCurrent ? <Check className="size-3" strokeWidth={2.4} /> : index + 1}
              </span>
              <span
                className={cn(
                  'truncate text-[0.8125rem]',
                  isCurrent ? 'font-medium text-ink' : isDone ? 'text-ink-soft' : 'text-ink-muted',
                )}
              >
                {t(`evaluation.steps.${step}`)}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-micro text-ink-muted">
        {t('evaluation.stepLabel', { current: String(currentIndex + 1), total: String(WIZARD_STEPS.length) })}
      </p>
    </nav>
  );
}

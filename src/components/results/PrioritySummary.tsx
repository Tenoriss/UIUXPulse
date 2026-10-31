import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import { priorityOrder, type ResultPriority } from '@/services/evaluation-results.types';

const tone: Record<ResultPriority, { bar: string; value: string }> = {
  critical: { bar: 'bg-clay', value: 'text-clay-ink' },
  high: { bar: 'bg-ochre', value: 'text-ochre-ink' },
  medium: { bar: 'bg-taupe', value: 'text-ink-soft' },
  low: { bar: 'bg-ink-faint', value: 'text-ink-muted' },
};

/**
 * Finding counts by priority.
 *
 * Counts come straight from the finding list, so this panel can never disagree
 * with the audit page. An empty priority reads "0" in the muted tone rather
 * than being hidden — a missing row would make the totals look wrong.
 */
export function PrioritySummary({
  counts,
  total,
}: {
  counts: Record<ResultPriority, number>;
  total: number;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-h4 text-ink">{t('results.priority.title')}</h2>
        <p className="text-micro text-ink-muted">{t('results.priority.lead')}</p>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
        {priorityOrder.map((priority) => {
          const count = counts[priority];
          const share = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={priority} className="bg-surface px-4 py-3.5">
              <p className="text-micro uppercase tracking-[0.1em] text-ink-muted">
                {t(`results.priority.${priority}`)}
              </p>
              <p className={cn('mt-2 font-serif text-h3 leading-none tabular-nums', count === 0 ? 'text-ink-faint' : tone[priority].value)}>
                {count}
              </p>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-pill bg-surface-muted">
                <div className={cn('h-full rounded-pill', tone[priority].bar)} style={{ width: `${share}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

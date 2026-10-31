import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import type { ResultPriority } from '@/services/evaluation-results.types';
import type { StatusTone } from '@/types/ui';

/**
 * Priority is semantic, not decorative: the tone scale runs hot → cool so a
 * critical finding is recognisable at a glance in a long list.
 */
export const priorityTone: Record<ResultPriority, StatusTone> = {
  critical: 'clay',
  high: 'ochre',
  medium: 'taupe',
  low: 'neutral',
};

const toneStyles: Record<StatusTone, string> = {
  clay: 'border-clay/40 bg-clay-soft text-clay-ink',
  ochre: 'border-ochre/35 bg-ochre-soft text-ochre-ink',
  taupe: 'border-taupe/50 bg-taupe-soft/60 text-ink-soft',
  neutral: 'border-line bg-surface text-ink-soft',
  sage: 'border-sage/45 bg-sage-wash text-sage-ink',
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: ResultPriority;
  className?: string;
}) {
  const { t } = useI18n();
  const tone = priorityTone[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2 py-0.5 text-[0.6875rem] font-medium',
        toneStyles[tone],
        className,
      )}
    >
      {t(`results.priority.${priority}`)}
    </span>
  );
}

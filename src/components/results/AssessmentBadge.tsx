import { Ruler, ScanEye, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import type { AssessmentType } from '@/services/evaluation-results.types';

const icons: Record<AssessmentType, LucideIcon> = {
  measured: Ruler,
  heuristic: ScanEye,
  manual: UserRound,
};

/**
 * How a finding would be obtained.
 *
 * Stated alongside every finding so a heuristic guess is never mistaken for a
 * measurement — and so `manual` visibly admits that a person is required.
 */
export function AssessmentBadge({
  assessment,
  className,
}: {
  assessment: AssessmentType;
  className?: string;
}) {
  const { t } = useI18n();
  const Icon = icons[assessment];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-2 py-0.5 text-[0.6875rem] text-ink-soft',
        className,
      )}
      title={t(`results.assessment.${assessment}Note`)}
    >
      <Icon className="size-3 shrink-0 text-ink-faint" strokeWidth={1.8} aria-hidden="true" />
      {t(`results.assessment.${assessment}`)}
    </span>
  );
}

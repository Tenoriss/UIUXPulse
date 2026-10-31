import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy } from '@/content/demoResults';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import type { CategoryResult } from '@/services/evaluation-results.types';

export interface CategoryScoresProps {
  results: CategoryResult[];
  /** Where the "n findings" link points, carrying the category pre-filter. */
  auditHref: (category: string) => string;
}

/**
 * The six category scores.
 *
 * Names, summaries, and the per-category note all come from existing content —
 * `criteria.ts` for the public naming and `demoResults.ts` for the demo remark —
 * so a category is never described twice in two different words.
 */
export function CategoryScores({ results, auditHref }: CategoryScoresProps) {
  const { t, locale } = useI18n();
  const copy = criteriaContent[locale];
  const notes = demoResultsCopy[locale].categoryNotes;

  return (
    <ul className="flex flex-col divide-y divide-line border-y border-line">
      {results.map((result) => {
        const content = copy[result.category];
        const score = Math.max(0, Math.min(100, result.score));

        return (
          <li key={result.category} className="flex flex-col gap-3 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[0.9375rem] font-medium text-ink">{content.name}</h3>
              <div className="flex items-center gap-3">
                {result.findingCount > 0 ? (
                  <Link
                    to={auditHref(result.category)}
                    className="inline-flex items-center gap-1 text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                  >
                    {result.findingCount === 1
                      ? t('results.categories.findingsLinkOne')
                      : t('results.categories.findingsLink', { count: String(result.findingCount) })}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="text-micro text-ink-faint">{t('results.categories.noFindings')}</span>
                )}
                <span
                  className={cn(
                    'font-serif text-[1.25rem] leading-none tabular-nums',
                    score >= 80 ? 'text-sage-ink' : score >= 60 ? 'text-ink' : 'text-clay-ink',
                  )}
                  aria-label={t('results.categories.scoreLabel', { name: content.name })}
                >
                  {score}
                </span>
              </div>
            </div>

            {/* Progress indicator: a plain bar, not a second gauge. */}
            <div
              className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-muted"
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('results.categories.scoreLabel', { name: content.name })}
            >
              <div
                className={cn(
                  'h-full rounded-pill',
                  score >= 80 ? 'bg-sage-deep' : score >= 60 ? 'bg-taupe' : 'bg-clay',
                )}
                style={{ width: `${score}%` }}
              />
            </div>

            <p className="text-micro text-ink-muted">{notes[result.category]}</p>
          </li>
        );
      })}
    </ul>
  );
}

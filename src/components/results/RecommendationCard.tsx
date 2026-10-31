import { Link } from 'react-router-dom';
import { ArrowUpRight, Target, TrendingUp, Wrench } from 'lucide-react';
import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy } from '@/content/demoResults';
import { useI18n } from '@/i18n';
import { PriorityBadge } from './PriorityBadge';
import type { Finding, Recommendation } from '@/services/evaluation-results.types';

export interface RecommendationCardProps {
  recommendation: Recommendation;
  /** Findings this recommendation answers, already resolved by the page. */
  findings: Finding[];
  auditHref: (findingId: string) => string;
}

/**
 * One recommendation.
 *
 * Every recommendation names the finding that produced it and links back to it,
 * so a suggestion can never appear without the observation behind it. There is
 * deliberately no "apply" or "fix" control: UIUXPulse does not touch the site.
 */
export function RecommendationCard({ recommendation, findings, auditHref }: RecommendationCardProps) {
  const { t, locale } = useI18n();
  const copy = demoResultsCopy[locale].recommendations[recommendation.copyId];
  const categoryName = criteriaContent[locale][recommendation.category]?.name ?? recommendation.category;

  if (!copy) return null;

  return (
    <article
      id={recommendation.id}
      className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={recommendation.priority} />
          <span className="text-micro text-ink-muted">{categoryName}</span>
          <span className="ml-auto rounded-pill border border-line px-2 py-0.5 text-[0.6875rem] text-ink-faint">
            {t('results.recommendations.exampleBadge')}
          </span>
        </div>
        <h3 className="font-serif text-h4 text-ink">{copy.title}</h3>
        <p className="text-body text-ink-soft">{copy.explanation}</p>
      </div>

      <dl className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="flex items-center gap-1.5 text-micro uppercase tracking-[0.1em] text-ink-muted">
            <Wrench className="size-3 shrink-0" aria-hidden="true" />
            {t('results.recommendations.suggested')}
          </dt>
          <dd className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">{copy.improvement}</dd>
        </div>
        <div className="min-w-0">
          <dt className="flex items-center gap-1.5 text-micro uppercase tracking-[0.1em] text-ink-muted">
            <TrendingUp className="size-3 shrink-0" aria-hidden="true" />
            {t('results.recommendations.benefit')}
          </dt>
          <dd className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">{copy.benefit}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <p className="flex items-center gap-1.5 text-micro uppercase tracking-[0.1em] text-ink-muted">
          <Target className="size-3 shrink-0" aria-hidden="true" />
          {t('results.recommendations.relatedFinding')}
        </p>
        {findings.length === 0 ? (
          <p className="text-micro text-ink-faint">{t('results.recommendations.relatedFindingMissing')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {findings.map((finding) => {
              const findingCopy = demoResultsCopy[locale].findings[finding.copyId];
              return (
                <li key={finding.id} className="min-w-0">
                  <Link
                    to={auditHref(finding.id)}
                    className="inline-flex max-w-full items-center gap-1.5 text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                  >
                    <span className="truncate">{findingCopy?.title ?? finding.id}</span>
                    <ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}

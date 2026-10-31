import { Link } from 'react-router-dom';
import { ChevronDown, Globe, Monitor } from 'lucide-react';
import { criteriaContent } from '@/content/criteria';
import { demoResultsCopy } from '@/content/demoResults';
import { useI18n } from '@/i18n';
import { EvidenceViewer } from './EvidenceViewer';
import { PriorityBadge } from './PriorityBadge';
import { AssessmentBadge } from './AssessmentBadge';
import type { Finding } from '@/services/evaluation-results.types';

export interface FindingCardProps {
  finding: Finding;
  /** Recommendation this finding belongs to, if any, for the cross-link. */
  recommendationId?: string;
  recommendationsHref: string;
  defaultOpen?: boolean;
}

/**
 * One finding.
 *
 * Collapsed by default so a ten-finding audit stays scannable; the summary row
 * carries everything needed to triage (title, category, priority, assessment,
 * page), and expanding reveals the description, the "why it matters" line, and
 * the evidence placeholder.
 */
export function FindingCard({
  finding,
  recommendationId,
  recommendationsHref,
  defaultOpen = false,
}: FindingCardProps) {
  const { t, locale } = useI18n();
  const copy = demoResultsCopy[locale].findings[finding.copyId];
  const categoryName = criteriaContent[locale][finding.category]?.name ?? finding.category;

  if (!copy) return null;

  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-line bg-surface open:border-line-strong"
      id={finding.id}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45 sm:gap-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className="mt-1 hidden shrink-0 sm:block">
          <PriorityBadge priority={finding.priority} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-medium text-ink">{copy.title}</span>

          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-micro text-ink-muted">
            <span className="sm:hidden">
              <PriorityBadge priority={finding.priority} />
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="size-3 shrink-0" aria-hidden="true" />
              {categoryName}
            </span>
            <AssessmentBadge assessment={finding.assessment} />
            <span className="max-w-full truncate font-mono text-[0.6875rem] text-ink-faint">
              {finding.page}
            </span>
          </span>
        </span>

        <ChevronDown
          className="mt-1 size-4 shrink-0 text-ink-faint transition-transform duration-300 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="flex flex-col gap-4 border-t border-line px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <p className="text-body text-ink-soft">{copy.description}</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <p className="text-micro uppercase tracking-[0.1em] text-ink-muted">
              {t('results.audit.finding.whyItMatters')}
            </p>
            <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">
              {copy.whyItMatters}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-micro uppercase tracking-[0.1em] text-ink-muted">
              {t('results.audit.finding.evidence')}
            </p>
            <p className="mt-1.5 text-[0.8125rem] leading-[1.6] text-ink-soft">{copy.evidenceNote}</p>
          </div>
        </div>

        <EvidenceViewer
          evidence={finding.evidence}
          page={finding.page}
          viewport={finding.viewport}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-micro text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Monitor className="size-3 shrink-0" aria-hidden="true" />
            {finding.viewport
              ? t(`evaluation.viewports.${finding.viewport}`)
              : t('results.audit.finding.allViewports')}
          </span>
          <span className="rounded-pill border border-line px-2 py-0.5">
            {t('results.audit.finding.exampleBadge')}
          </span>
          {recommendationId && (
            <Link
              to={`${recommendationsHref}#${recommendationId}`}
              className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              {t('results.recommendations.title')}
            </Link>
          )}
        </div>
      </div>
    </details>
  );
}

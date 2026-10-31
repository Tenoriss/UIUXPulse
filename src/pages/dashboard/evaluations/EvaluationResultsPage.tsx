import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Card } from '@/components/ui';
import { CategoryScores } from '@/components/results/CategoryScores';
import { PrioritySummary } from '@/components/results/PrioritySummary';
import { ScoreGauge } from '@/components/results/ScoreGauge';
import { demoResultsCopy } from '@/content/demoResults';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getEvaluation } from '@/services/evaluation.service';
import { pageCoverage } from '@/services/evaluation-results.service';
import type { EvaluationResults } from '@/services/evaluation-results.types';
import { ResultsLayout } from './ResultsLayout';

/**
 * Results dashboard.
 *
 * Only reachable with `?preview=demo` open, so every number on this page is
 * framed as fixture data before it is read. The overall score is derived from
 * the six category scores rather than stored, so the headline can always be
 * explained by the rows beneath it.
 */
export function EvaluationResultsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();

  return (
    <ResultsLayout
      section="results"
      title={t('results.tabs.results')}
      description={`${t('results.score.explain')}`}
    >
      {({ results }) => <ResultsBody results={results} evaluationId={id} ownerId={user?.id} />}
    </ResultsLayout>
  );
}

function ResultsBody({
  results,
  evaluationId,
  ownerId,
}: {
  results: EvaluationResults;
  evaluationId: string;
  ownerId: string | undefined;
}) {
  const { t, locale } = useI18n();
  const copy = demoResultsCopy[locale];
  const record = getEvaluation(ownerId, evaluationId);

  const criticalFindings = useMemo(
    () => results.findings.filter((finding) => finding.priority === 'critical'),
    [results.findings],
  );

  const coverage = useMemo(
    () => (record ? pageCoverage(record, results) : []),
    [record, results],
  );

  const auditHref = (category: string) =>
    `${routes.evaluations}/${evaluationId}/audit?preview=demo&category=${category}`;

  return (
    <div className="flex flex-col gap-10">
      {/* --------------------------------------------------------- Score */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card padding="lg">
          <ScoreGauge score={results.overallScore} isDemo />
        </Card>

        <PrioritySummary
          counts={results.priorityCounts}
          total={results.findings.length}
        />
      </div>

      {/* ---------------------------------------------------- Categories */}
      <section aria-labelledby="category-scores" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="category-scores" className="font-serif text-h4 text-ink">
            {t('results.categories.title')}
          </h2>
          <p className="text-micro text-ink-muted">{t('results.categories.lead')}</p>
        </div>

        <CategoryScores results={results.categoryResults} auditHref={auditHref} />
        <p className="text-micro text-ink-muted">{t('results.categories.weightsNote')}</p>
      </section>

      {/* ------------------------------------------------------- Summary */}
      <section aria-labelledby="evaluation-summary" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 id="evaluation-summary" className="font-serif text-h4 text-ink">
              {t('results.summary.title')}
            </h2>
            <p className="text-micro text-ink-muted">{t('results.summary.lead')}</p>
          </div>
          <Badge tone="ochre">{t('results.demoLabel')}</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SummaryList title={t('results.summary.strengths')} items={copy.summary.strengths} tone="sage" />

          <SummaryList
            title={t('results.summary.improvements')}
            items={copy.summary.improvements}
            tone="clay"
          />

          <SummaryList
            title={t('results.summary.important')}
            items={
              criticalFindings.length > 0
                ? criticalFindings.map(
                    (finding) => copy.findings[finding.copyId]?.title ?? finding.copyId,
                  )
                : [t('results.summary.importantEmpty')]
            }
            tone="ochre"
          />

          <SummaryList
            title={t('results.summary.nextActions')}
            items={copy.summary.nextActions}
            tone="neutral"
          />
        </div>
      </section>

      {/* ------------------------------------------------------ Coverage */}
      <section aria-labelledby="page-coverage" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="page-coverage" className="font-serif text-h4 text-ink">
            {t('results.coverage.title')}
          </h2>
          <p className="max-w-2xl text-micro text-ink-muted">{t('results.coverage.lead')}</p>
        </div>

        {coverage.length === 0 ? (
          <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-micro text-ink-muted">
            {t('results.coverage.emptyBody')}
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-muted/40 text-micro uppercase tracking-[0.08em] text-ink-muted">
                  <th scope="col" className="w-1/2 px-4 py-2.5 font-medium">
                    {t('results.coverage.page')}
                  </th>
                  <th scope="col" className="px-2 py-2.5 font-medium">
                    {t('results.coverage.viewports')}
                  </th>
                  <th scope="col" className="w-20 px-2 py-2.5 text-right font-medium">
                    {t('results.coverage.findings')}
                  </th>
                  <th scope="col" className="w-28 px-4 py-2.5 text-right font-medium">
                    {t('results.coverage.evidence')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {coverage.map((row) => (
                  <tr key={row.page} className="text-[0.8125rem]">
                    <td className="min-w-0 px-4 py-3">
                      <span className="block truncate font-mono text-[0.75rem] text-ink-soft" title={row.page}>
                        {row.page}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="flex flex-wrap gap-1">
                        {row.viewports.map((viewport) => (
                          <span
                            key={viewport}
                            className="rounded-pill border border-line px-1.5 py-0.5 text-[0.625rem] text-ink-muted"
                          >
                            {t(`evaluation.viewports.${viewport}`)}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums text-ink-soft">
                      {row.findingCount}
                    </td>
                    <td className="px-4 py-3 text-right text-micro text-ink-faint">
                      {row.hasEvidence
                        ? t('results.coverage.evidence')
                        : t('results.coverage.evidenceMissing')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-micro text-ink-muted">
          {t('evaluation.demoNotice')}{' '}
          <Link
            to={`${routes.evaluations}/${evaluationId}/recommendations?preview=demo`}
            className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            {t('results.nav.recommendations')}
          </Link>
        </p>
      </section>
    </div>
  );
}

const toneStyles = {
  sage: 'border-sage/35 bg-sage-wash/40',
  clay: 'border-clay/30 bg-clay-soft/40',
  ochre: 'border-ochre/30 bg-ochre-soft/40',
  neutral: 'border-line bg-surface-muted/40',
} as const;

function SummaryList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: keyof typeof toneStyles;
}) {
  return (
    <Card variant="flush" padding="none" className={toneStyles[tone]}>
      <div className="border-b border-line/60 px-4 py-3">
        <h3 className="text-[0.8125rem] font-medium text-ink">{title}</h3>
      </div>
      <ul className="flex flex-col gap-2 px-4 py-3">
        {items.map((item, index) => (
          <li key={`${tone}-${index}`} className="flex gap-2.5 text-[0.8125rem] leading-[1.6] text-ink-soft">
            <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

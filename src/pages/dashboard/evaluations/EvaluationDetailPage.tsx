import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FlaskConical, ShieldAlert } from 'lucide-react';
import { Badge, Card, EmptyState, LinkButton } from '@/components/ui';
import { EvaluationSummary } from '@/components/evaluations/EvaluationSummary';
import { statusTone } from '@/components/evaluations/EvaluationSummary';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getEvaluation } from '@/services/evaluation.service';
import { hasRealResults } from '@/services/evaluation-results.service';
import { getWebsite } from '@/services/website.service';

/**
 * Evaluation overview.
 *
 * The saved configuration, read back verbatim, plus one honest statement about
 * what does not exist yet. The results sections are offered as a clearly
 * labelled demo preview rather than as this record's own output.
 */
export function EvaluationDetailPage() {
  const { t, formatDate } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();

  const record = useMemo(() => getEvaluation(user?.id, id), [user?.id, id]);
  const website = useMemo(
    () => (record?.websiteId ? getWebsite(user?.id, record.websiteId) : null),
    [record?.websiteId, user?.id],
  );

  if (!record) {
    return (
      <EmptyState
        title={t('evaluation.detail.notFoundTitle')}
        description={t('evaluation.detail.notFoundBody')}
        action={
          <LinkButton to={routes.evaluations} tone="dark" size="sm">
            {t('evaluation.detail.notFoundAction')}
          </LinkButton>
        }
      />
    );
  }

  const analysed = hasRealResults(record);
  const base = `${routes.evaluations}/${record.id}`;

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={routes.evaluations}
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('evaluation.detail.back')}
      </Link>

      {/* ------------------------------------------------------------ Head */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="eyebrow">{t('evaluation.eyebrow')}</p>
            <Badge tone={statusTone[record.status]} dot>
              {t(`evaluation.status.${record.status}`)}
            </Badge>
          </div>
          <h1 className="truncate font-serif text-h2 text-ink">{record.website}</h1>
          <p className="mt-1 truncate text-[0.8125rem] text-ink-muted">{record.url}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {website && (
            <LinkButton to={`/app/websites/${website.id}`} tone="neutral" size="sm">
              {t('evaluation.detail.openWebsite')}
            </LinkButton>
          )}
          <LinkButton to={routes.evaluationNew} tone="dark" size="sm">
            {t('evaluation.detail.startAnother')}
          </LinkButton>
        </div>
      </div>

      {/* ------------------------------------------------------ Analysis */}
      <Card variant="muted" padding="lg">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
            <ShieldAlert className="size-4 text-sage-deep" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-h4 text-ink">{t('results.notAnalysedTitle')}</h2>
            <p className="mt-1.5 max-w-2xl text-body text-ink-soft">{t('results.notAnalysedBody')}</p>
            <p className="mt-2 max-w-2xl text-micro text-ink-muted">{t('results.notAnalysedNote')}</p>
          </div>
        </div>
      </Card>

      {/* --------------------------------------------------- Result links */}
      <section className="flex flex-col gap-3" aria-labelledby="results-links">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="results-links" className="font-serif text-h4 text-ink">
            {t('results.eyebrow')}
          </h2>
          <span className="text-micro text-ink-muted">{t('results.demoCtaHint')}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(['results', 'audit', 'recommendations'] as const).map((section) => (
            <Link
              key={section}
              to={analysed ? `${base}/${section}` : `${base}/${section}?preview=demo`}
              className="group flex flex-col gap-2 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-surface-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-[0.9375rem] font-medium text-ink">{t(`results.nav.${section}`)}</span>
                <FlaskConical className="size-3.5 shrink-0 text-ochre-ink" aria-hidden="true" />
              </span>
              <span className="inline-flex w-fit items-center rounded-pill border border-ochre/35 bg-ochre-soft px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.1em] text-ochre-ink">
                {t('results.demoLabel')}
              </span>
              <span className="text-micro text-ink-muted">{t('results.demoCtaHint')}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ Record */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-h4 text-ink">{t('results.configurationKept')}</h2>
          <span className="text-micro tabular-nums text-ink-muted">
            {t('evaluation.review.pagesCount', { count: String(record.pages.length) })} ·{' '}
            {formatDate(record.createdAt)}
          </span>
        </div>

        {!record.websiteId && (
          <p className="rounded-md border border-line bg-surface-muted/40 px-4 py-3 text-micro text-ink-muted">
            {t('evaluation.detail.removedWebsiteNote')}
          </p>
        )}

        <EvaluationSummary record={record} />
      </section>
    </div>
  );
}

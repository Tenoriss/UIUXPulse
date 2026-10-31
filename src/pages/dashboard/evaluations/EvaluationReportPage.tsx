import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, FileText, FlaskConical } from 'lucide-react';
import { Badge, Button, EmptyState, LinkButton } from '@/components/ui';
import { ReportDocumentView } from '@/components/reports/ReportDocumentView';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getReport } from '@/services/report.service';
import { downloadReportPdf } from '@/services/report-generator';

/**
 * Report preview.
 *
 * Two modes share one page because the difference is data, not layout:
 *
 * - the default is the **configuration report**, available for any saved
 *   evaluation and containing no scores or findings;
 * - `?preview=demo` gives the **demo results report**, which is the only report
 *   that carries scores — and which is refused unless the demo preview is
 *   explicitly requested in the URL.
 *
 * The record is read, never written: generating or downloading a report cannot
 * change an evaluation.
 */
export function EvaluationReportPage() {
  const { t, locale, formatDate } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const wantDemo = params.get('preview') === 'demo';

  const report = useMemo(
    () => getReport(user?.id, id, locale, wantDemo ? 'demo' : 'configuration', wantDemo),
    [user?.id, id, locale, wantDemo],
  );

  if (!report) {
    return (
      <div className="flex flex-col gap-8">
        <Link
          to={routes.reports}
          className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {t('report.error.back')}
        </Link>
        <EmptyState
          title={t('report.error.title')}
          description={
            wantDemo ? t('report.error.demoNotAuthorised') : t('report.error.body')
          }
          action={
            <LinkButton to={routes.reports} tone="dark" size="sm">
              {t('report.error.back')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  const onDownload = () => {
    setState('working');
    try {
      downloadReportPdf(report);
      setState('done');
      window.setTimeout(() => setState('idle'), 2400);
    } catch {
      setState('error');
    }
  };

  const demoHref = `${routes.evaluations}/${id}/report?preview=demo`;
  const configurationHref = `${routes.evaluations}/${id}/report`;

  return (
    <div className="flex flex-col gap-7">
      <Link
        to={`${routes.evaluations}/${id}`}
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('report.preview.back')}
      </Link>

      {/* --------------------------------------------------------- Header */}
      <div className="flex flex-col gap-4 border-b border-line pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="eyebrow">{t('report.eyebrow')}</p>
              <Badge tone={report.meta.isDemo ? 'clay' : 'sage'} dot>
                {report.meta.typeLabel}
              </Badge>
              {report.meta.isDemo && <Badge tone="ochre">{t('results.demoLabel')}</Badge>}
            </div>
            <h1 className="font-serif text-h2 text-ink">{t('report.preview.title')}</h1>
            <p className="mt-1.5 max-w-2xl text-body text-ink-soft">{t('report.preview.lead')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              tone="dark"
              onClick={onDownload}
              loading={state === 'working'}
              leadingIcon={
                state === 'done' ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Download className="size-4" aria-hidden="true" />
                )
              }
            >
              {report.meta.isDemo ? t('report.preview.downloadDemo') : t('report.preview.download')}
            </Button>
            <LinkButton to={`${routes.evaluations}/${id}`} tone="neutral">
              {t('report.preview.back')}
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-micro text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3 shrink-0" aria-hidden="true" />
            <span className="font-mono text-[0.6875rem]">{report.meta.fileName}</span>
          </span>
          <span>{t('report.preview.generated', { date: formatDate(report.meta.generatedAt) })}</span>
        </div>

        {state === 'error' && (
          <p role="alert" className="text-micro text-clay-ink">
            {t('report.preview.error')}
          </p>
        )}

        {/* Mode switch. The demo report is opt-in on every visit. */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={configurationHref}
            aria-current={!wantDemo ? 'page' : undefined}
            className={
              !wantDemo
                ? 'rounded-pill border border-sage/50 bg-sage-wash px-3 py-1 text-[0.75rem] text-sage-ink'
                : 'rounded-pill border border-line bg-surface px-3 py-1 text-[0.75rem] text-ink-soft transition-colors hover:border-line-strong hover:text-ink'
            }
          >
            {t('report.type.configuration')}
          </Link>
          <Link
            to={demoHref}
            aria-current={wantDemo ? 'page' : undefined}
            className={
              wantDemo
                ? 'rounded-pill border border-clay/45 bg-clay-soft px-3 py-1 text-[0.75rem] text-clay-ink'
                : 'rounded-pill border border-line bg-surface px-3 py-1 text-[0.75rem] text-ink-soft transition-colors hover:border-line-strong hover:text-ink'
            }
          >
            <span className="inline-flex items-center gap-1.5">
              <FlaskConical className="size-3" aria-hidden="true" />
              {t('report.type.demo')}
            </span>
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------- Document */}
      <div className="rounded-lg bg-canvas/60 px-0 py-2 sm:px-4 sm:py-6">
        <ReportDocumentView report={report} />
      </div>

      <p className="text-micro text-ink-muted">{t('report.pdf.newTab')}</p>
    </div>
  );
}

import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { LinkButton } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { EvaluationSummary } from '@/components/evaluations/EvaluationSummary';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getEvaluation } from '@/services/evaluation.service';
import { getWebsite } from '@/services/website.service';

/**
 * One saved evaluation configuration.
 *
 * There is no score panel and no findings list, because the record carries
 * neither. What it does show is exactly what was saved, including a clear note
 * when the website it was configured for has since been deleted.
 */
export function EvaluationDetailPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();

  // Ownership check: the read is scoped to this account, so another user's id
  // is indistinguishable from a missing one.
  const record = getEvaluation(user?.id, id);
  const website = record?.websiteId ? getWebsite(user?.id, record.websiteId) : null;

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

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={routes.evaluations}
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('evaluation.detail.back')}
      </Link>

      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{t('evaluation.eyebrow')}</p>
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
            <Plus className="size-3.5" aria-hidden="true" />
            {t('evaluation.detail.startAnother')}
          </LinkButton>
        </div>
      </div>

      {!record.websiteId && (
        <p className="rounded-md border border-line bg-surface-muted/40 px-4 py-3 text-micro text-ink-muted">
          {t('evaluation.detail.removedWebsiteNote')}
        </p>
      )}

      <EvaluationSummary record={record} />
    </div>
  );
}

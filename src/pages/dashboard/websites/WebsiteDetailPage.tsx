import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Globe, PenLine, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, CardTitle, EmptyState, LinkButton } from '@/components/ui';
import { DeleteWebsiteDialog } from '@/components/websites/DeleteWebsiteDialog';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getWebsite } from '@/services/website.service';
import { listEvaluationsForWebsite } from '@/services/evaluation.service';
import { RecentEvaluations } from '../RecentEvaluations';

export function WebsiteDetailPage() {
  const { t, formatDate } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const website = getWebsite(user?.id, id);
  const evaluations = website ? listEvaluationsForWebsite(user?.id, website.id) : [];

  if (!website) {
    // A page needs an h1 even when there is nothing to show, or the heading
    // list a screen reader announces starts one level too deep.
    return (
      <div className="flex flex-col gap-8">
        <h1 className="font-serif text-h2 text-ink">{t('websites.detail.notFoundTitle')}</h1>
        <EmptyState
          title={t('websites.detail.notFoundTitle')}
          description={t('websites.detail.notFoundBody')}
          action={
            <LinkButton to={routes.websites} tone="dark" size="sm">
              {t('websites.detail.notFoundAction')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        to="/app/websites"
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('websites.detail.back')}
      </Link>

      {/* ------------------------------------------------------------ Head */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface-muted text-ink-soft">
            <Globe className="size-4.5" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate font-serif text-h2 text-ink">{website.name}</h1>
              <Badge tone={website.status === 'ready' ? 'sage' : 'neutral'} dot>
                {t(`websites.statuses.${website.status}`)}
              </Badge>
            </div>
            <a
              href={website.url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex max-w-full items-center gap-1.5 truncate text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              <span className="truncate">{website.url}</span>
              <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LinkButton
            to={`${routes.evaluationNew}?website=${website.id}`}
            tone="dark"
            size="sm"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            {t('websites.detail.startEvaluation')}
          </LinkButton>
          <LinkButton to={`/app/websites/${website.id}/edit`} tone="neutral" size="sm">
            <PenLine className="size-3.5" aria-hidden="true" />
            {t('websites.detail.editWebsite')}
          </LinkButton>
          <Button
            tone="ghost"
            size="sm"
            leadingIcon={<Trash2 className="size-3.5" aria-hidden="true" />}
            onClick={() => setDeleteOpen(true)}
          >
            {t('websites.detail.deleteWebsite')}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* ---------------------------------------------------- History */}
        <section aria-labelledby="site-history" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="site-history" className="font-serif text-h4 text-ink">
              {t('websites.detail.historyTitle')}
            </h2>
            <Badge tone="neutral">
              {t('websites.detail.evaluationsTotal')}: {evaluations.length}
            </Badge>
          </div>

          {evaluations.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t('websites.detail.historyEmptyTitle')}
              description={t('websites.detail.historyEmptyBody')}
              action={
                <LinkButton
                  to={`${routes.evaluationNew}?website=${website.id}`}
                  tone="neutral"
                  size="sm"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  {t('websites.detail.startEvaluation')}
                </LinkButton>
              }
            />
          ) : (
            <RecentEvaluations evaluations={evaluations} />
          )}
        </section>

        {/* ------------------------------------------------------- Meta */}
        <aside className="flex flex-col gap-4">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>{t('websites.detail.about')}</CardTitle>
            </CardHeader>
            <p className="mt-4 text-body text-ink-soft">
              {website.description || (
                <span className="text-ink-muted">{t('websites.detail.noDescription')}</span>
              )}
            </p>
          </Card>

          <Card variant="muted" padding="lg">
            <p className="eyebrow mb-4">{t('websites.detail.meta')}</p>
            <dl className="flex flex-col gap-3 text-[0.8125rem]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('websites.detail.domain')}</dt>
                <dd className="min-w-0 truncate text-ink-soft">{website.domain}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('websites.detail.added')}</dt>
                <dd className="tabular-nums text-ink-soft">{formatDate(website.createdAt)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-ink-muted">{t('websites.detail.updated')}</dt>
                <dd className="tabular-nums text-ink-soft">{formatDate(website.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>

      <DeleteWebsiteDialog
        website={deleteOpen ? website : null}
        relatedCount={evaluations.length}
        onClose={() => setDeleteOpen(false)}
        redirectTo="/app/websites"
      />
    </div>
  );
}

import { useMemo, type ReactNode } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import { Badge, EmptyState, LinkButton } from '@/components/ui';
import { DemoBanner } from '@/components/results/DemoBanner';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getEvaluation } from '@/services/evaluation.service';
import { getEvaluationResults } from '@/services/evaluation-results.service';
import { cn } from '@/lib/cn';

/**
 * Shared shell for the results section.
 *
 * Responsibilities, in order: prove ownership, prove the record exists, then
 * decide between "not analysed" and the demo preview. Child pages only ever
 * render when a demo preview is explicitly open (`?preview=demo`), so a
 * configuration-only record can never present a score as its own.
 */
export interface ResultsLayoutProps {
  /** Which section tab is active. */
  section: 'results' | 'audit' | 'recommendations';
  title: string;
  description?: string;
  children: (context: {
    results: NonNullable<ReturnType<typeof getEvaluationResults>>;
    demoOpen: boolean;
  }) => ReactNode;
}

const sections = [
  { key: 'overview', path: '' },
  { key: 'results', path: '/results' },
  { key: 'audit', path: '/audit' },
  { key: 'recommendations', path: '/recommendations' },
] as const;

export function ResultsLayout({ section, title, description, children }: ResultsLayoutProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { id = '' } = useParams();
  const [params, setParams] = useSearchParams();

  const record = useMemo(() => getEvaluation(user?.id, id), [user?.id, id]);
  const results = useMemo(() => getEvaluationResults(user?.id, id), [user?.id, id]);
  const demoOpen = params.get('preview') === 'demo';

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

  // A real result set would render without asking. Until one exists, the
  // section requires an explicit opt-in to the demo preview.
  if (!demoOpen) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink />
        <SectionTabs evaluationId={id} active={section} demoOpen={false} disabled />
        <EmptyState
          icon={FlaskConical}
          title={t('results.unavailable.title')}
          description={t('results.unavailable.body')}
          action={
            <LinkButton to={`${routes.evaluations}/${id}/results?preview=demo`} tone="dark" size="sm">
              <FlaskConical className="size-3.5" aria-hidden="true" />
              {t('results.unavailable.demoAction')}
            </LinkButton>
          }
          secondaryAction={
            <LinkButton to={`${routes.evaluations}/${id}`} tone="ghost" size="sm">
              {t('results.unavailable.backAction')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  if (!results) {
    return <Navigate to={routes.evaluations} replace />;
  }

  const closeDemo = () => {
    const next = new URLSearchParams(params);
    next.delete('preview');
    setParams(next, { replace: true });
  };

  return (
    <div className="flex flex-col gap-7">
      <BackLink />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{t('results.eyebrow')}</p>
          <Badge tone="ochre" dot>
            {t('results.demoLabel')}
          </Badge>
          <Badge tone="neutral">{t('evaluation.status.created')}</Badge>
        </div>
        <h1 className="font-serif text-h2 text-ink">{title}</h1>
        <p className="max-w-2xl text-body text-ink-soft">
          {description ?? `${record.website} · ${record.url}`}
        </p>
        <button
          type="button"
          onClick={closeDemo}
          className="inline-flex w-fit items-center gap-1.5 text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
        >
          {t('results.demoExit')}
        </button>
      </div>

      <DemoBanner />

      <SectionTabs evaluationId={id} active={section} demoOpen />

      {children({ results, demoOpen })}

      <p className="border-t border-line pt-4 text-micro text-ink-muted">{t('results.audit.demoFooter')}</p>
    </div>
  );
}

function BackLink() {
  const { t } = useI18n();
  const { id = '' } = useParams();

  return (
    <Link
      to={`${routes.evaluations}/${id}`}
      className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {t('results.nav.overview')}
    </Link>
  );
}

export interface SectionTabsProps {
  evaluationId: string;
  active: 'results' | 'audit' | 'recommendations';
  demoOpen: boolean;
  disabled?: boolean;
}

/**
 * Section navigation.
 *
 * With no preview open the tabs render as text with a "not available" title
 * rather than dead links — an active-looking control that does nothing is worse
 * than one that admits it is pending.
 */
export function SectionTabs({ evaluationId, active, demoOpen, disabled = false }: SectionTabsProps) {
  const { t } = useI18n();
  const base = `${routes.evaluations}/${evaluationId}`;
  const query = demoOpen ? '?preview=demo' : '';

  return (
    <nav aria-label={t('results.nav.label')} className="border-y border-line">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 py-2.5">
        {sections.map((item) => {
          const href = `${base}${item.path}${query}`;
          const isActive = item.key === active;
          const label = t(`results.nav.${item.key}`);

          if (disabled) {
            return (
              <li key={item.key}>
                <span
                  title={t('results.unavailable.title')}
                  aria-disabled="true"
                  className="inline-flex items-center gap-1.5 py-1 text-[0.8125rem] text-ink-faint"
                >
                  {label}
                  <span className="rounded-pill border border-line px-1.5 text-[0.625rem] uppercase tracking-[0.08em]">
                    {t('common.soon')}
                  </span>
                </span>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <Link
                to={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex py-1 text-[0.8125rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
                  isActive
                    ? 'font-medium text-ink underline decoration-sage-deep decoration-2 underline-offset-[6px]'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

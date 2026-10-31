import { Globe, Link2, ShieldAlert } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { criteriaContent } from '@/content/criteria';
import { useI18n } from '@/i18n';
import { pagePathLabel, viewportOptions } from '@/services/evaluation.constants';
import type {
  EvaluationCategoryId,
  EvaluationViewportId,
  WebsiteRecord,
} from '@/services/workspace.types';

export interface ReviewStepProps {
  website: WebsiteRecord | null;
  pages: string[];
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
  onEditStep: (step: 'website' | 'pages' | 'settings') => void;
}

/**
 * Step 4 — read back the configuration before it is saved.
 *
 * Every row links back to the step that owns it, so reviewing is also editing.
 * Nothing here estimates duration or promises an analysis: the only claim made
 * is what will be stored.
 */
export function ReviewStep({ website, pages, categories, viewports, onEditStep }: ReviewStepProps) {
  const { t, locale } = useI18n();
  const copy = criteriaContent[locale];

  const viewportLabel = (id: EvaluationViewportId) => {
    const option = viewportOptions.find((item) => item.id === id);
    const name = t(`evaluation.viewports.${id}`);
    return option ? `${name} · ${option.width}px` : name;
  };

  const editLink = (label: string, step: 'website' | 'pages' | 'settings') => (
    <Button type="button" tone="ghost" size="sm" onClick={() => onEditStep(step)}>
      {label}
    </Button>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-h3 text-ink">{t('evaluation.review.title')}</h2>
        <p className="text-body text-ink-soft">{t('evaluation.review.lead')}</p>
      </div>

      <dl className="divide-y divide-line border-y border-line">
        {/* ------------------------------------------------------- Website */}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.review.websiteLabel')}
          </dt>
          <dd className="flex min-w-0 flex-col items-start gap-1 sm:max-w-[60%] sm:items-end sm:text-right">
            <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
              <Globe className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
              {website?.name ?? '—'}
            </span>
            <span className="max-w-full truncate text-micro text-ink-muted">{website?.url}</span>
            {editLink(t('evaluation.review.editWebsite'), 'website')}
          </dd>
        </div>

        {/* --------------------------------------------------------- Pages */}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.review.pagesLabel')}
            <span className="ml-2 normal-case tracking-normal text-ink-faint">
              {t('evaluation.review.pagesCount', { count: String(pages.length) })}
            </span>
          </dt>
          <dd className="flex min-w-0 flex-col items-start gap-1 sm:max-w-[60%] sm:items-end">
            <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:justify-end">
              {pages.map((page) => (
                <li
                  key={page}
                  className="flex items-center gap-1.5 text-[0.8125rem] text-ink-soft"
                  title={page}
                >
                  <Link2 className="size-3 shrink-0 text-ink-faint" aria-hidden="true" />
                  <span className="break-all font-mono text-[0.75rem]">{pagePathLabel(page)}</span>
                </li>
              ))}
            </ul>
            {editLink(t('evaluation.review.editPages'), 'pages')}
          </dd>
        </div>

        {/* ---------------------------------------------------- Categories */}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.review.categoriesLabel')}
          </dt>
          <dd className="flex min-w-0 flex-col items-start gap-2 sm:max-w-[60%] sm:items-end">
            <ul className="flex flex-wrap gap-1.5 sm:justify-end">
              {categories.map((id) => (
                <li key={id}>
                  <Badge tone="sage">{copy[id].name}</Badge>
                </li>
              ))}
            </ul>
            {editLink(t('evaluation.review.editSettings'), 'settings')}
          </dd>
        </div>

        {/* ----------------------------------------------------- Viewports */}
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
          <dt className="text-micro uppercase tracking-[0.12em] text-ink-muted">
            {t('evaluation.review.viewportsLabel')}
          </dt>
          <dd className="flex flex-wrap gap-1.5 sm:justify-end">
            {viewports.map((id) => (
              <Badge key={id} tone="neutral">
                {viewportLabel(id)}
              </Badge>
            ))}
          </dd>
        </div>
      </dl>

      {/* ---------------------------------------------------- Summary band */}
      <Card variant="muted" padding="lg">
        <p className="eyebrow mb-3">{t('evaluation.review.summaryLabel')}</p>
        <p className="font-serif text-h4 text-ink">
          {t('evaluation.review.summary', {
            pages: String(pages.length),
            categories: String(categories.length),
            viewports: String(viewports.length),
          })}
        </p>
        <p className="mt-3 flex items-start gap-2 text-micro text-ink-muted">
          <ShieldAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          <span>{t('evaluation.review.notice')}</span>
        </p>
      </Card>
    </div>
  );
}

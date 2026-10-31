import { Check, Globe, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import type { WebsiteRecord } from '@/services/workspace.types';
import { EmptyState } from '@/components/ui';

export interface WebsiteStepProps {
  websites: WebsiteRecord[];
  selectedId: string;
  onSelect: (websiteId: string) => void;
  error?: string | null;
}

/**
 * Step 1 — pick a registered website.
 *
 * Only the signed-in account's sites are passed in, so this component never has
 * to think about ownership. Selection is a radio group: one site per evaluation.
 */
export function WebsiteStep({ websites, selectedId, onSelect, error }: WebsiteStepProps) {
  const { t, formatDate } = useI18n();

  if (websites.length === 0) {
    return (
      <EmptyState
        icon={Globe}
        title={t('evaluation.website.emptyTitle')}
        description={t('evaluation.website.emptyBody')}
        action={
          <LinkButton to={routes.websites} tone="dark" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            {t('evaluation.website.emptyAction')}
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-h3 text-ink">{t('evaluation.website.title')}</h2>
        <p className="text-body text-ink-soft">{t('evaluation.website.lead')}</p>
      </div>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="sr-only">{t('evaluation.website.title')}</legend>

        {websites.map((website) => {
          const checked = website.id === selectedId;

          return (
            <label
              key={website.id}
              className={cn(
                'group flex cursor-pointer items-start gap-4 rounded-lg border bg-surface p-4 transition-colors sm:items-center',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-deep/45',
                checked
                  ? 'border-sage/55 bg-sage-wash/40'
                  : 'border-line hover:border-line-strong',
              )}
            >
              <input
                type="radio"
                name="website"
                value={website.id}
                checked={checked}
                onChange={() => onSelect(website.id)}
                className="peer sr-only"
              />

              <span
                className={cn(
                  'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border sm:mt-0',
                  checked
                    ? 'border-sage/50 bg-sage-wash text-sage-ink'
                    : 'border-line bg-surface-muted text-ink-soft',
                )}
                aria-hidden="true"
              >
                <Globe className="size-4" strokeWidth={1.6} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9375rem] font-medium text-ink">
                  {website.name}
                </span>
                <span className="mt-0.5 block truncate text-micro text-ink-muted">
                  {website.url}
                </span>
                <span className="mt-1 block text-micro tabular-nums text-ink-faint">
                  {t('websites.added')} {formatDate(website.createdAt)}
                </span>
              </span>

              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center self-center rounded-full border transition-colors',
                  checked
                    ? 'border-sage-deep bg-sage-deep text-canvas'
                    : 'border-line-strong bg-transparent text-transparent',
                )}
                aria-hidden="true"
              >
                <Check className="size-3" strokeWidth={2.6} />
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-micro text-ink-muted">
          {t('evaluation.website.countLabel', { count: String(websites.length) })}
        </p>
        <Link
          to={routes.websites}
          className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
        >
          {t('dashboard.nav.websites')}
        </Link>
      </div>

      {error && (
        <p role="alert" className="text-micro text-clay-ink">
          {error}
        </p>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Globe, PenLine, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import type { WebsiteRecord } from '@/services/workspace.types';

export interface WebsiteCardProps {
  website: WebsiteRecord;
  /** Real count from evaluation records — 0 until something is evaluated. */
  evaluationCount: number;
  onDelete: (website: WebsiteRecord) => void;
}

/**
 * One row in the website list.
 *
 * The whole card links to the detail page; Edit and Delete sit inside it as
 * separate controls, so the card is not a nested interactive element — the
 * primary link is a stretched overlay behind them.
 */
export function WebsiteCard({ website, evaluationCount, onDelete }: WebsiteCardProps) {
  const { t, formatDate } = useI18n();

  return (
    <li className="group relative overflow-hidden rounded-lg border border-line bg-surface transition-colors focus-within:border-line-strong hover:border-line-strong">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        {/* Favicon-or-icon mark */}
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface-muted text-ink-soft">
          <Globe className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <Link
              to={`/app/websites/${website.id}`}
              className="truncate text-[0.9375rem] font-medium text-ink after:absolute after:inset-0 focus-visible:outline-none"
            >
              {website.name}
            </Link>
            <Badge tone={website.status === 'ready' ? 'sage' : 'neutral'} dot>
              {t(`websites.statuses.${website.status}`)}
            </Badge>
          </div>

          <p className="mt-1 truncate text-micro text-ink-muted">{website.url}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-micro text-ink-muted">
            <span className="tabular-nums">
              {t('websites.added')} {formatDate(website.createdAt)}
            </span>
            <span className="tabular-nums">
              {t('websites.evaluationsLabel')}: {evaluationCount}
            </span>
          </div>
        </div>

        {/* Actions sit above the stretched link. */}
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 self-start sm:self-auto">
          <Link
            to={`/app/websites/${website.id}/edit`}
            aria-label={t('websites.editSr', { name: website.name })}
            className="flex size-9 items-center justify-center rounded-pill border border-line bg-surface text-ink-soft transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
          >
            <PenLine className="size-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(website)}
            aria-label={t('websites.deleteSr', { name: website.name })}
            className={cn(
              'flex size-9 items-center justify-center rounded-pill border border-line bg-surface text-ink-soft',
              'transition-colors hover:border-clay/40 hover:bg-clay-soft hover:text-clay-ink',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/40',
            )}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

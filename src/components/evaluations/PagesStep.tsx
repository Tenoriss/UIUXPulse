import { useState, type FormEvent } from 'react';
import { Info, Link2, Plus, Sparkles, X } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import {
  checkPage,
  demoPagesFor,
  MAX_PAGES,
  pagePathLabel,
  type PageErrorCode,
} from '@/services/evaluation.constants';
import type { WebsiteRecord } from '@/services/workspace.types';

export interface PagesStepProps {
  website: WebsiteRecord;
  pages: string[];
  onChange: (pages: string[]) => void;
  error?: string | null;
}

type Mode = 'manual' | 'demo';

/**
 * Step 2 — choose the pages this evaluation covers.
 *
 * Manual entry validates against the website's own host. The second tab offers
 * example paths built from the site's origin; they are demo data and are
 * labelled as such, because nothing here is crawled, fetched, or parsed.
 */
export function PagesStep({ website, pages, onChange, error }: PagesStepProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('manual');
  const [value, setValue] = useState('');
  const [pageError, setPageError] = useState<PageErrorCode | null>(null);

  const atLimit = pages.length >= MAX_PAGES;
  const suggestions = demoPagesFor(website.url);
  const allSuggestionsAdded =
    suggestions.length > 0 && suggestions.every((page) => pages.includes(page));

  const addPage = (event: FormEvent) => {
    event.preventDefault();
    if (atLimit) {
      setPageError('tooManyPages');
      return;
    }

    const { page, error: nextError } = checkPage(value, website.url, pages);
    if (nextError || !page) {
      setPageError(nextError ?? 'invalidPage');
      return;
    }

    onChange([...pages, page]);
    setValue('');
    setPageError(null);
  };

  const toggleSuggestion = (page: string) => {
    if (pages.includes(page)) {
      onChange(pages.filter((item) => item !== page));
      setPageError(null);
      return;
    }
    if (atLimit) {
      setPageError('tooManyPages');
      return;
    }
    onChange([...pages, page]);
    setPageError(null);
  };

  const addAllSuggestions = () => {
    const next = [...pages];
    for (const page of suggestions) {
      if (next.length >= MAX_PAGES) break;
      if (!next.includes(page)) next.push(page);
    }
    onChange(next);
    setPageError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-h3 text-ink">{t('evaluation.pages.title')}</h2>
        <p className="text-body text-ink-soft">
          {t('evaluation.pages.lead', { max: String(MAX_PAGES) })}
        </p>
      </div>

      {/* ------------------------------------------------------------ Mode */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-micro uppercase tracking-[0.12em] text-ink-muted">
          {t('evaluation.pages.modeLabel')}
        </span>
        {(['manual', 'demo'] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => setMode(option)}
            className={cn(
              'rounded-pill border px-3 py-1 text-[0.75rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
              mode === option
                ? 'border-sage/50 bg-sage-wash text-sage-ink'
                : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
            )}
          >
            {option === 'manual'
              ? t('evaluation.pages.manualTab')
              : t('evaluation.pages.demoTab')}
          </button>
        ))}
      </div>

      {mode === 'manual' ? (
        <form onSubmit={addPage} noValidate className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <Input
                label={t('evaluation.pages.manualLabel')}
                placeholder={t('evaluation.pages.manualPlaceholder')}
                hint={t('evaluation.pages.manualHint', { domain: website.domain })}
                leadingIcon={<Link2 className="size-4" aria-hidden="true" />}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setPageError(null);
                }}
                error={pageError ? t(`evaluation.pages.errors.${pageError}`, { max: String(MAX_PAGES) }) : undefined}
                type="url"
                inputMode="url"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                disabled={atLimit}
              />
            </div>
            <Button
              type="submit"
              tone="neutral"
              size="md"
              leadingIcon={<Plus className="size-3.5" aria-hidden="true" />}
              disabled={atLimit}
              className="sm:mt-[1.875rem]"
            >
              {t('evaluation.pages.add')}
            </Button>
          </div>

          {atLimit && (
            <p className="text-micro text-ink-muted">
              {t('evaluation.pages.limitReached', { max: String(MAX_PAGES) })}
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface-muted/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[0.875rem] font-medium text-ink">
              {t('evaluation.pages.demoTitle')}
            </h3>
            <Badge tone="taupe">{t('evaluation.pages.demoBadge')}</Badge>
          </div>

          <p className="flex items-start gap-2 text-micro text-ink-muted">
            <Info className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            <span>{t('evaluation.pages.demoBody')}</span>
          </p>

          <ul className="flex flex-wrap gap-2">
            {suggestions.map((page) => {
              const added = pages.includes(page);
              return (
                <li key={page}>
                  <button
                    type="button"
                    aria-pressed={added}
                    onClick={() => toggleSuggestion(page)}
                    disabled={!added && atLimit}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[0.75rem] transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
                      'disabled:cursor-not-allowed disabled:opacity-40',
                      added
                        ? 'border-sage/50 bg-sage-wash text-sage-ink'
                        : 'border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink',
                    )}
                  >
                    <span className="tabular-nums opacity-60">{pagePathLabel(page)}</span>
                    {added ? (
                      <X className="size-3" aria-hidden="true" />
                    ) : (
                      <Plus className="size-3" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              tone="ghost"
              size="sm"
              leadingIcon={<Sparkles className="size-3.5" aria-hidden="true" />}
              onClick={addAllSuggestions}
              disabled={allSuggestionsAdded || atLimit}
            >
              {t('evaluation.pages.demoAddAll')}
            </Button>
            {pageError && (
              <p role="alert" className="text-micro text-clay-ink">
                {t(`evaluation.pages.errors.${pageError}`, { max: String(MAX_PAGES) })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- Selection */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[0.875rem] font-medium text-ink">
            {t('evaluation.pages.selectedTitle')}
          </h3>
          <p className={cn('text-micro tabular-nums', atLimit ? 'text-clay-ink' : 'text-ink-muted')}>
            {t('evaluation.pages.selectedCount', {
              count: String(pages.length),
              max: String(MAX_PAGES),
            })}
          </p>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center">
            <p className="text-[0.8125rem] text-ink-soft">{t('evaluation.pages.emptySelection')}</p>
            <p className="mt-1 text-micro text-ink-muted">
              {t('evaluation.pages.emptySelectionBody')}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {pages.map((page) => (
              <li key={page} className="flex items-center gap-3 py-2.5">
                <Link2 className="size-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.8125rem] text-ink">
                    {pagePathLabel(page)}
                  </span>
                  <span className="block truncate text-micro text-ink-faint">{page}</span>
                </span>
                <button
                  type="button"
                  onClick={() => onChange(pages.filter((item) => item !== page))}
                  aria-label={t('evaluation.pages.remove', { name: pagePathLabel(page) })}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="text-micro text-clay-ink">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

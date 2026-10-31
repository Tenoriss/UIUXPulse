import { Check, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { criteriaContent } from '@/content/criteria';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';
import {
  categoryIds,
  viewportOptions,
} from '@/services/evaluation.constants';
import type { EvaluationCategoryId, EvaluationViewportId } from '@/services/workspace.types';

const viewportIcons: Record<EvaluationViewportId, LucideIcon> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export interface SettingsStepProps {
  categories: EvaluationCategoryId[];
  viewports: EvaluationViewportId[];
  onToggleCategory: (id: EvaluationCategoryId) => void;
  onSetCategories: (ids: EvaluationCategoryId[]) => void;
  onToggleViewport: (id: EvaluationViewportId) => void;
  categoryError?: string | null;
  viewportError?: string | null;
}

/**
 * Step 3 — categories and viewports.
 *
 * Category names and summaries come from the public criteria content, which is
 * already bilingual, so the wizard describes a category exactly the way the
 * marketing site does. Neither list implies that anything will be measured:
 * these are the settings a future analysis would read.
 */
export function SettingsStep({
  categories,
  viewports,
  onToggleCategory,
  onSetCategories,
  onToggleViewport,
  categoryError,
  viewportError,
}: SettingsStepProps) {
  const { t, locale } = useI18n();
  const copy = criteriaContent[locale];
  const allSelected = categories.length === categoryIds.length;

  return (
    <div className="flex flex-col gap-10">
      {/* ------------------------------------------------------ Categories */}
      <section className="flex flex-col gap-4" aria-labelledby="wizard-categories">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 id="wizard-categories" className="font-serif text-h3 text-ink">
              {t('evaluation.categories.title')}
            </h2>
            <p className="max-w-xl text-body text-ink-soft">{t('evaluation.categories.lead')}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              tone="ghost"
              size="sm"
              onClick={() => onSetCategories(allSelected ? [] : [...categoryIds])}
            >
              {allSelected ? t('evaluation.categories.deselectAll') : t('evaluation.categories.selectAll')}
            </Button>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {categoryIds.map((id, index) => {
            const checked = categories.includes(id);
            const content = copy[id];

            return (
              <li key={id}>
                <label
                  className={cn(
                    'flex h-full cursor-pointer items-start gap-3.5 rounded-lg border bg-surface p-4 transition-colors',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-deep/45',
                    checked ? 'border-sage/55 bg-sage-wash/40' : 'border-line hover:border-line-strong',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-xs border transition-colors',
                      checked
                        ? 'border-sage-deep bg-sage-deep text-canvas'
                        : 'border-line-strong bg-surface text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2">
                      <span className="text-micro tabular-nums text-ink-faint">
                        0{index + 1}
                      </span>
                      <span className="text-[0.875rem] font-medium text-ink">{content.name}</span>
                    </span>
                    <span className="mt-1 block text-micro leading-[1.55] text-ink-muted">
                      {content.summary}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-micro tabular-nums text-ink-muted">
            {t('evaluation.categories.selectedCount', {
              count: String(categories.length),
              total: String(categoryIds.length),
            })}
          </p>
          {categoryError && (
            <p role="alert" className="text-micro text-clay-ink">
              {categoryError}
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- Viewports */}
      <section className="flex flex-col gap-4" aria-labelledby="wizard-viewports">
        <div className="flex flex-col gap-1">
          <h2 id="wizard-viewports" className="font-serif text-h3 text-ink">
            {t('evaluation.viewports.title')}
          </h2>
          <p className="max-w-2xl text-body text-ink-soft">{t('evaluation.viewports.lead')}</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {viewportOptions.map((option) => {
            const Icon = viewportIcons[option.id];
            const checked = viewports.includes(option.id);

            return (
              <li key={option.id}>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border bg-surface p-4 transition-colors',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-deep/45',
                    checked ? 'border-sage/55 bg-sage-wash/40' : 'border-line hover:border-line-strong',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleViewport(option.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-md border',
                      checked
                        ? 'border-sage/50 bg-sage-wash text-sage-ink'
                        : 'border-line bg-surface-muted text-ink-soft',
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="size-4" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.875rem] font-medium text-ink">
                      {t(`evaluation.viewports.${option.id}`)}
                    </span>
                    <span className="block text-micro tabular-nums text-ink-muted">
                      {option.width}px
                    </span>
                  </span>
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-xs border',
                      checked
                        ? 'border-sage-deep bg-sage-deep text-canvas'
                        : 'border-line-strong text-transparent',
                    )}
                    aria-hidden="true"
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="taupe">{t('evaluation.progress.demoBadge')}</Badge>
          <p className="text-micro text-ink-muted">{t('evaluation.viewports.demoNote')}</p>
        </div>
        {viewportError && (
          <p role="alert" className="text-micro text-clay-ink">
            {viewportError}
          </p>
        )}
      </section>
    </div>
  );
}

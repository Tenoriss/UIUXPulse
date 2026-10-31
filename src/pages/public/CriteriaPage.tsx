import { Link } from 'react-router-dom';
import {
  Accessibility,
  ArrowUpRight,
  Compass,
  LayoutGrid,
  MonitorSmartphone,
  Palette,
  Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ClosingCta, PageIntro } from '@/components/shared/PageIntro';
import { SectionLabel } from '@/components/shared/Editorial';
import { Badge } from '@/components/ui';
import { useI18n } from '@/i18n';
import { routes } from '@/config/site';
import {
  criteriaContent,
  criterionOrder,
  type CriterionKey,
} from '@/content/criteria';

const icons: Record<CriterionKey, LucideIcon> = {
  visualConsistency: Palette,
  typography: Type,
  layout: LayoutGrid,
  usability: Compass,
  responsiveness: MonitorSmartphone,
  accessibility: Accessibility,
};

/** Small tracked label used above each list inside a category. */
function ColumnLabel({ children }: { children: string }) {
  return <p className="eyebrow mb-4">{children}</p>;
}

export function CriteriaPage() {
  const { t, locale } = useI18n();
  const content = criteriaContent[locale];

  return (
    <>
      <PageIntro
        eyebrow={t('criteria.eyebrow')}
        meta="06"
        title={t('criteria.title')}
        description={t('criteria.lede')}
      />

      {/* ------------------------------------------------------- Index ---- */}
      <Container>
        <SectionLabel label={t('criteria.indexLabel')} index="06" />

        <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
          {criterionOrder.map((key, index) => (
            <li key={key} className="border-b border-line">
              <a
                href={`#${key}`}
                className="group flex items-baseline gap-4 py-5 transition-colors hover:text-ink"
              >
                <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
                  0{index + 1}
                </span>
                <span className="font-serif text-h4 text-ink transition-colors group-hover:text-sage-ink">
                  {content[key].name}
                </span>
                <ArrowUpRight
                  className="ml-auto size-3.5 shrink-0 text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-2xl text-micro leading-relaxed text-ink-muted">
          {t('criteria.disclaimer')}
        </p>
      </Container>

      {/* ---------------------------------------------------- Categories --- */}
      <Container className="mt-section">
        <SectionLabel label={t('criteria.detailLabel')} index="01/06" />

        <div className="mt-2">
          {criterionOrder.map((key, index) => {
            const item = content[key];
            const Icon = icons[key];

            return (
              <article
                key={key}
                id={key}
                className="scroll-mt-24 border-b border-line py-12 first:pt-10 sm:py-14"
              >
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  {/* Heading column */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full border border-line bg-surface-muted/70 text-ink-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                        <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
                        0{index + 1}
                      </span>
                    </div>

                    <h2 className="mt-5 font-serif text-h2 text-ink">{item.name}</h2>
                    <p className="mt-3 max-w-sm text-lead leading-snug text-ink-soft">
                      {item.summary}
                    </p>

                    <div className="mt-8 flex flex-col gap-6 border-t border-line pt-6">
                      <div>
                        <ColumnLabel>{t('criteria.whatLabel')}</ColumnLabel>
                        <p className="max-w-md text-body text-ink-soft">{item.what}</p>
                      </div>
                      <div>
                        <ColumnLabel>{t('criteria.whyLabel')}</ColumnLabel>
                        <p className="max-w-md text-body text-ink-soft">{item.why}</p>
                      </div>
                    </div>
                  </div>

                  {/* Examples column */}
                  <div className="flex flex-col gap-8 lg:pt-1">
                    <div className="rounded-lg border border-line bg-surface/60 p-5 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="eyebrow">{t('criteria.problemsLabel')}</p>
                        <Badge tone="clay">{t('criteria.exampleBadge')}</Badge>
                      </div>
                      <ul className="flex flex-col gap-3">
                        {item.problems.map((entry) => (
                          <li key={entry} className="flex gap-3 text-body text-ink-soft">
                            <span
                              className="mt-[0.6em] size-1 shrink-0 rounded-full bg-clay/70"
                              aria-hidden="true"
                            />
                            {entry}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-line bg-surface/60 p-5 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="eyebrow">{t('criteria.recommendationsLabel')}</p>
                        <Badge tone="sage">{t('criteria.exampleBadge')}</Badge>
                      </div>
                      <ul className="flex flex-col gap-3">
                        {item.recommendations.map((entry) => (
                          <li key={entry} className="flex gap-3 text-body text-ink-soft">
                            <span
                              className="mt-[0.6em] size-1 shrink-0 rounded-full bg-sage-deep"
                              aria-hidden="true"
                            />
                            {entry}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            to={routes.howItWorks}
            className="group inline-flex items-center gap-2 text-[0.875rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
          >
            {t('nav.howItWorks')}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            to={routes.about}
            className="text-[0.875rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            {t('nav.about')}
          </Link>
        </div>
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

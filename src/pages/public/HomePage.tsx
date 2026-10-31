import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesColumn,
  Eye,
  Gauge,
  Layers,
  ListChecks,
  ScanEye,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Badge } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

const principleIcons = [ScanEye, ListChecks, Gauge] as const;
const scopeIcons = [ChartNoAxesColumn, Eye, Layers, ShieldCheck] as const;
const flowKeys = ['submit', 'select', 'receive'] as const;
const principleKeys = ['observe', 'explain', 'prioritise'] as const;
const scopeKeys = ['scores', 'findings', 'evidence', 'recommendations'] as const;

export function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <Container className="pt-10 pb-6 sm:pt-16">
        <div className="flex items-center gap-3">
          <Badge tone="sage" dot>
            {t('home.available')}
          </Badge>
          <span className="hidden text-micro text-ink-faint sm:inline">
            {t('common.previewNotice')}
          </span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <h1 className="font-serif text-display text-ink">
              {t('home.heroTitle')}{' '}
              <em className="italic text-sage-deep">{t('home.heroTitleAccent')}</em>{' '}
              {t('home.heroTitleRest')}
            </h1>

            <div className="mt-9 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lead text-ink-soft">{t('home.heroLead')}</p>
              <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
                <Link
                  to={routes.signUp}
                  className="group inline-flex items-center justify-center gap-2 rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-medium text-canvas transition-colors duration-300 hover:bg-ink-soft"
                >
                  {t('home.heroPrimary')}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to={routes.howItWorks}
                  className="group inline-flex items-center justify-center gap-1.5 px-1 py-2 text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  {t('home.heroSecondary')}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <figure className="relative">
            <div className="overflow-hidden rounded-xl border border-line bg-surface-muted shadow-clay">
              <img
                src="/images/hero-still-life.jpg"
                alt={t('home.heroImageAlt')}
                width={1408}
                height={768}
                loading="eager"
                className="h-56 w-full object-cover sm:h-72 lg:h-80"
              />
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-micro text-ink-faint">
              <span>{t('home.heroNote')}</span>
              <span className="tabular-nums">01 / 03</span>
            </figcaption>
          </figure>
        </div>
      </Container>

      {/* ------------------------------------------------------------- Marquee */}
      <div className="mt-10 overflow-hidden border-y border-line py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-10 font-serif text-xl text-ink-faint"
            >
              {t('home.marquee')}
            </span>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------- Principles */}
      <Container className="mt-24">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow border-b border-line pb-4">{t('home.principlesEyebrow')}</p>
            <h2 className="mt-6 font-serif text-h2 text-ink">{t('home.principlesTitle')}</h2>
            <p className="mt-5 max-w-sm text-body text-ink-soft">{t('home.principlesLead')}</p>
          </div>

          <ul className="flex flex-col">
            {principleKeys.map((key, index) => {
              const Icon = principleIcons[index];
              return (
                <li
                  key={key}
                  className="group grid grid-cols-[auto_1fr] gap-5 border-b border-line py-8 first:border-t first:pt-8"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-line bg-surface text-sage-deep transition-colors duration-300 group-hover:border-sage/50">
                    <Icon className="size-4" strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-h4 text-ink">
                        {t(`home.principles.${key}.title`)}
                      </h3>
                      <span className="text-micro tabular-nums text-ink-faint">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-2 max-w-md text-body text-ink-soft">
                      {t(`home.principles.${key}.body`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      {/* ----------------------------------------------------------------- Flow */}
      <Container className="mt-24">
        <SectionHeader
          eyebrow={t('home.flowEyebrow')}
          index="03"
          title={t('home.flowTitle')}
          description={t('home.flowLead')}
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {flowKeys.map((key, index) => (
            <div key={key} className="flex flex-col justify-between gap-10 bg-surface p-6 sm:p-8">
              <span className="text-micro tabular-nums tracking-[0.08em] text-ink-faint">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-serif text-h4 text-ink">{t(`home.flow.${key}.title`)}</h3>
                <p className="mt-2.5 text-body text-ink-soft">{t(`home.flow.${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* ---------------------------------------------------------------- Scope */}
      <Container className="mt-24">
        <SectionHeader
          eyebrow={t('home.scopeEyebrow')}
          index="04"
          title={t('home.scopeTitle')}
          description={t('home.scopeLead')}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {scopeKeys.map((key, index) => {
            const Icon = scopeIcons[index];
            return (
              <div
                key={key}
                className="interactive-surface rounded-lg border border-line bg-surface p-6 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-clay"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-4.5 text-sage-deep" strokeWidth={1.4} aria-hidden="true" />
                  <span className="text-micro tabular-nums text-ink-faint">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-serif text-h4 text-ink">{t(`home.scope.${key}.title`)}</h3>
                <p className="mt-2 text-body text-ink-soft">{t(`home.scope.${key}.body`)}</p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* ------------------------------------------------------------------ CTA */}
      <Container className="mt-24">
        <div className="relative overflow-hidden rounded-xl border border-ink/10 bg-sage-wash/60 px-6 py-16 sm:px-14 sm:py-20">
          <div
            className="absolute -bottom-24 -left-16 size-80 rounded-full bg-surface/70 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <p className="eyebrow">{t('home.ctaEyebrow')}</p>
            <h2 className="mt-5 font-serif text-h1 text-ink">{t('home.ctaTitle')}</h2>
            <p className="mt-5 max-w-lg text-lead text-ink-soft">{t('home.ctaLead')}</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to={routes.signUp}
                className="group inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-medium text-canvas transition-colors hover:bg-ink-soft"
              >
                {t('home.ctaButton')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to={routes.methodology}
                className="text-[0.8125rem] text-ink-soft underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                {t('home.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

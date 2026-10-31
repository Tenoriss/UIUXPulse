import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { NumberedRow, SectionLabel, StatBand } from '@/components/shared/Editorial';
import { Badge } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

const principleKeys = ['observe', 'explain', 'prioritise'] as const;
const flowKeys = ['submit', 'select', 'receive'] as const;
const scopeKeys = ['scores', 'findings', 'evidence', 'recommendations'] as const;

export function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <Container className="pt-8 pb-14 sm:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge tone="sage" dot>
            {t('home.available')}
          </Badge>
          <p className="text-micro uppercase tracking-[0.14em] text-ink-muted">
            {t('home.heroMeta')}
          </p>
        </div>

        {/* Display line broken over three lines, accent word italicised */}
        <h1 className="mt-10 font-serif text-hero text-ink">
          {t('home.heroTitle')}
          <br />
          <em className="italic text-sage-deep">{t('home.heroTitleAccent')}</em>{' '}
          {t('home.heroTitleRest')}
        </h1>

        {/* Asymmetric under-hero grid: text + actions left, image right */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col justify-between gap-10">
            <p className="max-w-md text-lead text-ink-soft">{t('home.heroLead')}</p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                to={routes.signUp}
                className="group inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-medium text-canvas transition-colors duration-300 hover:bg-ink-soft"
              >
                {t('home.heroPrimary')}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to={routes.howItWorks}
                className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                {t('home.heroSecondary')}
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <figure>
            <div className="overflow-hidden rounded-lg border border-line bg-surface-muted shadow-clay">
              <img
                src="/images/hero-still-life.jpg"
                alt={t('home.heroImageAlt')}
                width={1408}
                height={768}
                loading="eager"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-start justify-between gap-6 text-micro text-ink-muted">
              <span className="max-w-xs leading-relaxed">{t('home.heroNote')}</span>
              <span className="shrink-0 tabular-nums">01 / 04</span>
            </figcaption>
          </figure>
        </div>
      </Container>

      {/* ----------------------------------------------------------- Stat band */}
      <Container>
        <StatBand
          className="border-y border-line py-8 sm:py-10"
          items={[
            { value: t('home.stats.pages.value'), label: t('home.stats.pages.label') },
            { value: t('home.stats.evidence.value'), label: t('home.stats.evidence.label') },
            { value: t('home.stats.languages.value'), label: t('home.stats.languages.label') },
          ]}
        />
      </Container>

      {/* ----------------------------------------------------------- Marquee */}
      <div className="mt-16 overflow-hidden border-b border-line pb-5">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center gap-10 font-serif text-xl text-ink-muted"
            >
              {t('home.marquee')}
            </span>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------- Principles */}
      <Container className="mt-24">
        <SectionLabel label={t('home.principlesEyebrow')} index="01" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-serif text-h1 text-ink">{t('home.principlesTitle')}</h2>
            <p className="mt-6 max-w-sm text-body text-ink-soft">{t('home.principlesLead')}</p>
          </div>

          <div>
            {principleKeys.map((key, index) => (
              <NumberedRow
                key={key}
                index={`0${index + 1}`}
                title={t(`home.principles.${key}.title`)}
              >
                {t(`home.principles.${key}.body`)}
              </NumberedRow>
            ))}
          </div>
        </div>
      </Container>

      {/* ---------------------------------------------------------------- Flow */}
      <Container className="mt-24">
        <SectionLabel label={t('home.flowEyebrow')} index="02" />

        <div className="mt-12 grid gap-10 sm:grid-cols-[0.9fr_1.1fr] sm:items-end">
          <h2 className="font-serif text-h1 text-ink">{t('home.flowTitle')}</h2>
          <p className="max-w-md text-body text-ink-soft sm:justify-self-end">
            {t('home.flowLead')}
          </p>
        </div>

        <ol className="mt-14">
          {flowKeys.map((key, index) => (
            <li
              key={key}
              className="group grid gap-3 border-t border-line py-8 sm:grid-cols-[88px_1fr_1fr] sm:items-baseline sm:gap-10"
            >
              <span className="font-serif text-h3 leading-none text-ink-faint tabular-nums transition-colors duration-300 group-hover:text-sage-deep">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-h3 text-ink">{t(`home.flow.${key}.title`)}</h3>
              <p className="max-w-sm text-body text-ink-soft sm:justify-self-end">
                {t(`home.flow.${key}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </Container>

      {/* --------------------------------------------------------------- Scope */}
      <Container className="mt-24">
        <SectionLabel label={t('home.scopeEyebrow')} index="03" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <h2 className="font-serif text-h1 text-ink">{t('home.scopeTitle')}</h2>
            <p className="mt-6 max-w-sm text-body text-ink-soft">{t('home.scopeLead')}</p>
          </div>

          <ol className="flex flex-col">
            {scopeKeys.map((key, index) => (
              <li
                key={key}
                className="grid grid-cols-[40px_1fr] gap-5 border-t border-line py-6 last:border-b sm:grid-cols-[56px_1fr]"
              >
                <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-h4 text-ink">
                    {t(`home.scope.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-md text-body text-ink-soft">
                    {t(`home.scope.${key}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ CTA */}
      <Container className="mt-24">
        <div className="relative overflow-hidden rounded-xl border border-line bg-sage-wash/60 px-6 py-16 sm:px-14 sm:py-20">
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

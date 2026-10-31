import { Link } from 'react-router-dom';
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Gauge,
  Layers,
  LayoutGrid,
  MousePointerClick,
  Ruler,
  ScanEye,
  Type,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { NumberedRow, SectionLabel, StatBand } from '@/components/shared/Editorial';
import { AvailabilityPill, ClayAvatar } from '@/components/brand/AvailabilityPill';
import { FloatingIcon } from '@/components/brand/FloatingIcon';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

const principleKeys = ['observe', 'explain', 'prioritise'] as const;
const flowKeys = ['submit', 'select', 'receive'] as const;
const scopeKeys = ['scores', 'findings', 'evidence', 'recommendations'] as const;
const scopeIcons = [Gauge, Eye, Layers, ScanEye] as const;

export function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ================================================================ Hero
          Split editorial hero: type locked to the left column, the clay avatar
          floating to the right over a warm glow. Asymmetry keeps the display
          line from fighting the mascot for the same optical centre. */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 top-[-10%] size-[520px] rounded-full bg-sage/10 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 size-[380px] rounded-full bg-clay/10 blur-[120px]"
          aria-hidden="true"
        />

        <Container className="relative pt-10 pb-16 sm:pt-16 sm:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            {/* ---------------------------------------------------- Left column */}
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                <AvailabilityPill label={t('home.available')} />
                <p className="font-display text-micro uppercase tracking-[0.14em] text-ink-muted">
                  {t('home.heroMeta')}
                </p>
              </div>

              <h1 className="mt-8 font-display text-[clamp(2.75rem,9.5vw,7.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.045em] text-ink">
                <span className="block">{t('home.heroLineOne')}</span>
                <span className="block text-ink-soft">{t('home.heroLineTwo')}</span>
              </h1>

              <p className="mt-3 font-serif text-[clamp(1.5rem,3.2vw,2.5rem)] font-medium italic leading-none text-sage-deep">
                {t('home.heroAccent')}
              </p>

              <p className="mt-7 max-w-md text-body text-ink-soft">{t('home.heroLead')}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={routes.signUp}
                  className="group inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-6 py-3 text-[0.875rem] font-semibold text-canvas shadow-clay transition-colors duration-300 hover:bg-ink-soft"
                >
                  {t('home.heroPrimary')}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to={routes.howItWorks}
                  className="clay-surface group inline-flex items-center gap-2 rounded-pill border border-white/[0.07] bg-surface/70 px-6 py-3 text-[0.875rem] font-medium text-ink-soft backdrop-blur-sm transition-colors duration-300 hover:text-ink"
                >
                  {t('home.heroSecondary')}
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <p className="mt-7 max-w-sm text-micro leading-relaxed text-ink-muted">
                {t('home.heroSupport')}
              </p>
            </div>

            {/* --------------------------------------------------- Right column */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Floating clay tiles orbit the avatar */}
              <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
                <FloatingIcon icon={LayoutGrid} className="left-0 top-2" tone="sage" size="md" speed="slow" delay={0} rotate={-9} />
                <FloatingIcon icon={Ruler} className="left-[18%] -top-4" tone="taupe" size="sm" speed="fast" delay={1.3} rotate={11} />
                <FloatingIcon icon={MousePointerClick} className="right-2 top-0" tone="clay" size="lg" speed="normal" delay={0.5} rotate={8} />
                <FloatingIcon icon={Type} className="right-[22%] bottom-6" tone="ink" size="sm" speed="slow" delay={2} rotate={-7} />
                <FloatingIcon icon={Accessibility} className="left-2 bottom-0" tone="sage" size="md" speed="fast" delay={1.1} rotate={6} />
                <FloatingIcon icon={ScanEye} className="left-[30%] -bottom-6" tone="taupe" size="sm" speed="normal" delay={2.4} rotate={-12} />
              </div>

              <div className="relative animate-fade-up">
                <ClayAvatar
                  src="/images/avatar-hero.png"
                  alt={t('home.heroPortraitAlt')}
                  size="lg"
                />

                {/* Clay nameplate, like a caption under an exhibit */}
                <div className="clay-surface absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-pill border border-white/[0.07] bg-surface px-4 py-1.5">
                  <span className="font-display text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Pulse · 001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
              className="flex items-center gap-10 font-serif text-xl text-ink-faint"
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
            {scopeKeys.map((key, index) => {
              const Icon = scopeIcons[index];
              return (
                <li
                  key={key}
                  className="grid grid-cols-[32px_1fr] gap-5 border-t border-line py-6 last:border-b sm:grid-cols-[40px_1fr]"
                >
                  <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 text-sage-deep" strokeWidth={1.4} aria-hidden="true" />
                      <h3 className="font-serif text-h4 text-ink">
                        {t(`home.scope.${key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-md text-body text-ink-soft">
                      {t(`home.scope.${key}.body`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>

      {/* ------------------------------------------------------------------ CTA */}
      <Container className="mt-24">
        <div className="clay-surface-lg relative overflow-hidden rounded-2xl border border-white/[0.07] bg-surface px-6 py-16 sm:px-14 sm:py-20">
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 size-80 rounded-full bg-sage/10 blur-3xl"
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
                className="text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
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

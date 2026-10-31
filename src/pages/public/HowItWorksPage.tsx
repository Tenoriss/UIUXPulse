import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Minus } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ClosingCta, PageIntro } from '@/components/shared/PageIntro';
import { SectionLabel } from '@/components/shared/Editorial';
import { Badge } from '@/components/ui';
import { useI18n } from '@/i18n';
import { routes } from '@/config/site';
import { howItWorksContent } from '@/content/howItWorks';

export function HowItWorksPage() {
  const { t, locale } = useI18n();
  const content = howItWorksContent[locale];

  return (
    <>
      <PageIntro
        eyebrow={content.eyebrow}
        meta="08"
        title={content.title}
        description={content.lede}
      />

      {/* ------------------------------------------------------ Workflow ---- */}
      <Container>
        <SectionLabel label={content.workflowLabel} index="08" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <div>
            <h2 className="max-w-sm font-serif text-h2 text-ink">
              {content.workflowTitle}
            </h2>
            <p className="mt-5 max-w-sm text-body text-ink-soft">{content.workflowLead}</p>
          </div>
          <div aria-hidden="true" />
        </div>

        {/* Timeline: hairline spine on the left, numbered stations.
            Numbering uses a hanging rail rather than a card per step. */}
        <ol className="relative mt-12 border-t border-line pt-10">
          <span
            className="absolute bottom-4 left-[15px] top-16 hidden w-px bg-line sm:block"
            aria-hidden="true"
          />

          {content.steps.map((step, index) => (
            <li
              key={step.title}
              className="group relative grid gap-4 pb-10 last:pb-0 sm:grid-cols-[32px_minmax(0,1fr)_minmax(0,0.9fr)] sm:gap-8 sm:pl-0"
            >
              <span className="relative z-10 flex size-8 items-center justify-center rounded-full border border-line bg-canvas font-serif text-[0.875rem] tabular-nums text-ink-muted transition-colors duration-300 group-hover:border-sage/50 group-hover:text-sage-ink">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="sm:pt-0.5">
                <p className="eyebrow mb-2">{step.kicker}</p>
                <h3 className="font-serif text-h4 text-ink">{step.title}</h3>
                <p className="mt-2 max-w-md text-body text-ink-soft">{step.body}</p>
              </div>

              <div className="sm:pt-6">
                <p className="border-l border-line pl-4 text-micro leading-relaxed text-ink-muted">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>

      {/* ------------------------------------------------ Intended vs now ---- */}
      <Container className="mt-section">
        <SectionLabel label={content.statusLabel} index="—" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="max-w-sm font-serif text-h2 text-ink">{content.statusTitle}</h2>
            </div>
            <p className="mt-5 max-w-md text-body text-ink-soft">{content.statusBody}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface/60 p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-full bg-sage-wash text-sage-ink">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <p className="eyebrow">{content.liveNow}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {content.liveItems.map((item) => (
                  <li key={item} className="text-[0.8125rem] leading-relaxed text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-dashed border-line-strong bg-transparent p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
                  <Minus className="size-3.5" aria-hidden="true" />
                </span>
                <p className="eyebrow">{content.intended}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {content.intendedItems.map((item) => (
                  <li key={item} className="text-[0.8125rem] leading-relaxed text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------- Outputs ---- */}
      <Container className="mt-section">
        <SectionLabel label={content.outputsLabel} index="04" />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <div>
            <h2 className="max-w-sm font-serif text-h2 text-ink">{content.outputsTitle}</h2>
            <p className="mt-5 max-w-sm text-body text-ink-soft">{content.outputsLead}</p>
          </div>

          <ul className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {content.outputs.map((output, index) => (
              <li key={output.title} className="border-t border-line py-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-micro tabular-nums text-ink-muted">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-h4 text-ink">{output.title}</h3>
                </div>
                <p className="mt-2 text-body text-ink-soft">{output.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* ----------------------------------------------------- Boundaries ---- */}
      <Container className="mt-section">
        <SectionLabel label={content.rulesLabel} index="—" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <h2 className="max-w-sm font-serif text-h2 text-ink">{content.rulesTitle}</h2>

          <ul className="flex flex-col">
            {content.rules.map((rule) => (
              <li
                key={rule}
                className="border-t border-line py-5 text-body text-ink-soft last:border-b"
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Badge tone="sage" dot>
            {t('criteria.eyebrow')}
          </Badge>
          <Link
            to={routes.criteria}
            className="group inline-flex items-center gap-2 text-[0.875rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
          >
            {t('nav.criteria')}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

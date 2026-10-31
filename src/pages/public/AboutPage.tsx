import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { ClosingCta, PageIntro } from '@/components/shared/PageIntro';
import { NumberedRow, SectionLabel } from '@/components/shared/Editorial';
import { useI18n } from '@/i18n';
import { routes } from '@/config/site';
import { aboutContent } from '@/content/about';

/** Section heading pair used instead of a boxed card. */
function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
      <p className="eyebrow lg:pt-2">{label}</p>
      <h2 className="max-w-xl font-serif text-h2 text-ink">{title}</h2>
    </div>
  );
}

export function AboutPage() {
  const { t, locale } = useI18n();
  const content = aboutContent[locale];
  const { sections } = content;

  return (
    <>
      <PageIntro
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.lede}
      />

      <Container>
        <p className="border-t border-line pt-6 font-serif text-h4 italic text-sage-deep">
          {content.standfirst}
        </p>
      </Container>

      {/* --------------------------------------------------------- What ---- */}
      <Container className="mt-section">
        <SectionHead label={sections.whatLabel} title={sections.whatTitle} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <div aria-hidden="true" />
          <div className="flex flex-col gap-5">
            {sections.whatBody.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-lead text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------ Purpose ---- */}
      <Container className="mt-section">
        <SectionHead label={sections.purposeLabel} title={sections.purposeTitle} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <div aria-hidden="true" />
          <div className="flex flex-col gap-5">
            {sections.purposeBody.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-body text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>

      {/* ------------------------------------------------------ Problems ---- */}
      <Container className="mt-section">
        <SectionLabel label={sections.problemsLabel} index={t('about.problemsIndex')} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <h2 className="max-w-sm font-serif text-h2 text-ink">
              {sections.problemsTitle}
            </h2>
            <p className="mt-5 max-w-sm text-body text-ink-soft">{sections.problemsLead}</p>
          </div>

          <div>
            {sections.problems.map((item, index) => (
              <NumberedRow key={item.title} index={`0${index + 1}`} title={item.title}>
                {item.body}
              </NumberedRow>
            ))}
          </div>
        </div>
      </Container>

      {/* --------------------------------------------------- Why structure -- */}
      <Container className="mt-section">
        <SectionHead label={sections.whyLabel} title={sections.whyTitle} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-16">
          <div aria-hidden="true" />
          <div className="flex flex-col gap-5">
            {sections.whyBody.map((paragraph) => (
              <p key={paragraph} className="max-w-xl text-body text-ink-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>

      {/* ---------------------------------------------------- Principles ---- */}
      <Container className="mt-section">
        <SectionLabel label={content.principlesLabel} index="04" />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <h2 className="max-w-sm font-serif text-h2 text-ink">
              {content.principlesTitle}
            </h2>
            <p className="mt-5 max-w-sm text-body text-ink-soft">
              {content.principlesLead}
            </p>
          </div>

          <ol className="flex flex-col">
            {content.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="group grid gap-3 border-t border-line py-7 last:border-b sm:grid-cols-[48px_1fr] sm:gap-6"
              >
                <span className="text-micro tabular-nums tracking-[0.08em] text-ink-muted">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-h4 text-ink transition-colors duration-300 group-hover:text-sage-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-body text-ink-soft">{principle.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* -------------------------------------------------------- Status ---- */}
      <Container className="mt-section">
        <div className="rounded-lg border border-line bg-surface/60 p-6 sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <ShieldCheck className="size-4 text-sage-deep" aria-hidden="true" />
            <p className="eyebrow">{content.status.label}</p>
          </div>
          <h2 className="mt-5 max-w-lg font-serif text-h3 text-ink">{content.status.title}</h2>
          <p className="mt-4 max-w-2xl text-body text-ink-soft">{content.status.body}</p>

          <div className="mt-7 flex flex-wrap items-center gap-6 border-t border-line pt-6">
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
            <Link
              to={routes.howItWorks}
              className="text-[0.875rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              {t('nav.howItWorks')}
            </Link>
          </div>
        </div>
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

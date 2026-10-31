import { Container } from '@/components/layout/Container';
import { SectionLabel } from '@/components/shared/Editorial';
import { ClosingCta } from '@/components/shared/PageIntro';
import { useI18n } from '@/i18n';

const steps = ['submit', 'select', 'receive'] as const;

export function HowItWorksPage() {
  const { t } = useI18n();

  return (
    <>
      <Container className="pt-16 pb-14 sm:pt-24">
        <SectionLabel label={t('home.flowEyebrow')} index="00" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <h1 className="font-serif text-display text-ink">{t('home.flowTitle')}</h1>
          <p className="max-w-md text-lead text-ink-soft lg:pb-3">{t('home.flowLead')}</p>
        </div>
      </Container>

      <Container>
        <ol>
          {steps.map((step, index) => (
            <li
              key={step}
              className="group grid gap-4 border-t border-line py-10 sm:grid-cols-[88px_1fr_1fr] sm:items-baseline sm:gap-10"
            >
              <span className="font-serif text-h2 leading-none text-ink-faint tabular-nums transition-colors duration-300 group-hover:text-sage-deep">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="font-serif text-h3 text-ink">{t(`home.flow.${step}.title`)}</h2>
              <p className="max-w-sm text-body text-ink-soft sm:justify-self-end">
                {t(`home.flow.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-xl border-t border-line pt-6 text-body text-ink-soft">
          {t('home.heroNote')}
        </p>
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

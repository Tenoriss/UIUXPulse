import { Container } from '@/components/layout/Container';
import { PageIntro, CtaBand } from '@/components/shared/PageIntro';
import { useI18n } from '@/i18n';

const steps = ['submit', 'select', 'receive'] as const;

export function HowItWorksPage() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro
        eyebrow={t('home.flowEyebrow')}
        meta="01 — 03"
        title={t('home.flowTitle')}
        description={t('home.flowLead')}
      />

      <Container>
        <ol className="flex flex-col border-t border-line">
          {steps.map((step, index) => (
            <li
              key={step}
              className="grid gap-6 border-b border-line py-10 sm:grid-cols-[120px_1fr_1fr] sm:items-start sm:gap-10"
            >
              <span className="font-serif text-h2 text-ink-faint tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="font-serif text-h3 text-ink">{t(`home.flow.${step}.title`)}</h2>
              <p className="max-w-md text-body text-ink-soft">{t(`home.flow.${step}.body`)}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-xl text-body text-ink-soft">{t('home.heroNote')}</p>
      </Container>

      <CtaBand title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

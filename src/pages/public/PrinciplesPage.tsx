import { Container } from '@/components/layout/Container';
import { PageIntro, CtaBand } from '@/components/shared/PageIntro';
import { Badge } from '@/components/ui';
import { useI18n } from '@/i18n';

const principles = ['observe', 'explain', 'prioritise'] as const;

export function PrinciplesPage() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro
        eyebrow={t('home.principlesEyebrow')}
        meta="Principles"
        title={t('home.principlesTitle')}
        description={t('home.principlesLead')}
      />

      <Container>
        <div className="mb-10">
          <Badge tone="sage" dot>
            {t('footer.disclaimer')}
          </Badge>
        </div>

        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-3">
          {principles.map((key, index) => (
            <article key={key} className="flex flex-col gap-4">
              <span className="text-micro tabular-nums text-ink-faint">
                0{index + 1}
              </span>
              <h2 className="font-serif text-h3 text-ink">{t(`home.principles.${key}.title`)}</h2>
              <p className="text-body text-ink-soft">{t(`home.principles.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </Container>

      <CtaBand title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

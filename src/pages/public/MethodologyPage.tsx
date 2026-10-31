import { Container } from '@/components/layout/Container';
import { PageIntro, ClosingCta } from '@/components/shared/PageIntro';
import { Card, CardDescription, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { useI18n } from '@/i18n';

const scope = ['scores', 'findings', 'evidence', 'recommendations'] as const;

export function MethodologyPage() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro
        eyebrow={t('footer.methodology')}
        meta="Draft"
        title={t('home.scopeTitle')}
        description={t('home.scopeLead')}
      />

      <Container>
        <div className="grid gap-4 sm:grid-cols-2">
          {scope.map((key, index) => (
            <Card key={key} interactive>
              <CardHeader>
                <span className="text-micro tabular-nums text-ink-faint">
                  0{index + 1}
                </span>
                <CardTitle>{t(`home.scope.${key}.title`)}</CardTitle>
                <CardDescription>{t(`home.scope.${key}.body`)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <EmptyState
          className="mt-10"
          eyebrow={t('common.comingSoon')}
          title={t('states.emptyTitle')}
          description={t('states.emptyBody')}
        />
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

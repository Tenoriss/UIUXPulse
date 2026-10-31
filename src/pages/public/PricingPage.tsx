import { Container } from '@/components/layout/Container';
import { PageIntro, CtaBand } from '@/components/shared/PageIntro';
import { EmptyState, Tabs } from '@/components/ui';
import { useI18n } from '@/i18n';

/**
 * Pricing is intentionally not invented in this phase: the page establishes
 * structure (billing tabs + empty state) without fake plans or prices.
 */
export function PricingPage() {
  const { t } = useI18n();

  return (
    <>
      <PageIntro
        eyebrow={t('nav.pricing')}
        meta="—"
        title={t('states.emptyTitle')}
        description={t('pricing.notice')}
      />

      <Container>
        <Tabs
          variant="underline"
          ariaLabel={t('nav.pricing')}
          items={[
            { value: 'monthly', label: t('pricing.monthly') },
            { value: 'annual', label: t('pricing.annual'), disabled: true },
          ]}
          panels={{
            monthly: (
              <EmptyState
                eyebrow={t('common.comingSoon')}
                title={t('states.emptyTitle')}
                description={t('states.emptyBody')}
              />
            ),
          }}
        />
      </Container>

      <CtaBand title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

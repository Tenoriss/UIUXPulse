import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { NumberedRow, SectionLabel } from '@/components/shared/Editorial';
import { ClosingCta } from '@/components/shared/PageIntro';
import { useI18n } from '@/i18n';
import { routes } from '@/config/site';

const principles = ['observe', 'explain', 'prioritise'] as const;

export function PrinciplesPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Editorial opener: eyebrow rule, display line, lede in the right column */}
      <Container className="pt-16 pb-14 sm:pt-24">
        <SectionLabel label={t('nav.principles')} index="00" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <h1 className="font-serif text-display text-ink">{t('home.principlesTitle')}</h1>
          <p className="max-w-md text-lead text-ink-soft lg:pb-3">{t('home.principlesLead')}</p>
        </div>

        <p className="mt-12 max-w-2xl border-t border-line pt-6 text-body text-ink-soft">
          {t('footer.disclaimer')}
        </p>
      </Container>

      <Container>
        <div>
          {principles.map((key, index) => (
            <NumberedRow
              key={key}
              index={`0${index + 1}`}
              title={t(`home.principles.${key}.title`)}
            >
              {t(`home.principles.${key}.body`)}
            </NumberedRow>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6">
          <Link
            to={routes.howItWorks}
            className="group inline-flex items-center gap-2 text-[0.875rem] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
          >
            {t('nav.howItWorks')}
            <ArrowUpRight
              className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            to={routes.methodology}
            className="text-[0.875rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            {t('footer.methodology')}
          </Link>
        </div>
      </Container>

      <ClosingCta title={t('home.ctaTitle')} description={t('home.ctaLead')} />
    </>
  );
}

import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { LinkButton } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';

export function NotFoundPage({ inApp = false }: { inApp?: boolean }) {
  const { t } = useI18n();

  const content = (
    <div className="flex flex-col items-start gap-6 py-16 sm:py-24">
      <p className="eyebrow">404</p>
      <h1 className="max-w-xl font-serif text-h1 text-ink">{t('states.notFoundTitle')}</h1>
      <p className="max-w-md text-lead text-ink-soft">{t('states.notFoundBody')}</p>
      <div className="flex flex-wrap items-center gap-4">
        <LinkButton to={inApp ? routes.dashboard : routes.home} tone="dark" size="lg">
          {t('states.notFoundAction')}
        </LinkButton>
        <Link
          to={routes.howItWorks}
          className="text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          {t('nav.howItWorks')}
        </Link>
      </div>
    </div>
  );

  if (inApp) return content;

  return <Container>{content}</Container>;
}

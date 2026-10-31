import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui';
import { PageIntro } from '@/components/shared/PageIntro';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useSession } from '@/providers/SessionProvider';
import { useHydrateSession } from '@/hooks/useHydrateSession';

/**
 * Start-an-evaluation gate.
 *
 * Unauthenticated visitors are redirected to sign-in immediately, with the
 * intended destination preserved in `?next=`. The short-lived fallback screen
 * exists only for the frame before the stored session is read, so a returning
 * visitor never sees a flash of the sign-in page.
 */
export function StartEvaluationPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSession();

  useHydrateSession();

  useEffect(() => {
    if (isAuthenticated) return;
    const timer = window.setTimeout(() => {
      navigate(
        { pathname: routes.signIn, search: location.search || '?next=%2Fapp%2Fevaluations' },
        { replace: true },
      );
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, navigate, location.search]);

  if (isAuthenticated) {
    return <Navigate to={routes.evaluations} replace />;
  }

  return (
    <>
      <PageIntro
        eyebrow={t('start.eyebrow')}
        title={t('start.title')}
        description={t('start.lead')}
      />
      <Container>
        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <Button
            size="lg"
            tone="dark"
            leadingIcon={<LogIn className="size-4" aria-hidden="true" />}
            onClick={() =>
              navigate({ pathname: routes.signIn, search: location.search || '?next=%2Fapp%2Fevaluations' })
            }
          >
            {t('auth.signIn')}
          </Button>
          <Button size="lg" tone="ghost" onClick={() => navigate(routes.signUp)}>
            {t('auth.signUp')}
          </Button>
          <p className="text-micro text-ink-muted">{t('start.redirecting')}</p>
        </div>
      </Container>
    </>
  );
}

import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { Button } from '@/components/ui';

/**
 * Router-level error boundary. Renders inside the app providers so it can use
 * translations and toasts, and keeps the tone editorial rather than technical.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();
  const { t } = useI18n();
  const { toast } = useToast();

  const status = isRouteErrorResponse(error) ? error.status : null;
  const detail =
    isRouteErrorResponse(error)
      ? `${error.status} ${error.statusText}`
      : error instanceof Error
        ? error.message
        : null;

  return (
    <Container className="flex min-h-dvh flex-col justify-center py-20">
      <p className="eyebrow mb-6">{status ? `Error ${status}` : 'Error'}</p>
      <h1 className="max-w-xl font-serif text-h1 text-ink">{t('states.errorTitle')}</h1>
      <p className="mt-4 max-w-md text-lead text-ink-soft">{t('states.errorBody')}</p>

      {detail && import.meta.env.DEV && (
        <pre className="mt-8 max-w-xl overflow-x-auto rounded-md border border-line bg-surface-muted/60 p-4 text-micro text-ink-soft">
          {detail}
        </pre>
      )}

      <div className="mt-8 flex items-center gap-4">
        <Button
          onClick={() => {
            toast({ title: t('states.retry'), variant: 'info' });
            window.location.reload();
          }}
        >
          {t('states.retry')}
        </Button>
        <Link
          to="/"
          className="text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {t('states.notFoundAction')}
        </Link>
      </div>
    </Container>
  );
}

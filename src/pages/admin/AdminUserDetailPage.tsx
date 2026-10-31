import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Gauge, Globe, ShieldCheck, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle, EmptyState, LinkButton } from '@/components/ui';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { getAccount } from '@/services/admin.service';
import { listEvaluations } from '@/services/evaluation.service';
import { listWebsites } from '@/services/website.service';
import { readSession } from '@/services/auth.storage';

/**
 * One account, read-only.
 *
 * Nothing on this page can change the account: no role switcher, no delete, no
 * impersonate control. Each of those would be a promise the mock cannot keep —
 * the browser is the only place the role lives, and an "administrator" who
 * could sign in as someone else would be fabricating a session that real
 * authentication would never issue.
 *
 * Websites and configurations are read through the same per-owner service
 * calls the workspace uses, so this page cannot show another account's data
 * assembled into a shape the owning service would have refused.
 */
export function AdminUserDetailPage() {
  const { t, formatDate } = useI18n();
  const { user: currentUser } = useAuth();
  const { id = '' } = useParams();

  const account = useMemo(() => getAccount(id), [id]);
  const websites = useMemo(() => listWebsites(account?.id), [account?.id]);
  const evaluations = useMemo(() => listEvaluations(account?.id), [account?.id]);
  const session = useMemo(() => readSession(), []);
  const hasSession = Boolean(session && session.userId === account?.id);

  if (!account) {
    return (
      <div className="flex flex-col gap-8">
        <BackLink label={t('admin.users.detailBack')} />
        <h1 className="font-serif text-h2 text-ink">{t('admin.users.detailNotFoundTitle')}</h1>
        <EmptyState
          icon={Users}
          title={t('admin.users.detailNotFoundTitle')}
          description={t('admin.users.detailNotFoundBody')}
          action={
            <LinkButton to={routes.adminUsers} tone="dark" size="sm">
              {t('admin.users.detailBack')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  const isSelf = account.id === currentUser?.id;
  const roleLabel =
    account.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleUser');

  return (
    <div className="flex flex-col gap-8">
      <BackLink label={t('admin.users.detailBack')} />

      <PageHeader
        eyebrow={t('admin.users.detailTitle')}
        title={account.name}
        description={account.email}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={account.role === 'admin' ? 'taupe' : 'neutral'} dot>
              {roleLabel}
            </Badge>
            {isSelf && <Badge tone="sage">{t('admin.users.you')}</Badge>}
            <Badge tone={hasSession ? 'sage' : 'neutral'}>
              {hasSession ? t('admin.users.statusActive') : t('admin.users.statusInactive')}
            </Badge>
          </div>
        }
      />

      <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.users.columnRegistered')}</dt>
          <dd className="mt-1 text-[0.9375rem] tabular-nums text-ink">{formatDate(account.createdAt)}</dd>
        </div>
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.users.columnWebsites')}</dt>
          <dd className="mt-1 text-[0.9375rem] tabular-nums text-ink">{websites.length}</dd>
        </div>
        <div className="bg-surface px-5 py-4">
          <dt className="text-micro text-ink-muted">{t('admin.users.columnEvaluations')}</dt>
          <dd className="mt-1 text-[0.9375rem] tabular-nums text-ink">{evaluations.length}</dd>
        </div>
      </dl>

      <Card padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-ink-muted" aria-hidden="true" />
            {t('admin.users.detailProfile')}
          </CardTitle>
          <CardDescription>{t('admin.users.detailRoleNote')}</CardDescription>
        </CardHeader>

        <div className="mt-5 grid gap-3 border-t border-line pt-4 text-micro sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-ink-faint">{t('admin.users.columnRole')}</span>
            <span className="text-ink-soft">{roleLabel}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-ink-faint">{t('admin.users.columnRegistered')}</span>
            <span className="tabular-nums text-ink-soft">{formatDate(account.createdAt)}</span>
          </div>
          <div className="flex flex-col gap-0.5 sm:col-span-2">
            <span className="text-ink-faint">
              {hasSession ? t('admin.users.statusActive') : t('admin.users.statusInactive')}
            </span>
            <span className="text-ink-soft">
              {hasSession ? t('admin.users.statusActiveBody') : t('admin.users.statusInactiveBody')}
            </span>
          </div>
        </div>

        <p className="mt-5 rounded-md border border-line bg-surface-muted/50 px-3 py-2.5 text-[0.75rem] leading-relaxed text-ink-muted">
          {t('admin.users.detailNoSecrets')}
        </p>
      </Card>

      <section aria-labelledby="admin-user-websites" className="flex flex-col gap-3">
        <h2 id="admin-user-websites" className="font-serif text-h3 text-ink">
          {t('admin.users.detailWebsites')}
        </h2>

        {websites.length === 0 ? (
          <EmptyState icon={Globe} title={t('admin.users.detailWebsitesEmpty')} />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
            {websites.map((website) => (
              <li key={website.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="min-w-0">
                  <span className="block truncate text-[0.875rem] font-medium text-ink">{website.name}</span>
                  <span className="block break-all text-micro text-ink-muted">{website.url}</span>
                </span>
                <span className="shrink-0 text-micro tabular-nums text-ink-faint">
                  {formatDate(website.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="admin-user-evals" className="flex flex-col gap-3">
        <h2 id="admin-user-evals" className="font-serif text-h3 text-ink">
          {t('admin.users.detailEvaluations')}
        </h2>

        {evaluations.length === 0 ? (
          <EmptyState icon={Gauge} title={t('admin.users.detailEvaluationsEmpty')} />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
            {evaluations.map((record) => (
              <li key={record.id}>
                <Link
                  to={`${routes.adminEvaluations}/${record.id}`}
                  className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[0.875rem] font-medium text-ink">{record.website}</span>
                    <span className="block font-mono text-[0.6875rem] text-ink-muted">{record.id}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-micro text-ink-faint">
                    <span className="tabular-nums">{formatDate(record.createdAt)}</span>
                    <Badge tone={record.status === 'created' ? 'sage' : 'neutral'}>
                      {t(`evaluation.status.${record.status}`)}
                    </Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      to={routes.adminUsers}
      className="inline-flex w-fit items-center gap-1.5 text-micro text-ink-muted transition-colors hover:text-ink"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {label}
    </Link>
  );
}

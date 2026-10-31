import { SUPPORTED_LOCALES, LOCALE_META, useI18n } from '@/i18n';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { EditProfileForm, UserAvatar } from '@/components/profile';
import { useAuth } from '@/services/auth.context';
import { cn } from '@/lib/cn';

export interface SettingsPageProps {
  admin?: boolean;
}

/**
 * Settings.
 *
 * Profile editing is the same form used by the dashboard dialog, so there is
 * one implementation and no drift. Language preference stays exactly as it was
 * — it drives i18n directly and persists on its own.
 */
export function SettingsPage({ admin = false }: SettingsPageProps) {
  const { t, locale, setLocale, formatDate } = useI18n();
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={admin ? t('admin.title') : t('dashboard.workspace')}
        title={t('dashboard.settings.title')}
        description={t('dashboard.settings.body')}
        actions={<Badge tone={admin ? 'taupe' : 'sage'}>{t('profile.demoBadge')}</Badge>}
      />

      {!admin && (
        <section aria-labelledby="settings-profile" className="flex flex-col gap-4">
          <h2 id="settings-profile" className="font-serif text-h4 text-ink">
            {t('profile.sectionTitle')}
          </h2>

          <Card padding="lg">
            <EditProfileForm />
          </Card>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ------------------------------------------------ Account info */}
        {!admin && (
          <Card padding="lg">
            <CardHeader>
              <CardTitle>{t('profile.accountTitle')}</CardTitle>
              <CardDescription>{t('profile.accountBody')}</CardDescription>
            </CardHeader>

            <div className="mt-6 flex items-center gap-4">
              <UserAvatar size="lg" />
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-medium text-ink">
                  {user?.name || t('profile.fallbackName')}
                </p>
                <p className="truncate text-micro text-ink-muted">{user?.email}</p>
              </div>
            </div>

            <dl className="mt-6 flex flex-col gap-3 border-t border-line pt-5 text-[0.8125rem]">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-muted">{t('profile.memberSince')}</dt>
                <dd className="tabular-nums text-ink-soft">
                  {user?.createdAt ? formatDate(user.createdAt) : '—'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-muted">{t('profile.accountId')}</dt>
                <dd className="min-w-0 truncate font-mono text-micro text-ink-soft">
                  {user?.id ?? '—'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-muted">{t('profile.passwordLabel')}</dt>
                <dd className="text-ink-soft">{t('profile.passwordNote')}</dd>
              </div>
            </dl>
          </Card>
        )}

        {/* ---------------------------------------------------- Language */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>{t('common.language')}</CardTitle>
            <CardDescription>{t('common.changeLanguage')}</CardDescription>
          </CardHeader>

          <div
            role="radiogroup"
            aria-label={t('common.language')}
            className="mt-6 flex flex-col gap-2"
          >
            {SUPPORTED_LOCALES.map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={locale === item}
                onClick={() => setLocale(item)}
                className={cn(
                  'flex items-center justify-between rounded-md border px-4 py-3 text-left transition-colors duration-300',
                  locale === item
                    ? 'border-sage/60 bg-sage-wash/60'
                    : 'border-line bg-surface hover:border-line-strong',
                )}
              >
                <span>
                  <span className="block text-[0.8125rem] font-medium text-ink">
                    {LOCALE_META[item].label}
                  </span>
                  <span className="block text-micro text-ink-muted">{LOCALE_META[item].intl}</span>
                </span>
                <span
                  className={cn(
                    'size-3.5 rounded-full border',
                    locale === item
                      ? 'border-sage-deep bg-sage-deep'
                      : 'border-line-strong bg-transparent',
                  )}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <p className="mt-6 text-micro leading-relaxed text-ink-muted">{t('auth.demoNotice')}</p>
        </Card>
      </div>
    </div>
  );
}

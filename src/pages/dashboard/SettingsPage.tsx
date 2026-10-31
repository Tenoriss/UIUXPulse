import { SUPPORTED_LOCALES, LOCALE_META, useI18n } from '@/i18n';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

export interface SettingsPageProps {
  admin?: boolean;
}

/**
 * Settings foundation: the language preference is real (it drives i18n), while
 * workspace/profile fields are clearly marked as not yet connected.
 */
export function SettingsPage({ admin = false }: SettingsPageProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={admin ? t('admin.title') : t('dashboard.workspace')}
        title={t('dashboard.settings.title')}
        description={t('dashboard.settings.body')}
        actions={<Badge tone="taupe">{t('common.readOnly')}</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
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
                  <span className="block text-micro text-ink-faint">
                    {LOCALE_META[item].intl}
                  </span>
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
        </Card>

        <Card variant="muted" padding="lg">
          <CardHeader>
            <CardTitle>{admin ? t('admin.criteriaTitle') : t('dashboard.settings.title')}</CardTitle>
            <CardDescription>
              {admin ? t('admin.criteriaBody') : t('dashboard.settings.body')}
            </CardDescription>
          </CardHeader>

          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center justify-between gap-4">
                <div className="h-2.5 w-24 rounded-pill bg-surface" aria-hidden="true" />
                <div className="h-2.5 w-12 rounded-pill bg-surface" aria-hidden="true" />
              </div>
            ))}
          </div>

          <p className="mt-8 text-micro text-ink-faint">{t('common.previewNotice')}</p>
        </Card>
      </div>
    </div>
  );
}

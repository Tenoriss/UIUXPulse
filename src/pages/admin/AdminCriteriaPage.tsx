import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardDescription, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { useI18n } from '@/i18n';

export function AdminCriteriaPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.criteriaTitle')}
        description={t('admin.criteriaBody')}
      />

      <Card padding="lg">
        <CardHeader>
          <CardTitle>{t('admin.criteriaTitle')}</CardTitle>
          <CardDescription>{t('admin.criteriaBody')}</CardDescription>
        </CardHeader>

        <div className="mt-8 space-y-3" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center gap-4 rounded-md border border-line bg-surface-muted/40 px-4 py-3"
            >
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="h-2.5 w-1/3" />
              <Skeleton className="ml-auto h-2.5 w-12" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { ListChecks } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui';
import { useI18n } from '@/i18n';

export function AdminQueuePage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.nav.queue')}
        description={t('admin.queueEmptyBody')}
      />
      <EmptyState icon={ListChecks} title={t('admin.queueEmptyTitle')} description={t('admin.queueEmptyBody')} />
    </div>
  );
}

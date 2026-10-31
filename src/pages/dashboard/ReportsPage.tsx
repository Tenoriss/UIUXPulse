import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui';
import { useI18n } from '@/i18n';

export function ReportsPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('dashboard.workspace')}
        title={t('dashboard.reports.title')}
        description={t('dashboard.reports.body')}
      />

      <EmptyState
        icon={FileText}
        eyebrow={t('common.comingSoon')}
        title={t('states.emptyTitle')}
        description={t('states.emptyBody')}
      />
    </div>
  );
}

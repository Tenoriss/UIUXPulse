import { Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui';
import { useI18n } from '@/i18n';

export function AdminUsersPage() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('admin.title')}
        title={t('admin.nav.users')}
        description={t('admin.restrictedBody')}
      />
      <EmptyState icon={Users} title={t('states.emptyTitle')} description={t('states.emptyBody')} />
    </div>
  );
}

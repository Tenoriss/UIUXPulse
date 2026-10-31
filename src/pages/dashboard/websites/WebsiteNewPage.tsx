import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { WebsiteForm } from '@/components/websites/WebsiteForm';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import type { WebsiteRecord } from '@/services/workspace.types';

export function WebsiteNewPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSaved = (website: WebsiteRecord) => {
    toast({
      title: t('websites.form.addSuccessTitle'),
      description: t('websites.form.addSuccessBody', { name: website.name }),
      variant: 'success',
    });
    // Straight to the new record: the visitor just created it and its details
    // are the next useful screen.
    navigate(`/app/websites/${website.id}`, { replace: true });
  };

  return (
    <div className="flex flex-col gap-8">
      <Link
        to="/app/websites"
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {t('websites.detail.back')}
      </Link>

      <PageHeader
        eyebrow={t('websites.eyebrow')}
        title={t('websites.form.addTitle')}
        description={t('websites.form.addLead')}
      />

      <Card padding="lg" className="max-w-2xl">
        <WebsiteForm onSaved={onSaved} onCancel={() => navigate('/app/websites')} />
      </Card>
    </div>
  );
}

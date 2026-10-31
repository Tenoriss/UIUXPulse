import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, EmptyState } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { WebsiteForm } from '@/components/websites/WebsiteForm';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';
import { getWebsite } from '@/services/website.service';
import type { WebsiteRecord } from '@/services/workspace.types';

export function WebsiteEditPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const { id = '' } = useParams();
  const navigate = useNavigate();

  // Ownership check: `getWebsite` only returns records owned by this account,
  // so another user's id resolves to "not found" rather than their data.
  const website = getWebsite(user?.id, id);

  const onSaved = (updated: WebsiteRecord) => {
    toast({
      title: t('websites.form.editSuccessTitle'),
      description: t('websites.form.editSuccessBody', { name: updated.name }),
      variant: 'success',
    });
    navigate(`/app/websites/${updated.id}`, { replace: true });
  };

  if (!website) {
    return (
      <div className="flex flex-col gap-8">
        <EmptyState
          title={t('websites.detail.notFoundTitle')}
          description={t('websites.detail.notFoundBody')}
          action={
            <Link
              to="/app/websites"
              className="inline-flex items-center gap-2 rounded-pill border border-ink bg-ink px-5 py-2.5 text-[0.8125rem] font-medium text-canvas shadow-clay transition-colors hover:bg-ink-soft"
            >
              {t('websites.detail.notFoundAction')}
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Link
        to={`/app/websites/${website.id}`}
        className="inline-flex items-center gap-1.5 self-start text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        {website.name}
      </Link>

      <PageHeader
        eyebrow={t('websites.eyebrow')}
        title={t('websites.form.editTitle')}
        description={t('websites.form.editLead')}
        actions={
          <Button tone="ghost" size="sm" onClick={() => navigate(`/app/websites/${website.id}`)}>
            {t('websites.form.cancel')}
          </Button>
        }
      />

      <Card padding="lg" className="max-w-2xl">
        <WebsiteForm
          website={website}
          onSaved={onSaved}
          onCancel={() => navigate(`/app/websites/${website.id}`)}
        />
      </Card>
    </div>
  );
}

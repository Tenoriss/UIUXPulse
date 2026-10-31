import { useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge, Button, EmptyState, Input, Modal, Tabs } from '@/components/ui';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { validateUrl, type FieldError } from '@/lib/validation';

/**
 * Evaluations list. The "new evaluation" flow is represented by a URL-capture
 * modal only — nothing is submitted, per the current phase restrictions.
 */
export function EvaluationsPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<FieldError>(null);

  const onContinue = () => {
    const nextError = validateUrl(url);
    setError(nextError);
    if (nextError) return;

    setOpen(false);
    setUrl('');
    toast({
      title: t('common.comingSoon'),
      description: t('dashboard.evaluations.body'),
      variant: 'info',
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow={t('dashboard.workspace')}
        title={t('dashboard.evaluations.title')}
        description={t('dashboard.evaluations.body')}
        actions={
          <Button
            leadingIcon={<Plus className="size-4" aria-hidden="true" />}
            onClick={() => setOpen(true)}
          >
            {t('dashboard.newEvaluation')}
          </Button>
        }
      />

      <Tabs
        ariaLabel={t('tabs.label')}
        items={[
          { value: 'all', label: t('common.all'), count: 0 },
          { value: 'in-review', label: t('dashboard.stats.pending'), count: 0 },
          { value: 'completed', label: t('dashboard.nav.reports'), count: 0 },
        ]}
        panels={{
          all: (
            <EmptyState
              icon={Globe}
              title={t('dashboard.recentEmptyTitle')}
              description={t('dashboard.recentEmptyBody')}
              action={
                <Button size="sm" tone="neutral" onClick={() => setOpen(true)}>
                  {t('dashboard.recentEmptyAction')}
                </Button>
              }
            />
          ),
          'in-review': (
            <EmptyState title={t('states.emptyTitle')} description={t('states.emptyBody')} />
          ),
          completed: (
            <EmptyState title={t('states.emptyTitle')} description={t('states.emptyBody')} />
          ),
        }}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow={t('dashboard.newEvaluation')}
        title={t('home.flow.submit.title')}
        description={t('home.flow.submit.body')}
        footer={
          <>
            <Button tone="ghost" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={onContinue}>{t('common.continue')}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label={t('dashboard.urlLabel')}
            placeholder={t('dashboard.urlPlaceholder')}
            leadingIcon={<Globe className="size-4" aria-hidden="true" />}
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onContinue();
              }
            }}
            error={error ? t(error) : undefined}
            data-autofocus
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sage">{t('common.readOnly')}</Badge>
            <span className="text-micro text-ink-muted">{t('home.heroNote')}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

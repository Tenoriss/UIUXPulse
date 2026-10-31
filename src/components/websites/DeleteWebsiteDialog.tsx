import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ui';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';
import { deleteWebsite } from '@/services/website.service';
import type { WebsiteRecord } from '@/services/workspace.types';

export interface DeleteWebsiteDialogProps {
  website: WebsiteRecord | null;
  /** Number of evaluation records attached to this website. */
  relatedCount: number;
  onClose: () => void;
  onDeleted?: () => void;
  /** Where to go after a successful delete. Omit to stay on the current page. */
  redirectTo?: string;
}

/**
 * Confirmation for deleting a website.
 *
 * Deleting never destroys evaluation history: the service detaches those
 * records and keeps them. The dialog says so explicitly, and names the exact
 * website and URL so there is no ambiguity about which site is going away.
 */
export function DeleteWebsiteDialog({
  website,
  relatedCount,
  onClose,
  onDeleted,
  redirectTo,
}: DeleteWebsiteDialogProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!website) return;
    setLoading(true);
    const result = await deleteWebsite(user?.id, website.id);
    setLoading(false);

    if (!result.ok) {
      toast({
        title: t('websites.deleteDialog.errorTitle'),
        description: t('websites.deleteDialog.errorBody'),
        variant: 'error',
      });
      onClose();
      return;
    }

    toast({
      title: t('websites.deleteDialog.successTitle'),
      description:
        result.detached > 0
          ? t('websites.deleteDialog.successBodyWithRecords', {
              name: website.name,
              count: String(result.detached),
            })
          : t('websites.deleteDialog.successBody', { name: website.name }),
      variant: 'info',
    });

    onClose();
    onDeleted?.();
    if (redirectTo) navigate(redirectTo, { replace: true });
  };

  return (
    <ConfirmDialog
      open={Boolean(website)}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title={t('websites.deleteDialog.title')}
      description={
        website
          ? t('websites.deleteDialog.description', {
              name: website.name,
              url: website.url,
            })
          : undefined
      }
      warning={
        <span>
          {relatedCount > 0
            ? t('websites.deleteDialog.warningWithEvaluations', {
                count: String(relatedCount),
              })
            : t('websites.deleteDialog.warningNone')}
        </span>
      }
      confirmLabel={t('websites.deleteDialog.confirm')}
      cancelLabel={t('websites.deleteDialog.cancel')}
    />
  );
}

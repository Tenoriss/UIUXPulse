import { CircleAlert } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { useI18n } from '@/i18n';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <EmptyState
      icon={CircleAlert}
      title={title ?? t('states.errorTitle')}
      description={description ?? t('states.errorBody')}
      className={className}
      action={
        onRetry ? (
          <Button tone="neutral" size="sm" onClick={onRetry}>
            {t('states.retry')}
          </Button>
        ) : undefined
      }
    />
  );
}

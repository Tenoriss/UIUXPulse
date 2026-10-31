import { Modal } from '@/components/ui';
import { useI18n } from '@/i18n';
import { EditProfileForm } from './EditProfileForm';

export interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Profile editing as a dialog, used from the profile menu and the dashboard
 * quick actions so the visitor never loses their place.
 */
export function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={t('profile.eyebrow')}
      title={t('profile.title')}
      description={t('profile.body')}
      size="md"
    >
      {open && <EditProfileForm onDone={onClose} onCancel={onClose} />}
    </Modal>
  );
}

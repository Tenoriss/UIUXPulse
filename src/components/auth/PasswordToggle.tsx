import { Eye, EyeOff } from 'lucide-react';
import { useI18n } from '@/i18n';

/**
 * Show/hide control for password inputs.
 *
 * Reusable across sign-in, register and reset so the affordance, the icon
 * swap, and the accessible label are identical everywhere. It is a real
 * `<button type="button">`, has a 36px hit area, and announces its state via
 * `aria-pressed`.
 */
export function PasswordToggle({
  revealed,
  onToggle,
}: {
  revealed: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();
  const label = revealed ? t('auth.hidePassword') : t('auth.showPassword');

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={revealed}
      title={label}
      className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors duration-[var(--duration-instant)] hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
    >
      {revealed ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

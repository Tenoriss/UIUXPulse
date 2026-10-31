import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ImagePlus, RotateCcw, User } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthAlert } from '@/components/auth/AuthAlert';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';
import { prepareAvatar, ACCEPTED_TYPES, MAX_UPLOAD_BYTES, type AvatarErrorCode } from '@/lib/avatar';
import { hasErrors, validateEmail, validateRequired, type FieldError } from '@/lib/validation';
import type { AuthErrorCode } from '@/services/auth.types';
import { UserAvatar } from './UserAvatar';

type FieldName = 'name' | 'email';
type Errors = Record<FieldName, FieldError>;

export interface EditProfileFormProps {
  /** Called after a successful save, or when the visitor cancels. */
  onDone?: () => void;
  onCancel?: () => void;
}

/**
 * Profile editor, shared by the dashboard modal and the settings card.
 *
 * One implementation, two entry points — the brief asks for profile editing in
 * both places, and duplicating the form would let the two drift.
 */
export function EditProfileForm({ onDone, onCancel }: EditProfileFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);
  const [errors, setErrors] = useState<Errors>({ name: null, email: null });
  const [avatarError, setAvatarError] = useState<AvatarErrorCode | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // A different account (sign out / sign in) must never keep the old draft.
  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setAvatarUrl(user?.avatarUrl ?? null);
    setErrors({ name: null, email: null });
    setAvatarError(null);
    setFormError(null);
  }, [user?.id, user?.name, user?.email, user?.avatarUrl]);

  const onPickFile = async (file: File | undefined) => {
    if (!file) return;
    setAvatarError(null);

    const result = await prepareAvatar(file);
    if (!result.ok) {
      setAvatarError(result.code);
      return;
    }
    setAvatarUrl(result.dataUrl);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Errors = {
      name: validateRequired(name),
      email: validateEmail(email),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSaving(true);
    const result = await updateProfile({ name, email, avatarUrl });
    setSaving(false);

    if (!result.ok) {
      const code: AuthErrorCode = result.code;
      if (code === 'emailTaken') {
        setErrors((current) => ({ ...current, email: 'validation.emailTaken' }));
      } else {
        setFormError(t('profile.errors.generic'));
      }
      return;
    }

    toast({
      title: t('profile.savedTitle'),
      description: t('profile.savedBody'),
      variant: 'success',
    });
    onDone?.();
  };

  const avatarMessage: Record<AvatarErrorCode, string> = {
    type: t('profile.avatarTypeError'),
    size: t('profile.avatarSizeError'),
    decode: t('profile.avatarDecodeError'),
    unknown: t('profile.errors.generic'),
  };

  const maxMb = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024));

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {formError && <AuthAlert tone="error">{formError}</AuthAlert>}

      {/* ------------------------------------------------------------ Photo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <UserAvatar src={avatarUrl} size="xl" className="mx-auto sm:mx-0" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div>
            <p className="text-[0.8125rem] font-medium text-ink">{t('profile.photo')}</p>
            <p className="mt-1 text-micro text-ink-muted">
              {t('profile.photoHint', { max: String(maxMb) })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="sr-only"
              onChange={(event) => {
                void onPickFile(event.target.files?.[0]);
                // Allow re-picking the same file after a reset.
                event.target.value = '';
              }}
            />

            <Button
              type="button"
              size="sm"
              tone="neutral"
              leadingIcon={<ImagePlus className="size-3.5" aria-hidden="true" />}
              onClick={() => fileRef.current?.click()}
            >
              {avatarUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                size="sm"
                tone="ghost"
                leadingIcon={<RotateCcw className="size-3.5" aria-hidden="true" />}
                onClick={() => {
                  setAvatarUrl(null);
                  setAvatarError(null);
                }}
              >
                {t('profile.removePhoto')}
              </Button>
            )}
          </div>

          {avatarError && (
            <p className="text-micro text-clay-ink" role="alert">
              {avatarMessage[avatarError]}
            </p>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------ Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('profile.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          autoComplete="name"
          leadingIcon={<User className="size-4" aria-hidden="true" />}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setErrors((current) => ({ ...current, name: null }));
          }}
          error={errors.name ? t(errors.name) : undefined}
          required
        />

        <Input
          label={t('profile.email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({ ...current, email: null }));
          }}
          error={errors.email ? t(errors.email) : undefined}
          required
        />
      </div>

      {/* Read-only: the account id is what ties the session to this record. */}
      <div className="flex flex-col gap-2">
        <p className="text-[0.8125rem] font-medium text-ink">{t('profile.accountId')}</p>
        <p className="truncate rounded-md border border-line bg-surface-sunken px-3.5 py-2.5 font-mono text-[0.75rem] text-ink-muted">
          {user?.id ?? '—'}
        </p>
        <p className="text-micro text-ink-muted">{t('profile.accountIdHint')}</p>
      </div>

      {/* ------------------------------------------------------------ Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          tone="ghost"
          onClick={() => {
            // Cancel restores the stored values before leaving.
            setName(user?.name ?? '');
            setEmail(user?.email ?? '');
            setAvatarUrl(user?.avatarUrl ?? null);
            setErrors({ name: null, email: null });
            setAvatarError(null);
            setFormError(null);
            onCancel?.();
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit" tone="dark" loading={saving}>
          {t('profile.save')}
        </Button>
      </div>
    </form>
  );
}

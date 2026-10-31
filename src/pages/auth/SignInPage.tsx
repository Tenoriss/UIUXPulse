import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Button, Checkbox, Input } from '@/components/ui';
import { AuthFooterLinks, AuthHeading } from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import {
  hasErrors,
  validateEmail,
  validatePassword,
  type FieldError,
} from '@/lib/validation';

type Errors = Record<'email' | 'password', FieldError>;

export function SignInPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>({ email: null, password: null });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast({
        title: t('common.readOnly'),
        description: t('auth.previewNotice'),
        variant: 'info',
      });
    }, 600);
  };

  return (
    <>
      <AuthHeading
        eyebrow={t('auth.eyebrow')}
        title={t('auth.signInTitle')}
        description={t('auth.signInLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          placeholder={t('auth.emailPlaceholder')}
          leadingIcon={<Mail className="size-4" aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email ? t(errors.email) : undefined}
          required
        />

        <Input
          label={t('auth.password')}
          type={reveal ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder={t('auth.passwordPlaceholder')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password ? t(errors.password) : undefined}
          required
          trailingSlot={
            <button
              type="button"
              onClick={() => setReveal((value) => !value)}
              aria-label={reveal ? t('auth.hidePassword') : t('auth.showPassword')}
              className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors duration-[var(--duration-instant)] hover:bg-surface-muted hover:text-ink"
            >
              {reveal ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          }
        />

        <div className="flex items-center justify-between gap-4">
          <Checkbox label={t('auth.remember')} />
          <Link
            to={routes.forgotPassword}
            className="text-micro text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            {t('auth.forgot')}
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-1">
          {t('auth.signIn')}
        </Button>
      </form>

      <AuthFooterLinks>
        <p>
          {t('auth.noAccount')}{' '}
          <Link
            to={routes.signUp}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            {t('auth.createOne')}
          </Link>
        </p>
        <p className="text-micro text-ink-muted">{t('auth.terms')}</p>
      </AuthFooterLinks>
    </>
  );
}

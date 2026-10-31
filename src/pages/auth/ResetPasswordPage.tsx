import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import {
  AuthAlert,
  AuthFooterLinks,
  AuthHeading,
  PasswordToggle,
} from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import {
  hasErrors,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  type FieldError,
} from '@/lib/validation';

type Field = 'email' | 'password' | 'confirm';
type Errors = Record<Field, FieldError>;

const emptyErrors: Errors = { email: null, password: null, confirm: null };

/**
 * Mock password reset.
 *
 * A real flow would arrive here with a token from an email. There is no email
 * in this build, so the address is asked for on the page and the new digest is
 * written only if a demo account exists. Nothing is emailed and nothing is
 * verified.
 */
export function ResetPasswordPage() {
  const { t } = useI18n();
  const { resetPassword } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validatePasswordMatch(password, confirm),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    const result = await resetPassword(email, password);
    setSubmitting(false);

    if (!result.ok) {
      // Unknown address: say so plainly rather than pretending it worked,
      // because the next step is to sign in with the new password.
      setFormError(t('auth.errors.accountNotFound'));
      return;
    }

    setDone(true);
  };

  const signInLink = (
    <Link
      to={{ pathname: routes.signIn, search: location.search }}
      className="inline-flex items-center gap-1.5 text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {t('auth.backToSignIn')}
    </Link>
  );

  if (done) {
    return (
      <>
        <AuthHeading
          eyebrow={t('auth.eyebrow')}
          title={t('auth.resetDoneTitle')}
          description={t('auth.resetDoneLead')}
        />

        <AuthAlert tone="success">{t('auth.demoNotice')}</AuthAlert>

        <div className="mt-6">
          <Link
            to={{ pathname: routes.signIn, search: location.search }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-ink bg-ink px-6 text-[0.9375rem] font-medium text-canvas shadow-clay transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {t('auth.backToSignIn')}
          </Link>
        </div>

        <AuthFooterLinks>
          <p className="inline-flex items-center gap-1.5">
            <MailCheck className="size-3.5" aria-hidden="true" />
            {t('auth.resetDoneNote')}
          </p>
        </AuthFooterLinks>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow={t('auth.eyebrow')}
        title={t('auth.resetTitle')}
        description={t('auth.resetLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <AuthAlert tone="error">{formError}</AuthAlert>}

        <Input
          label={t('auth.email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('auth.emailPlaceholder')}
          leadingIcon={<Mail className="size-4" aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email ? t(errors.email) : undefined}
          required
        />

        <Input
          label={t('auth.newPassword')}
          type={reveal ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('auth.passwordPlaceholder')}
          hint={t('auth.passwordHint')}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password ? t(errors.password) : undefined}
          required
          trailingSlot={
            <PasswordToggle
              revealed={reveal}
              onToggle={() => setReveal((value) => !value)}
            />
          }
        />

        <Input
          label={t('auth.confirmPassword')}
          type={reveal ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={t('auth.confirmPlaceholder')}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          error={errors.confirm ? t(errors.confirm) : undefined}
          required
        />

        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-2">
          {t('auth.resetPassword')}
        </Button>
      </form>

      <AuthFooterLinks>{signInLink}</AuthFooterLinks>
    </>
  );
}

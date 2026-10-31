import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthAlert, AuthFooterLinks, AuthHeading } from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { requestPasswordReset } from '@/services/auth.service';
import { validateEmail, type FieldError } from '@/lib/validation';

/**
 * Mock password recovery.
 *
 * No email is ever sent. The response is identical whether or not the address
 * has a demo account, so the form cannot be used to discover who is registered
 * — the same behaviour a real service should have.
 */
export function ForgotPasswordPage() {
  const { t } = useI18n();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<FieldError>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) return;

    setSubmitting(true);
    await requestPasswordReset(email);
    setSubmitting(false);
    setSent(true);
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

  if (sent) {
    return (
      <>
        <AuthHeading
          eyebrow={t('auth.eyebrow')}
          title={t('auth.resetSentTitle')}
          description={t('auth.resetSentLead')}
        />

        <AuthAlert tone="success">{t('auth.demoNotice')}</AuthAlert>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
          >
            {t('auth.tryAnotherEmail')}
          </Button>
          <Link
            to={{ pathname: routes.resetPassword, search: location.search }}
            className="text-center text-[0.8125rem] text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            {t('auth.continueToReset')}
          </Link>
        </div>

        <AuthFooterLinks>{signInLink}</AuthFooterLinks>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        eyebrow={t('auth.eyebrow')}
        title={t('auth.forgotTitle')}
        description={t('auth.forgotLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label={t('auth.email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('auth.emailPlaceholder')}
          leadingIcon={<Mail className="size-4" aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error ? t(error) : undefined}
          hint={t('auth.demoNotice')}
          required
        />
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {t('auth.sendResetLink')}
        </Button>
      </form>

      <AuthFooterLinks>{signInLink}</AuthFooterLinks>
    </>
  );
}

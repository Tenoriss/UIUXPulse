import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthFooterLinks, AuthHeading } from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { validateEmail, type FieldError } from '@/lib/validation';

export function ForgotPasswordPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<FieldError>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextError = validateEmail(email);
    setError(nextError);
    if (nextError) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast({
        title: t('common.comingSoon'),
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
        description={t('auth.previewNotice')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label={t('auth.email')}
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          leadingIcon={<Mail className="size-4" aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={error ? t(error) : undefined}
          required
        />
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          {t('common.continue')}
        </Button>
      </form>

      <AuthFooterLinks>
        <Link
          to={routes.signIn}
          className="inline-flex items-center gap-1.5 text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {t('auth.signIn')}
        </Link>
      </AuthFooterLinks>
    </>
  );
}

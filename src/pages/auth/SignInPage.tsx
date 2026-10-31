import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button, Checkbox, Input } from '@/components/ui';
import { AuthAlert, AuthFooterLinks, AuthHeading, PasswordToggle } from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { DEMO_ADMIN, useAuth } from '@/services/auth.context';
import { readReturnTo } from '@/lib/redirect';
import {
  hasErrors,
  validateEmail,
  validatePassword,
  type FieldError,
} from '@/lib/validation';

type Errors = Record<'email' | 'password', FieldError>;
const emptyErrors: Errors = { email: null, password: null };

export function SignInPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      // Credential problems belong to the form, not to a field: the visitor
      // cannot tell which of the two was wrong, and should not be able to.
      setFormError(t('auth.errors.invalidCredentials'));
      return;
    }

    toast({
      title: t('auth.signedInTitle', { name: result.data.name || result.data.email }),
      description: t('auth.demoNotice'),
      variant: 'success',
    });
    navigate(readReturnTo(location.search), { replace: true });
  };

  return (
    <>
      <AuthHeading
        eyebrow={t('auth.eyebrow')}
        title={t('auth.signInTitle')}
        description={t('auth.signInLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {formError && <AuthAlert tone="error">{formError}</AuthAlert>}

        <Input
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          inputMode="email"
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
            <PasswordToggle
              revealed={reveal}
              onToggle={() => setReveal((value) => !value)}
            />
          }
        />

        <div className="flex items-center justify-between gap-4">
          <Checkbox label={t('auth.remember')} />
          <Link
            to={{ pathname: routes.forgotPassword, search: location.search }}
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
            to={{ pathname: routes.register, search: location.search }}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            {t('auth.createOne')}
          </Link>
        </p>
        <p className="text-micro text-ink-muted">{t('auth.demoNotice')}</p>

        {/* The demo administrator's credentials are published on purpose: the
            admin surface is a mock, and a role nobody can obtain would just be
            an unreachable screen. This is not a bypass — signing in this way
            goes through the same credential check as any other account. */}
        <div className="rounded-md border border-line bg-surface-muted/50 px-3 py-2.5 text-micro leading-relaxed text-ink-muted">
          <p className="font-medium text-ink-soft">{t('auth.demoAdminTitle')}</p>
          <p className="mt-1 break-all font-mono text-[0.6875rem] text-ink-soft">
            {DEMO_ADMIN.email} · {DEMO_ADMIN.password}
          </p>
          <p className="mt-1">{t('auth.demoAdminBody')}</p>
        </div>
      </AuthFooterLinks>
    </>
  );
}

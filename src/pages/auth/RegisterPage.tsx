import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Mail, User } from 'lucide-react';
import { Button, Checkbox, Input } from '@/components/ui';
import {
  AuthAlert,
  AuthFooterLinks,
  AuthHeading,
  PasswordToggle,
} from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';
import { readReturnTo } from '@/lib/redirect';
import {
  hasErrors,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  type FieldError,
} from '@/lib/validation';

type Field = 'name' | 'email' | 'password' | 'confirm' | 'terms';
type Errors = Record<Field, FieldError>;

const emptyErrors: Errors = {
  name: null,
  email: null,
  password: null,
  confirm: null,
  terms: null,
};

export function RegisterPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [values, setValues] = useState({
    name: '',
    email: '',
    organization: '',
    password: '',
    confirm: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors: Errors = {
      name: validateRequired(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: validatePasswordMatch(values.password, values.confirm),
      terms: accepted ? null : 'validation.terms',
    };
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    setSubmitting(true);
    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setSubmitting(false);

    if (!result.ok) {
      if (result.code === 'emailTaken') {
        setErrors((current) => ({ ...current, email: 'validation.emailTaken' }));
      } else {
        setFormError(t('auth.errors.generic'));
      }
      return;
    }

    toast({
      title: t('auth.welcomeTitle', { name: result.data.name }),
      description: t('auth.demoNotice'),
      variant: 'success',
    });
    navigate(readReturnTo(location.search), { replace: true });
  };

  return (
    <>
      <AuthHeading
        eyebrow={t('auth.eyebrow')}
        title={t('auth.registerTitle')}
        description={t('auth.registerLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {formError && <AuthAlert tone="error">{formError}</AuthAlert>}

        <Input
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          autoComplete="name"
          leadingIcon={<User className="size-4" aria-hidden="true" />}
          value={values.name}
          onChange={set('name')}
          error={errors.name ? t(errors.name) : undefined}
          required
        />

        <Input
          label={t('auth.email')}
          type="email"
          inputMode="email"
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
          leadingIcon={<Mail className="size-4" aria-hidden="true" />}
          value={values.email}
          onChange={set('email')}
          error={errors.email ? t(errors.email) : undefined}
          required
        />

        <Input
          label={t('auth.organization')}
          placeholder={t('auth.organizationPlaceholder')}
          autoComplete="organization"
          leadingIcon={<Building2 className="size-4" aria-hidden="true" />}
          optionalLabel={t('common.optional')}
          value={values.organization}
          onChange={set('organization')}
        />

        <Input
          label={t('auth.password')}
          type={reveal ? 'text' : 'password'}
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete="new-password"
          hint={t('auth.passwordHint')}
          value={values.password}
          onChange={set('password')}
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
          placeholder={t('auth.confirmPlaceholder')}
          autoComplete="new-password"
          value={values.confirm}
          onChange={set('confirm')}
          error={errors.confirm ? t(errors.confirm) : undefined}
          required
        />

        <div className="mt-1">
          <Checkbox
            label={t('auth.acceptTerms')}
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            aria-invalid={errors.terms ? true : undefined}
          />
          {errors.terms && (
            <p className="mt-2 text-micro text-clay-ink" role="alert">
              {t(errors.terms)}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-2">
          {t('auth.createAccount')}
        </Button>
      </form>

      <AuthFooterLinks>
        <p>
          {t('auth.hasAccount')}{' '}
          <Link
            to={{ pathname: routes.signIn, search: location.search }}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            {t('auth.signInInstead')}
          </Link>
        </p>
        <p className="text-micro text-ink-muted">{t('auth.demoNotice')}</p>
      </AuthFooterLinks>
    </>
  );
}

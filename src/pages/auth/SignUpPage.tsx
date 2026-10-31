import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, User } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthFooterLinks, AuthHeading } from '@/components/auth';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import { useToast } from '@/providers/ToastProvider';
import {
  hasErrors,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  type FieldError,
} from '@/lib/validation';

type Errors = Record<'name' | 'email' | 'password' | 'confirm', FieldError>;

const emptyErrors: Errors = { name: null, email: null, password: null, confirm: null };

export function SignUpPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [values, setValues] = useState({
    name: '',
    email: '',
    organization: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Errors = {
      name: validateRequired(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: validatePasswordMatch(values.password, values.confirm),
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
        title={t('auth.signUpTitle')}
        description={t('auth.signUpLead')}
      />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
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
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          error={errors.password ? t(errors.password) : undefined}
          required
        />

        <Input
          label={t('auth.confirmPassword')}
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={set('confirm')}
          error={errors.confirm ? t(errors.confirm) : undefined}
          required
        />

        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-3">
          {t('auth.signUp')}
        </Button>
      </form>

      <AuthFooterLinks>
        <p>
          {t('auth.hasAccount')}{' '}
          <Link
            to={routes.signIn}
            className="font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink"
          >
            {t('auth.signInInstead')}
          </Link>
        </p>
        <p className="text-micro text-ink-faint">{t('auth.terms')}</p>
      </AuthFooterLinks>
    </>
  );
}

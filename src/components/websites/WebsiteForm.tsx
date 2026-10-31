import { useEffect, useState, type FormEvent } from 'react';
import { Globe, Type } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { AuthAlert } from '@/components/auth/AuthAlert';
import { useI18n } from '@/i18n';
import { useAuth } from '@/services/auth.context';
import { addWebsite, isUrlTaken, updateWebsite } from '@/services/website.service';
import { normaliseUrl, suggestNameFromUrl } from '@/lib/url';
import { validateRequired, type FieldError } from '@/lib/validation';
import type { WebsiteRecord } from '@/services/workspace.types';
import type { WebsiteErrorCode } from '@/services/website.types';

type FieldName = 'name' | 'url';
type Errors = Record<FieldName, FieldError>;

export interface WebsiteFormProps {
  /** Present when editing; omitted when adding. */
  website?: WebsiteRecord;
  onSaved: (website: WebsiteRecord) => void;
  onCancel: () => void;
}

const errorKeyFor: Record<WebsiteErrorCode, string> = {
  duplicateUrl: 'websites.form.errors.duplicateUrl',
  notFound: 'websites.form.errors.notFound',
  forbidden: 'websites.form.errors.forbidden',
  invalidUrl: 'validation.url',
  invalidName: 'validation.required',
  unknown: 'websites.form.errors.generic',
};

/**
 * Add / edit form.
 *
 * One component for both, because the fields, validation, and duplicate rules
 * are identical and two copies would drift. Editing passes `website`, which
 * keeps the record id and createdAt untouched — see `updateWebsite`.
 */
export function WebsiteForm({ website, onSaved, onCancel }: WebsiteFormProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const isEdit = Boolean(website);

  const [name, setName] = useState(website?.name ?? '');
  const [url, setUrl] = useState(website?.url ?? '');
  const [description, setDescription] = useState(website?.description ?? '');
  // Tracks whether the name was typed by the person or filled from the domain,
  // so editing the URL keeps a suggested name in sync but never overwrites one
  // that was chosen deliberately.
  const [nameEdited, setNameEdited] = useState(isEdit);

  const [errors, setErrors] = useState<Errors>({ name: null, url: null });
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) return;
    if (nameEdited) return;
    const suggestion = url.trim() ? normaliseUrl(url) : null;
    setName(suggestion ? suggestNameFromUrl(suggestion) : '');
  }, [url, isEdit, nameEdited]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    // Accept both `studio.com` and `https://studio.com`; the service
    // normalises. `normaliseUrl` is the single source of truth here because it
    // is also what rejects hosts the service would refuse (`http://localhost`),
    // and `validateUrl` alone is looser than that.
    const trimmedUrl = url.trim();
    const normalised = normaliseUrl(trimmedUrl);
    const nextErrors: Errors = {
      name: validateRequired(name),
      url: normalised ? null : trimmedUrl ? 'validation.url' : 'validation.required',
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.url) return;

    // Duplicate check up front so the message lands on the field, not in a toast.
    if (isUrlTaken(user?.id, url, website?.id)) {
      setErrors((current) => ({ ...current, url: 'websites.form.errors.duplicateUrl' }));
      return;
    }

    const payload = { name, url, description };
    setSaving(true);
    const result = website
      ? await updateWebsite(user?.id, website.id, payload)
      : await addWebsite(user?.id, payload);
    setSaving(false);

    if (!result.ok) {
      const key = errorKeyFor[result.code];
      if (result.code === 'duplicateUrl') {
        setErrors((current) => ({ ...current, url: 'websites.form.errors.duplicateUrl' }));
      } else if (result.code === 'invalidUrl') {
        setErrors((current) => ({ ...current, url: 'validation.url' }));
      } else {
        setFormError(t(key));
      }
      return;
    }

    onSaved(result.data);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {formError && <AuthAlert tone="error">{formError}</AuthAlert>}

      <Input
        label={t('websites.form.name')}
        placeholder={t('websites.form.namePlaceholder')}
        leadingIcon={<Type className="size-4" aria-hidden="true" />}
        hint={t('websites.form.nameHint')}
        value={name}
        onChange={(event) => {
          setNameEdited(true);
          setName(event.target.value);
          setErrors((current) => ({ ...current, name: null }));
        }}
        error={errors.name ? t(errors.name) : undefined}
        autoComplete="off"
        required
      />

      <Input
        label={t('websites.form.url')}
        placeholder={t('websites.form.urlPlaceholder')}
        type="url"
        inputMode="url"
        leadingIcon={<Globe className="size-4" aria-hidden="true" />}
        hint={t('websites.form.urlHint')}
        value={url}
        onChange={(event) => {
          setUrl(event.target.value);
          setErrors((current) => ({ ...current, url: null }));
        }}
        error={errors.url ? t(errors.url) : undefined}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        required
      />

      <Textarea
        label={t('websites.form.description')}
        placeholder={t('websites.form.descriptionPlaceholder')}
        optionalLabel={t('websites.form.descriptionOptional')}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={4}
        maxLength={400}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <Button type="button" tone="ghost" onClick={onCancel} disabled={saving}>
          {t('websites.form.cancel')}
        </Button>
        <Button type="submit" tone="dark" loading={saving}>
          {isEdit ? t('websites.form.saveChanges') : t('websites.form.save')}
        </Button>
      </div>
    </form>
  );
}

import type { TranslationKey } from '@/i18n/types';

/** A resolver returns a translation key for the error, or `null` when valid. */
export type FieldError = TranslationKey | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateRequired(value: string): FieldError {
  return value.trim().length === 0 ? 'validation.required' : null;
}

export function validateEmail(value: string): FieldError {
  if (value.trim().length === 0) return 'validation.required';
  return EMAIL_PATTERN.test(value.trim()) ? null : 'validation.email';
}

export function validatePassword(value: string, min = 8): FieldError {
  if (value.length === 0) return 'validation.required';
  return value.length < min ? 'validation.passwordMin' : null;
}

export function validatePasswordMatch(value: string, confirmation: string): FieldError {
  if (confirmation.length === 0) return 'validation.required';
  return value === confirmation ? null : 'validation.passwordMatch';
}

export function validateUrl(value: string): FieldError {
  if (value.trim().length === 0) return 'validation.required';
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? null
      : 'validation.url';
  } catch {
    return 'validation.url';
  }
}

export function hasErrors(errors: Record<string, FieldError>): boolean {
  return Object.values(errors).some((error) => error !== null);
}

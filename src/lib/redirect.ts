/**
 * Return-destination helpers.
 *
 * Only same-origin, path-relative destinations are accepted, so a crafted
 * `?next=` can never bounce a visitor to another site. This is the one place
 * that decides whether a redirect target is safe.
 */
const FALLBACK = '/app';

/** Reject absolute URLs, protocol-relative paths, and backslash tricks. */
export function isSafeReturnTo(value: string | null | undefined): value is string {
  if (!value) return false;
  if (!value.startsWith('/')) return false;
  if (value.startsWith('//')) return false;
  if (value.includes('\\')) return false;
  return true;
}

export function readReturnTo(search: string, fallback: string = FALLBACK): string {
  const value = new URLSearchParams(search).get('next');
  return isSafeReturnTo(value) ? value : fallback;
}

/**
 * Build a path that carries the intended destination through an auth step.
 * The destination is only appended when it survives the same-origin check.
 */
export function getReturnTo(path: string, destination?: string): string {
  if (!destination || !isSafeReturnTo(destination)) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}next=${encodeURIComponent(destination)}`;
}

/**
 * URL normalisation for website records.
 *
 * One function decides what a website's canonical URL is, so duplicate
 * detection, display, and the favicon target can never disagree.
 */

/** Characters a bare domain may start with, e.g. `studio-aria.com`. */
const BARE_DOMAIN = /^[\w-]+(\.[\w-]+)+([/?#].*)?$/i;

/**
 * Normalise user input into an absolute http(s) URL.
 *
 * - adds `https://` when the scheme is missing, so typing `studio.com` works
 * - lowercases the host and drops a leading `www.`
 * - removes a trailing slash and the fragment, which never identify a distinct site
 * - keeps the path and query, because `/shop` is a different website record
 *
 * Returns `null` for anything that is not a usable http(s) URL.
 */
export function normaliseUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
    ? raw
    : BARE_DOMAIN.test(raw)
      ? `https://${raw}`
      : null;

  if (!candidate) return null;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!url.hostname.includes('.')) return null;

  url.hash = '';
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  url.hostname = host;

  const path = url.pathname.replace(/\/+$/, '');
  const query = url.search;

  return `${url.protocol}//${host}${url.port ? `:${url.port}` : ''}${path}${query}`;
}

/** Host of a normalised URL, without `www.` — the default website name. */
export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Turn a domain into a readable default name: `studio-aria.com` → `Studio Aria`.
 * Purely a suggestion — the field stays editable.
 */
export function suggestNameFromUrl(url: string): string {
  const domain = domainOf(url);
  const label = domain.split('.').slice(0, -1).join(' ') || domain;
  const cleaned = label.replace(/[-_]+/g, ' ').trim();
  if (!cleaned) return domain;
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Identity used for duplicate detection.
 *
 * A site reachable over `http` and `https` is the same site, so the scheme is
 * dropped here and only here. Stored `url` values keep the scheme the person
 * typed (normalised to https for bare domains), because that is what they
 * expect to see — and what an evaluation would later open.
 */
export function urlKey(url: string): string | null {
  const normalised = normaliseUrl(url);
  if (!normalised) return null;
  return normalised.replace(/^https?:\/\//, '');
}

/** Two URLs belong to the same website record. */
export function sameUrl(a: string, b: string): boolean {
  return urlKey(a) === urlKey(b);
}

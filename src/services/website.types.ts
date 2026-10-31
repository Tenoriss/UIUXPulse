import type { WebsiteInput, WebsiteRecord, WebsiteStatus } from './workspace.types';

/**
 * Website service contract.
 *
 * Same shape as the auth service: async, discriminated results, and no thrown
 * strings. That keeps the loading and error states in the UI already correct if
 * this is ever replaced by a real API.
 */
export type WebsiteErrorCode =
  | 'notFound'
  | 'forbidden'
  | 'duplicateUrl'
  | 'invalidUrl'
  | 'invalidName'
  | 'unknown';

export type WebsiteOutcome<T> =
  | { ok: true; data: T }
  | { ok: false; code: WebsiteErrorCode };

export type WebsiteResult = WebsiteOutcome<WebsiteRecord>;
export type WebsiteListResult = WebsiteOutcome<WebsiteRecord[]>;

export interface WebsiteQuery {
  search?: string;
  status?: WebsiteStatus | 'all';
  /** `newest` sorts by creation date descending. */
  sort?: 'newest' | 'oldest' | 'name';
}

export type { WebsiteInput, WebsiteRecord, WebsiteStatus };

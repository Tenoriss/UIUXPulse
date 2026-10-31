/**
 * Local `cn` implementation.
 *
 * Kept dependency-free on purpose: the app only needs conditional class
 * composition, not Tailwind conflict resolution. Avoiding `clsx` +
 * `tailwind-merge` keeps the bundle small and predictable.
 */
export type ClassValueLike =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValueLike[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValueLike[]): string {
  const out: string[] = [];

  const walk = (value: ClassValueLike) => {
    if (!value) return;
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) out.push(key);
    }
  };

  inputs.forEach(walk);
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

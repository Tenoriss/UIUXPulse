import { useEffect, useState } from 'react';

/** Subscribe to a CSS media query. SSR-safe (returns `false` before hydration). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Tailwind `lg` breakpoint helper used by layout components. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

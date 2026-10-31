import { useEffect, useState } from 'react';

/** Small helper for mount transitions (used by modal / toast). */
export function useMounted(duration = 0) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), duration);
    return () => window.clearTimeout(id);
  }, [duration]);

  return mounted;
}

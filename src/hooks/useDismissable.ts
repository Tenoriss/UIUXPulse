import { useEffect, type RefObject } from 'react';

interface DismissOptions {
  enabled?: boolean;
  onDismiss: () => void;
  /** Elements that should not trigger dismissal (e.g. the trigger button). */
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
}

/** Close a popover on outside pointer-down or Escape. */
export function useDismissable(
  ref: RefObject<HTMLElement | null>,
  { enabled = true, onDismiss, ignoreRefs = [] }: DismissOptions,
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current?.contains(target)) return;
      if (ignoreRefs.some((item) => item.current?.contains(target))) return;
      onDismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onDismiss();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, onDismiss, ref, ignoreRefs]);
}

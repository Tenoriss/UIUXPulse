import {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDismissable } from '@/hooks/useDismissable';
import type { DropdownItem } from '@/types/ui';

export interface DropdownProps<T extends string = string> {
  items: DropdownItem<T>[];
  onSelect: (value: T) => void;
  /** Controlled open state. Omit for uncontrolled behaviour. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  /** Width utility for the panel, e.g. `w-56`. */
  panelClassName?: string;
  children: ReactNode;
  /** Optional value highlight (radio-style) for select-like menus. */
  activeValue?: T | null;
  className?: string;
  label?: string;
}

/**
 * Accessible dropdown menu: click / Enter / Space to open, arrow keys to move,
 * Escape or outside click to dismiss.
 */
export function Dropdown<T extends string = string>({
  items,
  onSelect,
  open: openProp,
  onOpenChange,
  align = 'end',
  panelClassName,
  children,
  activeValue,
  className,
  label,
}: DropdownProps<T>) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  useDismissable(containerRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
    ignoreRefs: [triggerRef],
  });

  const focusItem = (index: number) => {
    const buttons = panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const enabledItems = items.filter((item) => !item.disabled);

    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
      return;
    }

    if (!open) return;

    const buttons = Array.from(
      panelRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [],
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (currentIndex + 1) % buttons.length;
      buttons[next]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[prev]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      buttons[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      buttons[buttons.length - 1]?.focus();
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.querySelector<HTMLElement>('button')?.focus();
    }

    if (enabledItems.length === 0) return;
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex', className)}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="contents"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
      >
        {children}
      </div>

      {open && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute top-[calc(100%+0.5rem)] z-40 min-w-52 origin-top overflow-hidden rounded-md border border-line bg-surface p-1.5 shadow-clay-lg animate-scale-in',
            align === 'end' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeValue === item.value;

            return (
              <div key={item.value}>
                {item.separated && <div className="my-1.5 h-px bg-line" role="separator" />}
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  aria-disabled={item.disabled || undefined}
                  onClick={() => {
                    if (item.disabled) return;
                    onSelect(item.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-[0.8125rem] transition-colors duration-200',
                    'text-ink-soft hover:bg-surface-muted hover:text-ink focus-visible:bg-surface-muted focus-visible:text-ink focus-visible:outline-none',
                    isActive && 'bg-sage-wash/70 text-sage-ink',
                    item.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{item.label}</span>
                    {item.description && (
                      <span className="mt-0.5 block truncate text-micro text-ink-faint">
                        {item.description}
                      </span>
                    )}
                  </span>
                  {item.hint && <span className="text-micro text-ink-faint">{item.hint}</span>}
                  {isActive && <Check className="size-3.5 shrink-0 text-sage-deep" aria-hidden="true" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

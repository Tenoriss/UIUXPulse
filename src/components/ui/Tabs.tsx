import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { TabItem } from '@/types/ui';

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  /** `underline` is the editorial default; `pill` for dense UI panels. */
  variant?: 'underline' | 'pill';
  /** Render the panel yourself, or pass `children` keyed by value. */
  panels?: Partial<Record<T, ReactNode>>;
  className?: string;
  listClassName?: string;
  panelClassName?: string;
  ariaLabel?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  panels,
  className,
  listClassName,
  panelClassName,
  ariaLabel,
}: TabsProps<T>) {
  const [internalValue, setInternalValue] = useState<T>(defaultValue ?? items[0]?.value);
  const active = value ?? internalValue;
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const select = (next: T) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const currentIndex = enabled.findIndex((item) => item.value === active);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabled.length;
    if (event.key === 'ArrowLeft')
      nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabled.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextItem = enabled[nextIndex];
    select(nextItem.value);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[items.indexOf(nextItem)]?.focus();
  };

  const activePanel = panels?.[active];

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={cn(
          'flex items-center gap-1 overflow-x-auto',
          variant === 'underline'
            ? 'border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            : 'w-fit rounded-pill border border-line bg-surface-muted/60 p-1',
          listClassName,
        )}
      >
        {items.map((item) => {
          const isActive = item.value === active;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.value}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              className={cn(
                'relative inline-flex items-center gap-2 whitespace-nowrap font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/40 disabled:cursor-not-allowed disabled:opacity-40',
                variant === 'underline'
                  ? 'px-1 pt-1 pb-3 text-[0.8125rem]'
                  : 'rounded-pill px-4 py-1.5 text-[0.8125rem]',
                isActive
                  ? variant === 'underline'
                    ? 'text-ink'
                    : 'bg-surface text-ink shadow-hairline'
                  : 'text-ink-soft hover:text-ink',
              )}
            >
              {Icon && <Icon className="size-3.5" aria-hidden="true" />}
              {item.label}
              {typeof item.count === 'number' && (
                <span
                  className={cn(
                    'rounded-pill px-1.5 py-0.5 text-[0.625rem] tabular-nums',
                    isActive ? 'bg-sage-wash text-sage-ink' : 'bg-surface-muted text-ink-muted',
                  )}
                >
                  {item.count}
                </span>
              )}
              {variant === 'underline' && isActive && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-ink" />
              )}
            </button>
          );
        })}
      </div>

      {panels && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          className={cn('animate-fade-in', panelClassName)}
        >
          {activePanel}
        </div>
      )}
    </div>
  );
}

import { Check, Languages } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LOCALE_META, SUPPORTED_LOCALES, useI18n, type Locale } from '@/i18n';
import { Dropdown } from '@/components/ui/Dropdown';
import type { DropdownItem } from '@/types/ui';

export interface LanguageSwitcherProps {
  /** `compact` shows the short locale code (header), `full` shows the native label. */
  variant?: 'compact' | 'full';
  align?: 'start' | 'end';
  className?: string;
  /** `menu` for the dropdown list, `inline` for a segmented control. */
  display?: 'menu' | 'inline';
}

const items: DropdownItem<Locale>[] = SUPPORTED_LOCALES.map((locale) => ({
  value: locale,
  label: LOCALE_META[locale].label,
  hint: LOCALE_META[locale].short,
}));

export function LanguageSwitcher({
  variant = 'compact',
  align = 'end',
  className,
  display = 'menu',
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  if (display === 'inline') {
    return (
      <div
        role="group"
        aria-label={t('common.changeLanguage')}
        className={cn(
          'inline-flex items-center gap-0.5 rounded-pill border border-line bg-surface p-1',
          className,
        )}
      >
        {SUPPORTED_LOCALES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLocale(item)}
            aria-pressed={locale === item}
            className={cn(
              'inline-flex h-8 items-center rounded-pill px-2.5 text-[0.6875rem] font-medium tracking-[0.04em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45',
              locale === item
                ? 'bg-sage-wash text-sage-ink'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            {LOCALE_META[item].short}
          </button>
        ))}
      </div>
    );
  }

  return (
    <Dropdown<Locale>
      items={items}
      activeValue={locale}
      onSelect={setLocale}
      align={align}
      label={t('common.changeLanguage')}
      panelClassName="w-48"
      className={className}
    >
      <button
        type="button"
        aria-label={t('common.changeLanguage')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface text-ink-soft transition-colors duration-300 hover:border-line-strong hover:text-ink',
          variant === 'compact'
            ? 'h-9 px-3 text-[0.6875rem] font-medium tracking-[0.06em]'
            : 'h-10 px-4 text-[0.8125rem]',
        )}
      >
        {variant === 'compact' ? (
          <Languages className="size-3.5" aria-hidden="true" />
        ) : null}
        <span>{variant === 'compact' ? LOCALE_META[locale].short : LOCALE_META[locale].label}</span>
      </button>
    </Dropdown>
  );
}

/** Radio-style list used inside mobile drawers. */
export function LanguageList({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={cn('flex flex-col gap-1', className)} aria-label={t('common.language')}>
      {SUPPORTED_LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={cn(
            'flex items-center justify-between rounded-sm px-3 py-2.5 text-left text-[0.8125rem] transition-colors',
            locale === item ? 'bg-surface-muted text-ink' : 'text-ink-soft hover:text-ink',
          )}
        >
          <span>{LOCALE_META[item].label}</span>
          {locale === item && <Check className="size-3.5 text-sage-deep" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

import { NavLink as RouterNavLink, type NavLinkRenderProps } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { NavItem } from '@/types/navigation';
import { useI18n } from '@/i18n';

export interface HeaderNavLinkProps {
  item: NavItem;
  onNavigate?: () => void;
  className?: string;
}

/** Editorial header link: hairline underline that grows on hover/active. */
export function HeaderNavLink({ item, onNavigate, className }: HeaderNavLinkProps) {
  const { t } = useI18n();
  const label = t(item.labelKey);

  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          'group relative inline-flex items-center gap-1 py-1 text-[0.8125rem] text-ink-soft transition-colors hover:text-ink',
          className,
        )}
      >
        {label}
        <ArrowUpRight className="size-3 text-ink-faint" aria-hidden="true" />
      </a>
    );
  }

  return (
    <RouterNavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex items-center py-1 text-[0.8125rem] transition-colors duration-300',
          isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
          className,
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            aria-hidden="true"
            className={cn(
              'absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-400 ease-[var(--ease-editorial)]',
              isActive ? 'w-full' : 'w-0 group-hover:w-full',
            )}
          />
        </>
      )}
    </RouterNavLink>
  );
}

export interface SidebarNavLinkProps {
  item: NavItem;
  onNavigate?: () => void;
}

/** Dashboard/admin sidebar link with icon, active pill, and clay tint. */
export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
  const { t } = useI18n();
  const Icon = item.icon;

  return (
    <RouterNavLink
      to={item.to}
      onClick={onNavigate}
      end={item.to === '/app' || item.to === '/admin'}
      className={({ isActive }: NavLinkRenderProps) =>
        cn(
          'group flex items-center gap-2.5 rounded-sm px-3 py-2 text-[0.8125rem] transition-all duration-300',
          isActive
            ? 'bg-surface text-ink shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_6px_16px_-14px_rgba(41,42,37,0.5)]'
            : 'text-ink-soft hover:bg-surface/70 hover:text-ink',
        )
      }
    >
      {Icon && (
        <Icon
          className="size-4 shrink-0 text-ink-faint transition-colors group-hover:text-sage-deep"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{t(item.labelKey)}</span>
      {item.badgeKey && (
        <span className="ml-auto rounded-pill border border-line bg-surface-muted px-1.5 py-0.5 text-[0.5625rem] uppercase tracking-[0.08em] text-ink-faint">
          {t(item.badgeKey)}
        </span>
      )}
    </RouterNavLink>
  );
}

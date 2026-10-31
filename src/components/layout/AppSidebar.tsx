import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import type { NavItem } from '@/types/navigation';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher } from '@/components/brand/LanguageSwitcher';
import { IconButton } from '@/components/ui';
import { SidebarNavLink } from './NavLink';

export interface AppSidebarProps {
  items: NavItem[];
  /** Small label above the nav, e.g. "Workspace" or "Administration". */
  sectionLabel: string;
  /** Name of the current workspace/tenant placeholder. */
  workspaceName: string;
  /** Accent marker: dashboard uses sage, admin uses taupe. */
  accent?: 'sage' | 'taupe';
  onClose?: () => void;
  className?: string;
}

export function AppSidebar({
  items,
  sectionLabel,
  workspaceName,
  accent = 'sage',
  onClose,
  className,
}: AppSidebarProps) {
  const { t } = useI18n();

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col border-r border-line bg-surface-muted/50',
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-5">
        <Logo size="sm" />
        {onClose && (
          <IconButton
            label={t('common.closeMenu')}
            icon={<X className="size-4" />}
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          />
        )}
      </div>

      <div className="px-3">
        <button
          type="button"
          className="group flex w-full items-center gap-2.5 rounded-md border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-line-strong"
          aria-label={workspaceName}
        >
          <span
            className={cn(
              'flex size-6 items-center justify-center rounded-sm text-[0.625rem] font-semibold uppercase',
              accent === 'sage' ? 'bg-sage-wash text-sage-ink' : 'bg-taupe-soft text-ink-soft',
            )}
          >
            {workspaceName.slice(0, 2)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] font-medium text-ink">
              {workspaceName}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 text-ink-faint" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label={sectionLabel} className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        <p className="eyebrow px-3 pb-2">{sectionLabel}</p>
        {items.map((item) => (
          <SidebarNavLink key={item.to} item={item} onNavigate={onClose} />
        ))}
      </nav>

      <div className="space-y-3 border-t border-line p-3">
        <div className="flex items-center justify-center px-1">
          <LanguageSwitcher display="inline" />
        </div>

        <Link
          to={routes.home}
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {t('nav.home')}
        </Link>

        <p className="px-3 pb-1 text-[0.625rem] leading-relaxed text-ink-muted">
          {t('dashboard.disclaimer')}
        </p>
      </div>
    </aside>
  );
}

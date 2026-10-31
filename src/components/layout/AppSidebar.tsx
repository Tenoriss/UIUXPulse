import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PenLine, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { routes } from '@/config/site';
import { useI18n } from '@/i18n';
import type { NavItem } from '@/types/navigation';
import { Logo } from '@/components/brand/Logo';
import { LanguageSwitcher } from '@/components/brand/LanguageSwitcher';
import { IconButton } from '@/components/ui';
import { UserAvatar } from '@/components/profile';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { useAuth } from '@/services/auth.context';
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
  /**
   * Extra links above "back to site". Used by the admin shell for
   * "Back to workspace" and "Sign out"; the workspace passes nothing.
   */
  footer?: ReactNode;
}

export function AppSidebar({
  items,
  sectionLabel,
  workspaceName,
  accent = 'sage',
  onClose,
  className,
  footer,
}: AppSidebarProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside
      className={cn(
        'flex h-full w-64 shrink-0 flex-col border-r border-line bg-surface/60',
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
        {/* Profile entry point: the whole row is the control, with the pencil
            affordance appearing on hover/focus only. */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className="group flex w-full items-center gap-2.5 rounded-md border border-line bg-surface px-2.5 py-2 text-left transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-deep/45"
          aria-label={t('profile.openMenu')}
        >
          <UserAvatar size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] font-medium text-ink">
              {workspaceName}
            </span>
            <span className="block truncate text-[0.6875rem] text-ink-muted">
              {user?.email ?? t('profile.edit')}
            </span>
          </span>
          <PenLine
            className="size-3.5 shrink-0 text-ink-faint transition-colors group-hover:text-ink-soft"
            aria-hidden="true"
          />
        </button>
      </div>

      <nav aria-label={sectionLabel} className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        <p className="eyebrow flex items-center gap-2 px-3 pb-2">
          <span
            className={cn(
              'size-1.5 rounded-full',
              accent === 'sage' ? 'bg-sage-deep' : 'bg-taupe',
            )}
            aria-hidden="true"
          />
          {sectionLabel}
        </p>
        {items.map((item) => (
          <SidebarNavLink key={item.to} item={item} onNavigate={onClose} />
        ))}
      </nav>

      <div className="space-y-3 border-t border-line p-3">
        <div className="flex items-center justify-center px-1">
          <LanguageSwitcher display="inline" />
        </div>

        {footer}

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

      <EditProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </aside>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, PenLine, Plus, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/i18n';
import { routes } from '@/config/site';
import { Button, Dropdown, IconButton } from '@/components/ui';
import { UserAvatar } from '@/components/profile';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { useToast } from '@/providers/ToastProvider';
import { useAuth } from '@/services/auth.context';

export interface AppTopbarProps {
  onMenuClick: () => void;
  /** Breadcrumb-style current section label. */
  sectionLabel: string;
  showNewEvaluation?: boolean;
  className?: string;
}

export function AppTopbar({
  onMenuClick,
  sectionLabel,
  showNewEvaluation = true,
  className,
}: AppTopbarProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-6',
        className,
      )}
    >
      <IconButton
        label={t('common.openMenu')}
        icon={<Menu className="size-4.5" />}
        tone="ghost"
        size="sm"
        onClick={onMenuClick}
        className="lg:hidden"
      />

      <div className="flex min-w-0 items-center gap-2.5">
        <span className="hidden text-micro uppercase tracking-[0.12em] text-ink-muted sm:inline">
          {t('dashboard.workspace')}
        </span>
        <span className="hidden size-1 rounded-full bg-line-strong sm:block" aria-hidden="true" />
        <span className="truncate text-[0.8125rem] font-medium text-ink">{sectionLabel}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {showNewEvaluation && (
          <Button
            size="sm"
            tone="dark"
            leadingIcon={<Plus className="size-3.5" aria-hidden="true" />}
            onClick={() =>
              toast({
                title: t('common.comingSoon'),
                description: t('dashboard.evaluations.body'),
                variant: 'info',
              })
            }
            className="hidden sm:inline-flex"
          >
            {t('dashboard.newEvaluation')}
          </Button>
        )}

        <IconButton
          label={t('common.comingSoon')}
          icon={<Bell className="size-4" />}
          tone="ghost"
          size="sm"
          onClick={() =>
            toast({ title: t('common.comingSoon'), variant: 'info' })
          }
        />

        {isAdmin && (
          <IconButton
            label={t('admin.nav.openAdmin')}
            icon={<ShieldCheck className="size-4" />}
            tone="ghost"
            size="sm"
            onClick={() => navigate(routes.admin)}
          />
        )}

        <Dropdown
          align="end"
          panelClassName="w-56"
          onSelect={(value) => {
            if (value === 'profile') {
              setProfileOpen(true);
              return;
            }
            if (value === 'settings') {
              navigate(routes.settings);
              return;
            }
            // Leave the guarded area *before* clearing the session. Doing it
            // the other way round lets `<RequireAuth />` redirect to sign-in at
            // the same moment, and the two navigations race.
            navigate(routes.home, { replace: true });
            void logout().then(() => {
              toast({
                title: t('auth.signedOutTitle'),
                description: t('auth.signedOutLead'),
                variant: 'info',
              });
            });
          }}
          items={[
            {
              value: 'profile',
              label: t('profile.edit'),
              description: user?.email,
              icon: PenLine,
              separated: true,
            },
            {
              value: 'settings',
              label: t('dashboard.nav.settings'),
              icon: Settings,
            },
            { value: 'signout', label: t('dashboard.signOut'), icon: LogOut },
          ]}
        >
          <button
            type="button"
            aria-label={t('profile.menuLabel')}
            className="flex items-center gap-2 rounded-pill border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong"
          >
            <UserAvatar size="sm" />
            <span className="hidden max-w-32 truncate text-[0.75rem] font-medium text-ink-soft sm:block">
              {user?.name || user?.email || t('common.you')}
            </span>
          </button>
        </Dropdown>
      </div>

      {/* Route key is intentionally unused visually; it keeps the bar in sync
          with navigation so focus/scroll behaviour resets per section. */}
      <EditProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />

      <span key={location.pathname} className="sr-only" aria-live="polite">
        {sectionLabel}
      </span>
    </header>
  );
}

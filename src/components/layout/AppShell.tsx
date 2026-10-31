import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { AppSidebar, type AppSidebarProps } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

export type AppShellProps = Omit<AppSidebarProps, 'onClose' | 'className'> & {
  topbar: { sectionLabel: string; showNewEvaluation?: boolean };
  children: React.ReactNode;
  contentClassName?: string;
};

/**
 * Shared shell for authenticated areas (dashboard + admin):
 * fixed sidebar on desktop, slide-over drawer on smaller screens.
 */
export function AppShell({ topbar, children, contentClassName, ...sidebarProps }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useLockBodyScroll(drawerOpen);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  return (
    <div className="flex min-h-dvh bg-canvas">
      <div className="sticky top-0 hidden h-dvh lg:block">
        <AppSidebar {...sidebarProps} />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/25 backdrop-blur-[2px] animate-fade-in"
          />
          <div className="relative h-full w-64 animate-fade-up shadow-clay-lg">
            <AppSidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar onMenuClick={() => setDrawerOpen(true)} {...topbar} />
        <main id="main-content" className={cn('flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-10', contentClassName)}>
          {children}
        </main>
      </div>
    </div>
  );
}

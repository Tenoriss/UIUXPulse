import type { RouteObject } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { GuideLayout } from '@/layouts/GuideLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { CriteriaPage } from '@/pages/public/CriteriaPage';
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { StartEvaluationPage } from '@/pages/public/StartEvaluationPage';
import { PrinciplesPage } from '@/pages/public/PrinciplesPage';
import { MethodologyPage } from '@/pages/public/MethodologyPage';
import { SignInPage } from '@/pages/auth/SignInPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { EvaluationsPage } from '@/pages/dashboard/EvaluationsPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminQueuePage } from '@/pages/admin/AdminQueuePage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminCriteriaPage } from '@/pages/admin/AdminCriteriaPage';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { RouteErrorBoundary } from '@/pages/errors/RouteErrorBoundary';
import { routes } from '@/config/site';

/**
 * Pathless layout routes keep each shell independent while sharing the URL
 * space: public pages, auth pages, the workspace, and admin tools.
 *
 * All four branches are nested inside `GuideLayout` so the mascot guide —
 * which calls `useLocation()` — always has router context.
 */
export const appRoutes: RouteObject[] = [
  {
    element: <GuideLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <PublicLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'how-it-works', element: <HowItWorksPage /> },
          { path: 'criteria', element: <CriteriaPage /> },
          { path: 'start', element: <StartEvaluationPage /> },
          { path: 'principles', element: <PrinciplesPage /> },
          { path: 'methodology', element: <MethodologyPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { path: 'sign-in', element: <SignInPage /> },
          { path: 'sign-up', element: <SignUpPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
      {
        path: routes.dashboard,
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'evaluations', element: <EvaluationsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage inApp /> },
        ],
      },
      {
        path: routes.admin,
        element: <AdminLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: 'queue', element: <AdminQueuePage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'criteria', element: <AdminCriteriaPage /> },
          { path: 'settings', element: <SettingsPage admin /> },
          { path: '*', element: <NotFoundPage inApp /> },
        ],
      },
    ],
  },
];

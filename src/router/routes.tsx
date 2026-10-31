import { Navigate, type RouteObject } from 'react-router-dom';
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
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated';
import { SignInPage } from '@/pages/auth/SignInPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { LegacySignUpRedirect } from '@/pages/auth/LegacySignUpRedirect';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { EvaluationsPage } from '@/pages/dashboard/evaluations/EvaluationsPage';
import { EvaluationWizardPage } from '@/pages/dashboard/evaluations/EvaluationWizardPage';
import { EvaluationDetailPage } from '@/pages/dashboard/evaluations/EvaluationDetailPage';
import { EvaluationResultsPage } from '@/pages/dashboard/evaluations/EvaluationResultsPage';
import { EvaluationAuditPage } from '@/pages/dashboard/evaluations/EvaluationAuditPage';
import { EvaluationRecommendationsPage } from '@/pages/dashboard/evaluations/EvaluationRecommendationsPage';
import { EvaluationReportPage } from '@/pages/dashboard/evaluations/EvaluationReportPage';
import { WebsitesPage } from '@/pages/dashboard/websites/WebsitesPage';
import { WebsiteNewPage } from '@/pages/dashboard/websites/WebsiteNewPage';
import { WebsiteDetailPage } from '@/pages/dashboard/websites/WebsiteDetailPage';
import { WebsiteEditPage } from '@/pages/dashboard/websites/WebsiteEditPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminEvaluationsPage } from '@/pages/admin/AdminEvaluationsPage';
import { AdminEvaluationDetailPage } from '@/pages/admin/AdminEvaluationDetailPage';
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
          // Signed-in visitors are bounced out of these three; the reset screen
          // stays reachable on purpose.
          {
            element: <RedirectIfAuthenticated />,
            children: [
              { path: 'sign-in', element: <SignInPage /> },
              { path: 'register', element: <RegisterPage /> },
              { path: 'forgot-password', element: <ForgotPasswordPage /> },
            ],
          },
          { path: 'reset-password', element: <ResetPasswordPage /> },
          { path: 'sign-up', element: <LegacySignUpRedirect /> },
        ],
      },
      {
        // Guard wraps the shell, not the other way round: `<RequireAuth />`
        // replaces `element`, so the layout must live below it or it would
        // never mount.
        element: <RequireAuth />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: routes.dashboard,
            element: <DashboardLayout />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { index: true, element: <OverviewPage /> },
              { path: 'websites', element: <WebsitesPage /> },
              { path: 'websites/new', element: <WebsiteNewPage /> },
              { path: 'websites/:id', element: <WebsiteDetailPage /> },
              { path: 'websites/:id/edit', element: <WebsiteEditPage /> },
              { path: 'evaluations', element: <EvaluationsPage /> },
              { path: 'evaluations/new', element: <EvaluationWizardPage /> },
              { path: 'evaluations/:id', element: <EvaluationDetailPage /> },
              { path: 'evaluations/:id/results', element: <EvaluationResultsPage /> },
              { path: 'evaluations/:id/audit', element: <EvaluationAuditPage /> },
              { path: 'evaluations/:id/recommendations', element: <EvaluationRecommendationsPage /> },
              { path: 'evaluations/:id/report', element: <EvaluationReportPage /> },
              { path: 'reports', element: <ReportsPage /> },
              { path: 'settings', element: <SettingsPage /> },
              { path: '*', element: <NotFoundPage inApp /> },
            ],
          },
        ],
      },
      {
        // Both guards, in this order: identity first, then role. An
        // unauthenticated visitor is sent to sign-in; a signed-in `user` is
        // sent to their own workspace. Neither can reach the admin shell.
        element: <RequireAuth />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: routes.admin,
            element: <RequireAdmin />,
            errorElement: <RouteErrorBoundary />,
            children: [
              {
                element: <AdminLayout />,
                errorElement: <RouteErrorBoundary />,
                children: [
                  { index: true, element: <AdminOverviewPage /> },
                  { path: 'users', element: <AdminUsersPage /> },
                  { path: 'users/:id', element: <AdminUserDetailPage /> },
                  { path: 'evaluations', element: <AdminEvaluationsPage /> },
                  { path: 'evaluations/:id', element: <AdminEvaluationDetailPage /> },
                  { path: 'criteria', element: <AdminCriteriaPage /> },
                  { path: 'settings', element: <SettingsPage admin /> },
                  // Legacy alias from Phase 1, forwards to the evaluations list.
                  { path: 'queue', element: <Navigate to={routes.adminEvaluations} replace /> },
                  { path: '*', element: <NotFoundPage inApp /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

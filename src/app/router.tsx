import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute, AccountRouteGuard, PermissionGate } from '@/features/auth';
import { AppLayout } from '@/widgets/layout/AppLayout';
import { AccountLayout } from '@/widgets/layout/AccountLayout';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { PERMISSIONS } from '@/shared/constants/permissions';

// ── Lazy pages ────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/account/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/account/RegisterPage'));
const RegisterTenantPage = lazy(() => import('@/pages/account/RegisterTenantPage'));
const RegisterTenantResultPage = lazy(() => import('@/pages/account/RegisterTenantResultPage'));
const SelectEditionPage = lazy(() => import('@/pages/account/SelectEditionPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/account/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/account/ResetPasswordPage'));
const ConfirmEmailPage = lazy(() => import('@/pages/account/ConfirmEmailPage'));
const EmailActivationPage = lazy(() => import('@/pages/account/EmailActivationPage'));
const SendTwoFactorCodePage = lazy(() => import('@/pages/account/SendTwoFactorCodePage'));
const ValidateTwoFactorCodePage = lazy(() => import('@/pages/account/ValidateTwoFactorCodePage'));
const BuyPage = lazy(() => import('@/pages/account/payment/BuyPage'));
const ExtendPage = lazy(() => import('@/pages/account/payment/ExtendPage'));
const UpgradePage = lazy(() => import('@/pages/account/payment/UpgradePage'));

const DashboardPage = lazy(() => import('@/pages/main/DashboardPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

const HostDashboardPage = lazy(() => import('@/pages/admin/HostDashboardPage'));
const AuditLogsPage = lazy(() => import('@/pages/admin/audit-logs/AuditLogsPage'));
const EditionsPage = lazy(() => import('@/pages/admin/editions/EditionsPage'));
const LanguagesPage = lazy(() => import('@/pages/admin/languages/LanguagesPage'));
const LanguageTextsPage = lazy(() => import('@/pages/admin/languages/LanguageTextsPage'));
const MaintenancePage = lazy(() => import('@/pages/admin/maintenance/MaintenancePage'));
const OrganizationUnitsPage = lazy(() => import('@/pages/admin/organization-units/OrganizationUnitsPage'));
const RolesPage = lazy(() => import('@/pages/admin/roles/RolesPage'));
const HostSettingsPage = lazy(() => import('@/pages/admin/settings/HostSettingsPage'));
const TenantSettingsPage = lazy(() => import('@/pages/admin/settings/TenantSettingsPage'));
const SubscriptionManagementPage = lazy(() => import('@/pages/admin/subscription-management/SubscriptionManagementPage'));
const TenantsPage = lazy(() => import('@/pages/admin/tenants/TenantsPage'));
const UiCustomizationPage = lazy(() => import('@/pages/admin/ui-customization/UiCustomizationPage'));
const UsersPage = lazy(() => import('@/pages/admin/users/UsersPage'));
const InstallPage = lazy(() => import('@/pages/admin/install/InstallPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullPage />}>{node}</Suspense>
);

const router = createBrowserRouter([
  // 1. Public account routes
  {
    path: '/account',
    element: (
      <AccountRouteGuard>
        <AccountLayout />
      </AccountRouteGuard>
    ),
    children: [
      { index: true, element: withSuspense(<LoginPage />) },
      { path: 'login', element: withSuspense(<LoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      { path: 'register-tenant', element: withSuspense(<RegisterTenantPage />) },
      { path: 'register-tenant-result', element: withSuspense(<RegisterTenantResultPage />) },
      { path: 'select-edition', element: withSuspense(<SelectEditionPage />) },
      { path: 'forgot-password', element: withSuspense(<ForgotPasswordPage />) },
      { path: 'reset-password', element: withSuspense(<ResetPasswordPage />) },
      { path: 'confirm-email', element: withSuspense(<ConfirmEmailPage />) },
      { path: 'email-activation', element: withSuspense(<EmailActivationPage />) },
      { path: 'send-two-factor-code', element: withSuspense(<SendTwoFactorCodePage />) },
      { path: 'validate-two-factor-code', element: withSuspense(<ValidateTwoFactorCodePage />) },
      { path: 'payment/buy', element: withSuspense(<BuyPage />) },
      { path: 'payment/extend', element: withSuspense(<ExtendPage />) },
      { path: 'payment/upgrade', element: withSuspense(<UpgradePage />) },
    ],
  },

  // 2. Authenticated app shell
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'notifications', element: withSuspense(<NotificationsPage />) },
      {
        path: 'admin',
        children: [
          { path: 'host-dashboard', element: withSuspense(<HostDashboardPage />) },
          { path: 'audit-logs', element: withSuspense(<AuditLogsPage />) },
          { path: 'editions', element: withSuspense(<EditionsPage />) },
          { path: 'languages', element: withSuspense(<LanguagesPage />) },
          { path: 'languages/:name/texts', element: withSuspense(<LanguageTextsPage />) },
          { path: 'maintenance', element: withSuspense(<MaintenancePage />) },
          { path: 'organization-units', element: withSuspense(<OrganizationUnitsPage />) },
          {
            path: 'roles',
            element: (
              <PermissionGate>
                {withSuspense(<RolesPage />)}
              </PermissionGate>
            ),
            handle: { permission: PERMISSIONS.ROLES_VIEW },
          },
          { path: 'settings/host', element: withSuspense(<HostSettingsPage />), handle: { permission: PERMISSIONS.SETTINGS_VIEW } },
          { path: 'settings/tenant', element: withSuspense(<TenantSettingsPage />), handle: { permission: PERMISSIONS.SETTINGS_VIEW } },
          { path: 'subscription-management', element: withSuspense(<SubscriptionManagementPage />) },
          { path: 'tenants', element: withSuspense(<TenantsPage />) },
          { path: 'ui-customization', element: withSuspense(<UiCustomizationPage />) },
          {
            path: 'users',
            element: (
              <PermissionGate>
                {withSuspense(<UsersPage />)}
              </PermissionGate>
            ),
            handle: { permission: PERMISSIONS.USERS_VIEW },
          },
        ],
      },
    ],
  },

  // 3. Standalone routes
  { path: '/install', element: withSuspense(<InstallPage />) },
  { path: '/forbidden', element: withSuspense(<ForbiddenPage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

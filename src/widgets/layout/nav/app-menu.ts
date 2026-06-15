import type { AppMenuItem } from './app-menu-item';
import { PERMISSIONS } from '@/shared/constants/permissions';

/**
 * Single source of truth for sidebar + topbar navigation.
 * Mirrors Angular `app-menu.ts`. Each item can optionally require a permission;
 * the Sidebar/TopBar components filter items the current user lacks access to.
 */
export const appMenu: AppMenuItem[] = [
  {
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/',
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    name: 'Administration',
    icon: 'Shield',
    items: [
      { name: 'Host Dashboard', route: '/admin/host-dashboard' },
      { name: 'Tenants', route: '/admin/tenants' },
      { name: 'Editions', route: '/admin/editions' },
      { name: 'Users', route: '/admin/users', permission: PERMISSIONS.USERS_VIEW },
      { name: 'Roles', route: '/admin/roles', permission: PERMISSIONS.ROLES_VIEW },
      { name: 'Organization Units', route: '/admin/organization-units' },
      { name: 'Languages', route: '/admin/languages' },
      { name: 'Audit Logs', route: '/admin/audit-logs' },
      { name: 'Maintenance', route: '/admin/maintenance' },
      { name: 'Subscription', route: '/admin/subscription-management' },
      { name: 'Settings (Host)', route: '/admin/settings/host', permission: PERMISSIONS.SETTINGS_VIEW },
      { name: 'Settings (Tenant)', route: '/admin/settings/tenant', permission: PERMISSIONS.SETTINGS_VIEW },
      { name: 'UI Customization', route: '/admin/ui-customization' },
    ],
  },
];

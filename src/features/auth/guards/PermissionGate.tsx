import type { ReactNode } from 'react';
import { useMatches } from 'react-router-dom';
import { PermissionGuard } from '@/shared/components/PermissionGuard';

interface RouteHandle {
  permission?: string | string[];
  permissionMode?: 'any' | 'all';
}

/**
 * Route-level wrapper that reads `handle.permission` from the matched route
 * and runs it through the existing PermissionGuard.
 *
 * Usage in router.tsx:
 *   { path: 'audit-logs', element: <PermissionGate><AuditLogsPage /></PermissionGate>,
 *     handle: { permission: PERMISSIONS.USERS_VIEW } }
 */
export function PermissionGate({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const handle = matches[matches.length - 1]?.handle as RouteHandle | undefined;

  if (!handle?.permission) return <>{children}</>;

  return (
    <PermissionGuard permission={handle.permission} mode={handle.permissionMode ?? 'any'}>
      {children}
    </PermissionGuard>
  );
}

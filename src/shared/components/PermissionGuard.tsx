import { type ReactNode } from 'react';
import { useAuthStore } from '@/shared/stores/auth-store';

interface PermissionGuardProps {
  permission: string | string[];
  mode?: 'any' | 'all';
  children: ReactNode;
  unauthorized?: ReactNode;
}

/**
 * Route-level permission guard.
 * Renders an "Unauthorized" page if user lacks permissions.
 * Use this at the page/route level, use <Can> for inline UI elements.
 */
export function PermissionGuard({
  permission,
  mode = 'any',
  children,
  unauthorized,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore();

  const permissions = Array.isArray(permission) ? permission : [permission];

  let hasAccess: boolean;
  if (permissions.length === 1) {
    hasAccess = hasPermission(permissions[0]!);
  } else if (mode === 'all') {
    hasAccess = hasAllPermissions(permissions);
  } else {
    hasAccess = hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return (
      unauthorized ?? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-destructive">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required: {permissions.join(', ')}
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

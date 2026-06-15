import { type ReactNode } from 'react';
import { useAuthStore } from '@/shared/stores/auth-store';

interface CanProps {
  permission: string | string[];
  mode?: 'any' | 'all';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Permission-based rendering component.
 * Only renders children if the user has the required permission(s).
 *
 * @example
 * <Can permission="users.create">
 *   <CreateUserButton />
 * </Can>
 *
 * @example
 * <Can permission={["users.edit", "users.delete"]} mode="any">
 *   <UserActions />
 * </Can>
 */
export function Can({ permission, mode = 'any', children, fallback = null }: CanProps) {
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

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook for programmatic permission checks
 */
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, user } = useAuthStore();

  return {
    can: hasPermission,
    canAny: hasAnyPermission,
    canAll: hasAllPermissions,
    hasRole,
    permissions: user?.permissions ?? [],
    roles: user?.roles ?? [],
  };
}

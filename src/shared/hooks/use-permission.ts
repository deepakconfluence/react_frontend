import { useAuthStore } from '@/shared/stores/auth-store';

/**
 * React equivalent of Angular's `permission.pipe.ts`.
 *
 * @example
 * const canEditUsers = usePermission('users.edit');
 */
export function usePermission(permission: string): boolean {
  return useAuthStore((s) => s.user?.permissions.includes(permission) ?? false);
}

export function useAnyPermission(permissions: string[]): boolean {
  return useAuthStore((s) =>
    permissions.some((p) => s.user?.permissions.includes(p) ?? false)
  );
}

export function useAllPermissions(permissions: string[]): boolean {
  return useAuthStore((s) =>
    permissions.every((p) => s.user?.permissions.includes(p) ?? false)
  );
}

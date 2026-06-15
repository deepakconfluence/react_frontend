import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';

interface AccountRouteGuardProps {
  children: ReactNode;
}

/**
 * React equivalent of Angular `account-route-guard.ts`.
 * Redirects authenticated users away from /account/* back to the app shell.
 */
export function AccountRouteGuard({ children }: AccountRouteGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

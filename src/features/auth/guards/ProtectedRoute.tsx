import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * React equivalent of Angular `auth-route-guard.ts`.
 * Redirects unauthenticated users to /account/login, preserving the intended destination.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

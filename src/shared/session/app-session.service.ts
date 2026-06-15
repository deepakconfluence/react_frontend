import { useAuthStore } from '@/shared/stores/auth-store';
import { useSessionStore } from '@/shared/stores/session-store';

/**
 * Replaces Angular `app-session.service.ts`.
 * One-shot bootstrap that runs on app start. Hydrates tenant/user state.
 */
export const appSession = {
  init(): Promise<void> {
    // TODO: call /api/services/session/get-current-login-information and hydrate stores
    return Promise.resolve();
  },

  get isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  },

  get tenantId(): string | null {
    return useSessionStore.getState().tenant?.id ?? null;
  },

  get tenancyName(): string | null {
    return useSessionStore.getState().tenant?.tenancyName ?? null;
  },
};

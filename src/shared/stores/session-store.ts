import { create } from 'zustand';

interface TenantInfo {
  id: string;
  tenancyName: string;
  name: string;
}

interface SessionState {
  tenant: TenantInfo | null;
  applicationName: string;
  setTenant: (tenant: TenantInfo | null) => void;
  setApplicationName: (name: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  tenant: null,
  applicationName: 'Confluence Enterprise SaaS',
  setTenant: (tenant) => set({ tenant }),
  setApplicationName: (name) => set({ applicationName: name }),
}));

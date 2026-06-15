export interface HostSettings {
  general: Record<string, unknown>;
  tenant: Record<string, unknown>;
  email: Record<string, unknown>;
}

export interface TenantSettings {
  general: Record<string, unknown>;
  email: Record<string, unknown>;
}

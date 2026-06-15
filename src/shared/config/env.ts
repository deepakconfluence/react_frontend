/**
 * Typed wrapper around Vite's import.meta.env.
 * Mirrors Angular's `environments/environment.ts` pattern but Vite-native.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'Confluence Enterprise SaaS',
  mode: import.meta.env.MODE as 'development' | 'production' | 'staging',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export type AppEnv = typeof env;

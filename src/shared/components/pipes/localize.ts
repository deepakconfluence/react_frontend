/**
 * Pure-function localization. Wire to react-i18next once translations are loaded.
 * Mirrors Angular `localize.pipe.ts`.
 */
export function localize(key: string, fallback?: string): string {
  return fallback ?? key;
}

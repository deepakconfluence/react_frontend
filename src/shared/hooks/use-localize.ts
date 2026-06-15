/**
 * React equivalent of Angular's `localize.pipe.ts`.
 * For now this is a pass-through stub. Wire to react-i18next when ready.
 *
 * @example
 * const t = useLocalize();
 * t('Welcome'); // returns 'Welcome' (or translated string once i18n is wired)
 */
export function useLocalize() {
  return (key: string, fallback?: string): string => fallback ?? key;
}

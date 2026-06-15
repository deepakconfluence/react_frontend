/**
 * i18next initialization. Wires up react-i18next once `pnpm install` adds the deps
 * declared in package.json. Until then this file is a no-op stub.
 */
export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'tr'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export async function initI18n(): Promise<void> {
  // TODO: uncomment once `i18next` + `react-i18next` are installed.
  //
  // const i18next = (await import('i18next')).default;
  // const { initReactI18next } = await import('react-i18next');
  // const LanguageDetector = (await import('i18next-browser-languagedetector')).default;
  // const HttpBackend = (await import('i18next-http-backend')).default;
  //
  // await i18next
  //   .use(HttpBackend)
  //   .use(LanguageDetector)
  //   .use(initReactI18next)
  //   .init({
  //     fallbackLng: DEFAULT_LOCALE,
  //     supportedLngs: [...SUPPORTED_LOCALES],
  //     backend: { loadPath: '/assets/locales/{{lng}}/translation.json' },
  //   });
}

import type { ThemeName } from '@/shared/stores/theme-store';

/**
 * Port of Angular `ThemeHelper.ts`. Resolves theme metadata.
 */
export const themeHelper = {
  baseClass(theme: ThemeName): string {
    return `theme-${theme}`;
  },

  isDefaultTheme(theme: ThemeName): boolean {
    return theme === 'default';
  },
};

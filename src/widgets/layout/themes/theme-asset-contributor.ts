import type { ThemeName } from '@/shared/stores/theme-store';

/**
 * Port of Angular `ThemeAssetContributor.ts` + theme-specific contributors.
 * Each theme can declare extra CSS/JS bundles to load when active.
 */
export interface ThemeAssetContributor {
  scripts: string[];
  styles: string[];
}

export const themeAssetContributors: Record<ThemeName, ThemeAssetContributor> = {
  default: { scripts: [], styles: [] },
  theme2: { scripts: [], styles: [] },
  theme3: { scripts: [], styles: [] },
  theme6: { scripts: [], styles: [] },
  theme7: { scripts: [], styles: [] },
  theme8: { scripts: [], styles: [] },
  theme10: { scripts: [], styles: [] },
  theme11: { scripts: [], styles: [] },
};

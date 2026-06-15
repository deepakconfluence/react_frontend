import { loadScript } from './script-loader';
import { loadStyle } from './style-loader';

/**
 * Port of Angular `DynamicResourcesHelper.ts`.
 * Loads theme-specific CSS/JS bundles at runtime.
 */
export const dynamicResources = {
  loadResources(scripts: string[] = [], styles: string[] = []): Promise<void[]> {
    return Promise.all([
      ...scripts.map((src) => loadScript(src)),
      ...styles.map((href) => loadStyle(href)),
    ]);
  },
};

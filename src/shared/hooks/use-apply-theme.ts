import { useEffect } from 'react';
import { useThemeStore } from '@/shared/stores/theme-store';

/**
 * Applies the persisted theme + color scheme to the <html> element:
 *   - `colorScheme` → toggles the `.dark` class (resolving `system` via the
 *     `prefers-color-scheme` media query and reacting to OS changes).
 *   - `theme` → sets the `data-theme` attribute, which the per-theme color
 *     palettes in `index.css` key off of.
 *
 * Mount once at the app root (App.tsx) so it applies everywhere, including the
 * unauthenticated /account pages.
 */
export function useApplyTheme() {
  const theme = useThemeStore((s) => s.theme);
  const colorScheme = useThemeStore((s) => s.colorScheme);

  // Theme palette → data-theme on <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Light / Dark / System → `.dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;

    const apply = (isDark: boolean) => {
      root.classList.toggle('dark', isDark);
      root.style.colorScheme = isDark ? 'dark' : 'light';
    };

    if (colorScheme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const onChange = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }

    apply(colorScheme === 'dark');
  }, [colorScheme]);
}

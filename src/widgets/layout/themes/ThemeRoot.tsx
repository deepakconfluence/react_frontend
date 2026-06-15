import type { ReactNode } from 'react';
import { useThemeStore } from '@/shared/stores/theme-store';
import { DefaultLayout } from './default/DefaultLayout';
import { Theme2Layout } from './theme2/Theme2Layout';
import { Theme3Layout } from './theme3/Theme3Layout';
import { Theme6Layout } from './theme6/Theme6Layout';
import { Theme7Layout } from './theme7/Theme7Layout';
import { Theme8Layout } from './theme8/Theme8Layout';
import { Theme10Layout } from './theme10/Theme10Layout';
import { Theme11Layout } from './theme11/Theme11Layout';

/**
 * Routes the active theme to its registered Layout component.
 * If `fallback` is supplied, it's used when the active theme is 'default'.
 * Angular equivalent: `themes-layout-base.component.ts` + per-theme `*-layout.component`.
 */
export function ThemeRoot({ fallback }: { fallback?: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  switch (theme) {
    case 'theme2':
      return <Theme2Layout />;
    case 'theme3':
      return <Theme3Layout />;
    case 'theme6':
      return <Theme6Layout />;
    case 'theme7':
      return <Theme7Layout />;
    case 'theme8':
      return <Theme8Layout />;
    case 'theme10':
      return <Theme10Layout />;
    case 'theme11':
      return <Theme11Layout />;
    case 'default':
    default:
      return fallback ? <>{fallback}</> : <DefaultLayout />;
  }
}

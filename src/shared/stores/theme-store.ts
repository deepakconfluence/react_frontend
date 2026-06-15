import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName =
  | 'default'
  | 'theme2'
  | 'theme3'
  | 'theme6'
  | 'theme7'
  | 'theme8'
  | 'theme10'
  | 'theme11';

export type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeName;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeName) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'default',
      colorScheme: 'system',
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    { name: 'theme-store' }
  )
);

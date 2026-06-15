import { Palette } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useThemeStore, type ThemeName } from '@/shared/stores/theme-store';

const THEMES: ThemeName[] = ['default', 'theme2', 'theme3', 'theme6', 'theme7', 'theme8', 'theme10', 'theme11'];

export function ThemeSelectionPanel() {
  const { theme, setTheme, colorScheme, setColorScheme } = useThemeStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Color scheme</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setColorScheme('light')}>
          {colorScheme === 'light' ? '✓ ' : '  '}Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorScheme('dark')}>
          {colorScheme === 'dark' ? '✓ ' : '  '}Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setColorScheme('system')}>
          {colorScheme === 'system' ? '✓ ' : '  '}System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {THEMES.map((t) => (
          <DropdownMenuItem key={t} onSelect={() => setTheme(t)}>
            {theme === t ? '✓ ' : '  '}{t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

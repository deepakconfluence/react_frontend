import { Menu } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useUIStore } from '@/shared/stores/ui-store';
import { LanguageSwitch } from '@/shared/localization/LanguageSwitch';
import { HeaderNotifications } from './notifications/HeaderNotifications';
import { ThemeSelectionPanel } from './theme-selection/ThemeSelectionPanel';
import { ProfileMenu } from './profile/ProfileMenu';

export function Topbar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const sidebarActionLabel = sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <header className="sticky top-0 z-20 h-14 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={sidebarActionLabel}
          title={sidebarActionLabel}
          aria-controls="app-sidebar"
          aria-expanded={!sidebarCollapsed}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <HeaderNotifications />
        <LanguageSwitch />
        <ThemeSelectionPanel />
        <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />
        <ProfileMenu compact />
      </div>
    </header>
  );
}

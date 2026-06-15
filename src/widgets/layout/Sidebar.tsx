import { useUIStore } from '@/shared/stores/ui-store';
import { SideBarMenu } from './nav/SideBarMenu';
import { cn } from '@/shared/lib/utils';

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <aside
      id="app-sidebar"
      aria-label="Primary navigation"
      className={cn(
        'shrink-0 bg-card border-r flex flex-col transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b">
        <h1 className={cn('text-lg font-bold text-primary truncate', collapsed && 'sr-only')}>
          Confluence Enterprise SaaS
        </h1>
        {!collapsed && <p className="text-xs text-muted-foreground">Admin Panel</p>}
      </div>

      {!collapsed && <SideBarMenu />}
    </aside>
  );
}

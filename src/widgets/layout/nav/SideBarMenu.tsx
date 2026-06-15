import { NavLink } from 'react-router-dom';
import { appMenu } from './app-menu';
import type { AppMenuItem } from './app-menu-item';
import { useAuthStore } from '@/shared/stores/auth-store';
import { cn } from '@/shared/lib/utils';

function canSee(item: AppMenuItem, has: (p: string) => boolean): boolean {
  if (!item.permission) return true;
  return has(item.permission);
}

export function SideBarMenu() {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {appMenu.filter((i) => canSee(i, hasPermission)).map((item) => (
        <MenuGroup key={item.name} item={item} hasPermission={hasPermission} />
      ))}
    </nav>
  );
}

function MenuGroup({ item, hasPermission }: { item: AppMenuItem; hasPermission: (p: string) => boolean }) {
  const visibleChildren = item.items?.filter((c) => canSee(c, hasPermission)) ?? [];

  if (!item.items) {
    return (
      <NavLink
        to={item.route ?? '#'}
        end={item.route === '/'}
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            'block px-3 py-2 rounded-md text-sm transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          )
        }
      >
        {item.name}
      </NavLink>
    );
  }

  if (visibleChildren.length === 0) return null;

  return (
    <div className="pt-2">
      <p className="px-3 text-[11px] uppercase tracking-wide text-muted-foreground">{item.name}</p>
      <div className="mt-1 space-y-0.5">
        {visibleChildren.map((child) => (
          <NavLink
            key={child.route}
            to={child.route ?? '#'}
            className={({ isActive }) =>
              cn(
                'block px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )
            }
          >
            {child.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

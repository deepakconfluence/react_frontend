import { NavLink } from 'react-router-dom';
import { appMenu } from './app-menu';
import { useAuthStore } from '@/shared/stores/auth-store';
import { cn } from '@/shared/lib/utils';

export function TopBarMenu() {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <nav className="hidden md:flex items-center gap-1">
      {appMenu
        .filter((i) => !i.permission || hasPermission(i.permission))
        .filter((i) => i.route)
        .map((item) => (
          <NavLink
            key={item.name}
            to={item.route!}
            end={item.route === '/'}
            className={({ isActive }: { isActive: boolean }) =>
              cn(
                'px-3 py-1.5 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted'
              )
            }
          >
            {item.name}
          </NavLink>
        ))}
    </nav>
  );
}

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/data-display/Avatar';
import { useAuthStore } from '@/shared/stores/auth-store';
import { useLogout } from '@/features/auth/api/auth-api';
import { ChangePasswordModal } from './ChangePasswordModal';
import { MySettingsModal } from './MySettingsModal';

interface ProfileMenuProps {
  /** When true, render a compact avatar-only trigger (e.g. in the topbar). Otherwise show the wide name+email card. */
  compact?: boolean;
}

export function ProfileMenu({ compact = false }: ProfileMenuProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [openModal, setOpenModal] = useState<'password' | 'settings' | null>(null);

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {compact ? (
            <button
              type="button"
              aria-label="Account menu"
              className="rounded-full hover:ring-2 hover:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <button
              type="button"
              className="w-full flex items-center gap-3 text-left hover:bg-muted rounded-md p-1"
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user?.fullName}</span>
              <span className="text-xs text-muted-foreground font-normal truncate">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpenModal('settings')}>My settings</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setOpenModal('password')}>Change password</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => logout.mutate()} className="text-destructive">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordModal open={openModal === 'password'} onClose={() => setOpenModal(null)} />
      <MySettingsModal open={openModal === 'settings'} onClose={() => setOpenModal(null)} />
    </>
  );
}

import { Avatar, AvatarFallback } from '@/shared/components/data-display/Avatar';

interface ChatFriendListItemProps {
  name: string;
  unreadCount?: number;
  online?: boolean;
  onSelect?: () => void;
}

export function ChatFriendListItem({ name, unreadCount, online, onSelect }: ChatFriendListItemProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-left"
    >
      <div className="relative">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {online && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />}
      </div>
      <span className="flex-1 truncate text-sm">{name}</span>
      {unreadCount ? (
        <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
          {unreadCount}
        </span>
      ) : null}
    </button>
  );
}

import { Avatar, AvatarFallback } from '@/shared/components/data-display/Avatar';

interface ChatFriendListItemProps {
  name: string;
  unreadCount?: number;
  online?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ChatFriendListItem({
  name,
  unreadCount,
  online,
  isSelected,
  onSelect,
}: ChatFriendListItemProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  const unreadLabel = unreadCount && unreadCount > 99 ? '99+' : unreadCount;
  const onlineStatusLabel = online ? 'online' : 'offline';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Open chat with ${name} (${onlineStatusLabel})`}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSelected ? 'bg-muted' : ''}`}
    >
      <div className="relative">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {online && <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />}
      </div>
      <span className="flex-1 truncate text-sm" title={name}>
        {name}
      </span>
      {unreadCount ? (
        <span
          aria-label={`${unreadCount} unread messages`}
          className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground"
        >
          {unreadLabel}
        </span>
      ) : null}
    </button>
  );
}

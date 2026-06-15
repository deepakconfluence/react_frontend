import { Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useConversations, useDeleteConversation } from '../api/chat-api';

interface ConversationHistoryProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationHistory({ activeId, onSelect }: ConversationHistoryProps) {
  const { data: conversations, isLoading } = useConversations();
  const deleteConversation = useDeleteConversation();

  if (isLoading) {
    return <p className="p-4 text-sm text-muted-foreground">Loading…</p>;
  }

  if (!conversations?.length) {
    return <p className="p-4 text-sm text-muted-foreground">No past conversations yet.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {conversations.map((c) => (
        <li
          key={c.id}
          className={cn(
            'group flex items-center gap-2 px-3 py-2.5 hover:bg-accent',
            c.id === activeId && 'bg-accent'
          )}
        >
          <button
            type="button"
            onClick={() => onSelect(c.id)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm">{c.title}</span>
          </button>
          <button
            type="button"
            aria-label="Delete conversation"
            onClick={() => deleteConversation.mutate(c.id)}
            className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

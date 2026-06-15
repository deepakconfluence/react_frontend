import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ChatFriendListItem } from './ChatFriendListItem';
import { ChatMessage } from './ChatMessage';

/**
 * Floating chat panel — Angular `chat-bar.component`.
 * Stub UI only; wire real SignalR + friends API when ready.
 */
export function ChatBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        aria-label="Open chat"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {open && (
        <aside className="fixed bottom-20 right-4 w-80 h-96 bg-card border rounded-lg shadow-xl flex flex-col">
          <header className="p-3 border-b">
            <h2 className="text-sm font-semibold">Chat</h2>
          </header>
          <div className="flex-1 overflow-y-auto">
            <ChatFriendListItem name="John Doe" online unreadCount={2} />
            <ChatFriendListItem name="Jane Smith" />
          </div>
          <div className="p-3 border-t space-y-1">
            <ChatMessage text="Hi there!" />
            <ChatMessage text="Hello — how can I help?" fromSelf />
          </div>
        </aside>
      )}
    </>
  );
}

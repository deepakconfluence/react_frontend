import { MessageCircle } from 'lucide-react';
import { useChatStatus } from '../api/chat-api';
import { useChatUIStore } from '../stores/chat-ui-store';
import { ChatPanel } from './ChatPanel';

/**
 * Globally-mounted floating assistant. Renders nothing until the backend reports
 * that an AI provider is configured.
 */
export function ChatWidget() {
  const { data: status, isLoading, isError } = useChatStatus();
  const isOpen = useChatUIStore((s) => s.isOpen);
  const open = useChatUIStore((s) => s.open);

  // Hide while loading, or if backend explicitly says not configured
  if (isLoading) return null;
  if (!isError && status?.configured === false) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && <ChatPanel />}
      {!isOpen && (
        <button
          type="button"
          onClick={open}
          aria-label="Open AI assistant"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

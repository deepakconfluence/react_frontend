import { cn } from '@/shared/lib/utils';
import { MarkdownContent } from './MarkdownContent';
import type { ChatRole } from '../types';

interface ChatMessageBubbleProps {
  role: ChatRole;
  content: string;
  /** Shows a blinking cursor after the content while streaming. */
  streaming?: boolean;
}

export function ChatMessageBubble({ role, content, streaming }: ChatMessageBubbleProps) {
  const isUser = role === 'USER';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-3 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
        ) : (
          <>
            <MarkdownContent content={content} />
            {streaming && (
              <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-foreground align-middle" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

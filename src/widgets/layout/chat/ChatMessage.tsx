import { cn } from '@/shared/lib/utils';

interface ChatMessageProps {
  text: string;
  fromSelf?: boolean;
  timestamp?: string;
}

export function ChatMessage({ text, fromSelf, timestamp }: ChatMessageProps) {
  return (
    <div className={cn('flex flex-col', fromSelf ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-lg px-3 py-2 text-sm',
          fromSelf ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
        )}
      >
        {text}
      </div>
      {timestamp && <span className="text-[10px] text-muted-foreground mt-0.5">{timestamp}</span>}
    </div>
  );
}

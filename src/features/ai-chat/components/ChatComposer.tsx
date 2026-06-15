import { useState, type KeyboardEvent } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ChatComposerProps {
  disabled: boolean;
  onSend: (message: string) => void;
}

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-border p-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={4000}
        placeholder="Ask the assistant…"
        className="max-h-32 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button size="icon" onClick={submit} disabled={disabled || !value.trim()} aria-label="Send message">
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </div>
  );
}

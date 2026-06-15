import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { ApprovalRequest } from '../api/chat-api';

interface ApprovalPromptProps {
  request: ApprovalRequest;
  busy: boolean;
  onDecision: (approved: boolean) => void;
}

export function ApprovalPrompt({ request, busy, onDecision }: ApprovalPromptProps) {
  return (
    <div className="rounded-lg border border-amber-400/60 bg-amber-50 p-3 dark:bg-amber-950/30">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
        <ShieldAlert className="h-4 w-4" />
        Approval required
      </div>
      <p className="mb-3 text-sm text-foreground">{request.summary}</p>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={() => onDecision(true)}>
          Approve
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => onDecision(false)}>
          Deny
        </Button>
      </div>
    </div>
  );
}

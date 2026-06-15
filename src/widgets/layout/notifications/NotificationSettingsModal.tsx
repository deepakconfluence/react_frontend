import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';

interface NotificationSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationSettingsModal({ open, onClose }: NotificationSettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification settings</DialogTitle>
          <DialogDescription>Choose which notifications you want to receive.</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Settings form — coming soon.</p>
      </DialogContent>
    </Dialog>
  );
}

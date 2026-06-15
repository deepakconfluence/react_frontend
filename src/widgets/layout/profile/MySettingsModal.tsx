import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';

interface MySettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function MySettingsModal({ open, onClose }: MySettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My settings</DialogTitle>
          <DialogDescription>Manage your personal preferences.</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Settings form — coming soon.</p>
      </DialogContent>
    </Dialog>
  );
}

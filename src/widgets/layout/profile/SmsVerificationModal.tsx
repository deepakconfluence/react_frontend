import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface SmsVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function SmsVerificationModal({ open, onClose }: SmsVerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify phone number</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">SMS verification — coming soon.</p>
      </DialogContent>
    </Dialog>
  );
}

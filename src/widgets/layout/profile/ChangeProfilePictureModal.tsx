import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface ChangeProfilePictureModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangeProfilePictureModal({ open, onClose }: ChangeProfilePictureModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change profile picture</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Upload picker — coming soon.</p>
      </DialogContent>
    </Dialog>
  );
}

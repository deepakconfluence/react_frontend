import { PageHeader } from '@/shared/components/feedback/PageHeader';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" description="Your recent notifications and alerts." />
      <EmptyState
        icon={<Bell className="h-8 w-8" />}
        title="No notifications"
        description="You're all caught up."
      />
    </div>
  );
}

import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function MaintenancePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Maintenance" description="Clear caches and run housekeeping tasks." />
      <p className="text-muted-foreground">Maintenance tools — coming soon.</p>
    </div>
  );
}

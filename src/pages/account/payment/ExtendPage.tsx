import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function ExtendPage() {
  return (
    <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <PageHeader title="Extend subscription" description="Add more time to your current plan." />
      <p className="text-sm text-muted-foreground">Extend flow — coming soon.</p>
    </div>
  );
}

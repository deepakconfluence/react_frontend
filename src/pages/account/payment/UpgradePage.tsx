import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function UpgradePage() {
  return (
    <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <PageHeader title="Upgrade plan" description="Move to a higher-tier subscription." />
      <p className="text-sm text-muted-foreground">Upgrade picker — coming soon.</p>
    </div>
  );
}

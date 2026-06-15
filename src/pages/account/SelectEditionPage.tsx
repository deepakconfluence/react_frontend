import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function SelectEditionPage() {
  return (
    <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <PageHeader title="Select edition" description="Choose a plan to continue." />
      <p className="text-sm text-muted-foreground">Edition picker — coming soon.</p>
    </div>
  );
}

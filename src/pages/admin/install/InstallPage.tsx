import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function InstallPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-4">
      <PageHeader title="Install" description="First-run setup wizard for new deployments." />
      <p className="text-sm text-muted-foreground">Install wizard — coming soon.</p>
    </div>
  );
}

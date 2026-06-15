import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function OrganizationUnitsPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Organization units" description="Hierarchical groups of users." />
      <p className="text-muted-foreground">Organization tree — coming soon.</p>
    </div>
  );
}

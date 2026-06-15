import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function RegisterTenantPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <PageHeader title="Register tenant" description="Provision a new tenant for your organization." />
      <p className="text-sm text-muted-foreground">Tenant registration — coming soon.</p>
    </div>
  );
}

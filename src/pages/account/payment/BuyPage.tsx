import { PageHeader } from '@/shared/components/feedback/PageHeader';

export default function BuyPage() {
  return (
    <div className="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <PageHeader title="Buy subscription" description="Purchase a plan for your account." />
      <p className="text-sm text-muted-foreground">Stripe / PayPal checkout — coming soon.</p>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function RegisterTenantResultPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-3 text-center">
      <h1 className="text-2xl font-bold">Tenant created</h1>
      <p className="text-sm text-muted-foreground">Your tenant is being provisioned. You'll receive an email shortly.</p>
      <Link to="/account/login" className="inline-block text-primary hover:underline">Back to sign in</Link>
    </div>
  );
}

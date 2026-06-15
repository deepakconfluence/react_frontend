import { Link } from 'react-router-dom';

export default function ConfirmEmailPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-4 text-center">
      <h1 className="text-2xl font-bold">Email confirmed</h1>
      <p className="text-sm text-muted-foreground">Your email address has been verified.</p>
      <Link to="/account/login" className="inline-block text-primary hover:underline">Continue to sign in</Link>
    </div>
  );
}

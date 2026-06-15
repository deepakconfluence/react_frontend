import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <p className="text-sm text-muted-foreground">Set a new password. (Form — coming soon.)</p>
      <Link to="/account/login" className="text-primary hover:underline text-sm">Back to sign in</Link>
    </div>
  );
}

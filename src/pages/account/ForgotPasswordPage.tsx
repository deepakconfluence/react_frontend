import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border space-y-4">
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link. (Form — coming soon.)
      </p>
      <Link to="/account/login" className="text-primary hover:underline text-sm">Back to sign in</Link>
    </div>
  );
}

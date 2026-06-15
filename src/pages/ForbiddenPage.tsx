import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-destructive">403</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
        <Link to="/" className="inline-block text-primary hover:underline">Back to home</Link>
      </div>
    </div>
  );
}

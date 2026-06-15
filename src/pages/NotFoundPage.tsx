import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">The page you are looking for doesn't exist.</p>
        <Link to="/" className="inline-block text-primary hover:underline">Back to home</Link>
      
	  dev test deepak
	  dev test
	  </div>
    </div>
  );
}

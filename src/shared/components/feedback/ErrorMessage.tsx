import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: unknown;
  title?: string;
}

export function ErrorMessage({ error, title = 'Something went wrong' }: ErrorMessageProps) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Unexpected error';

  return (
    <div role="alert" className="flex items-start gap-3 p-3 rounded-md bg-destructive/10 text-destructive">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1 text-sm">
        <p className="font-medium">{title}</p>
        <p className="opacity-90">{message}</p>
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ fullPage, size = 'md', label = 'Loading', className }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  const spinner = (
    <span role="status" aria-label={label} className="inline-flex items-center gap-2 text-muted-foreground">
      <Loader2 className={cn(sizeClass, 'animate-spin')} aria-hidden="true" />
    </span>
  );

  if (fullPage) {
    return (
      <div className={cn('min-h-[60vh] flex items-center justify-center', className)}>
        {spinner}
      </div>
    );
  }

  return spinner;
}

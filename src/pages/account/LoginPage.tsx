import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLogin } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/shared/stores/auth-store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useLogin();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="text-muted-foreground mt-2">Welcome back — sign in to your account.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="admin@enterprise.com"
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
        </div>

        {login.isError && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {(login.error as Error).message || 'Invalid credentials'}
          </div>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium"
        >
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Link to="/account/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
        <Link to="/account/register" className="text-primary hover:underline">
          Create account
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        Default credentials: admin@enterprise.com / Admin@123456
      </div>
    </div>
  );
}

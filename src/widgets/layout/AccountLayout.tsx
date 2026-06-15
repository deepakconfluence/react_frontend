import { Outlet, Link } from 'react-router-dom';
import { LanguageSwitch } from '@/shared/localization/LanguageSwitch';

/**
 * Outer layout for the unauthenticated /account/* routes.
 * Mirrors Angular `account.component.html`.
 */
export function AccountLayout() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="h-14 px-6 flex items-center justify-between">
        <Link to="/account/login" className="text-lg font-bold text-primary">
          Confluence Enterprise SaaS
        </Link>
        <LanguageSwitch />
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>
      <footer className="text-xs text-muted-foreground text-center py-4">
        © {year} Confluence Enterprise SaaS
      </footer>
    </div>
  );
}

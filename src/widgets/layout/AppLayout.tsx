import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { ThemeRoot } from './themes/ThemeRoot';
import { ChatWidget } from '@/features/ai-chat';

/**
 * Authenticated app shell. Mirrors Angular `app.component.html` + `themes-layout-base.component.ts`.
 *
 * Renders the current theme's <Layout /> through <ThemeRoot />, falling back to the default
 * sidebar/topbar/footer chrome when no theme override is active.
 */
export function AppLayout() {
  return (
    <>
      <ThemeRoot
        fallback={
          <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Topbar />
                <main className="flex-1 overflow-auto bg-background p-6">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </div>
          </div>
        }
      />
      {/* Mounted outside ThemeRoot so the assistant appears on every theme. */}
      <ChatWidget />
    </>
  );
}

import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../Sidebar';
import { Topbar } from '../../Topbar';
import { Footer } from '../../Footer';

/** Theme10 uses a top-menu layout in Angular; we keep the same chrome here and differentiate via CSS class. */
export function Theme10Layout() {
  return (
    <div className="theme-theme10 min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

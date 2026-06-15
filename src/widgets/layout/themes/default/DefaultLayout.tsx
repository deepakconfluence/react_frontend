import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../Sidebar';
import { Topbar } from '../../Topbar';
import { Footer } from '../../Footer';

export function DefaultLayout() {
  return (
    <div className="theme-default min-h-screen flex flex-col">
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
  );
}

import { Outlet } from "react-router";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router";

export function Root() {
  const location = useLocation();
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Show sidebar only on authenticated routes (not on login/signup/landing)
  const showSidebar = !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 w-full ${showSidebar ? 'ml-64' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

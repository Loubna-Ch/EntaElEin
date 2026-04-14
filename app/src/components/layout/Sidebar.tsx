import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  AlertCircle,
  Shield,
  LogOut,
  User as UserIcon,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Build navigation items based on user role
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "officer";

  const navigationItems = isAdmin
    ? [
        { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
        { path: "/dashboard/admin/statistics", label: "Statistics", icon: BarChart3 },
        { path: "/dashboard/admin/resolved", label: "Resolved Reports", icon: AlertCircle },
        { path: "/dashboard/admin/participants", label: "Participants Involved", icon: UserIcon },
      ]
    : [
        { path: "/dashboard/citizen", label: "Dashboard", icon: LayoutDashboard },
        { path: "/report", label: "Report Incident", icon: AlertCircle },
      ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-[#1a2744] border-r border-white/10 h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-50`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#dc143c] flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold text-white">Enta El Ein</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#94a3b8] hover:text-white transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-[#dc143c] text-white'
                  : 'text-[#94a3b8] hover:bg-[#2d3e5f] hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center justify-center w-12 h-12 bg-[#2d3e5f] rounded-full mx-auto">
          <UserIcon className="w-6 h-6 text-[#94a3b8]" />
        </div>
        {!collapsed && (
          <div className="text-center">
            <p className="text-sm text-white font-semibold">{user?.username || "User"}</p>
            <p className="text-xs text-[#94a3b8] capitalize">{isAdmin ? "Officer" : "Citizen"}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#94a3b8] hover:bg-[#2d3e5f] hover:text-white transition-all"
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Log-out</span>}
        </button>
      </div>
    </aside>
  );
}

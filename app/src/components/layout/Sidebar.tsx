import { Link, useLocation, useNavigate } from "react-router";
import {
  AlertCircle,
  BarChart3,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Shield,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { lebaneseRegions } from "../../data/regions";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<number>(user?.regionid ?? 1);
  const [regionSaving, setRegionSaving] = useState(false);

  useEffect(() => {
    setSelectedRegion(user?.regionid ?? 1);
  }, [user?.regionid]);

  // Build navigation items based on user role
  const isAdmin = user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "officer";

  const navigationItems = isAdmin
    ? [
      { path: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
      {
        path: "/dashboard/admin/statistics",
        label: "Statistics",
        icon: BarChart3,
      },
      {
        path: "/dashboard/admin/resolved",
        label: "Resolved Reports",
        icon: AlertCircle,
      },
      {
        path: "/dashboard/admin/rejected",
        label: "Rejected Reports",
        icon: XCircle,
      },
      {
        path: "/dashboard/admin/participants",
        label: "Participants Involved",
        icon: UserIcon,
      },
      ...(user?.role?.toLowerCase() === "admin"
        ? [{
          path: "/dashboard/admin/feedback",
          label: "Feedback",
          icon: MessageSquare,
        }]
        : []),
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

  const handleRegionSave = async () => {
    try {
      setRegionSaving(true);
      await updateProfile({ regionid: Number(selectedRegion) });
    } catch {
      // fetch interceptor already shows API/network errors.
    } finally {
      setRegionSaving(false);
    }
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#1a2744] border-r border-white/10 h-screen flex flex-col transition-all duration-300 fixed left-0 top-0 z-50`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#dc143c] flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold text-white">
              Enta El Ein
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#94a3b8] hover:text-white transition-colors"
        >
          {collapsed ? "→" : "←"}
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
                  ? "bg-[#dc143c] text-white"
                  : "text-[#94a3b8] hover:bg-[#2d3e5f] hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}

        {!isAdmin && !collapsed && (
          <div className="mt-6 p-3 rounded-lg bg-[#0f1729] border border-white/10">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[#94a3b8] mb-2 font-semibold">
              Change Region
            </p>
            <select
              className="w-full bg-[#1a2744] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#dc143c]"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(Number(e.target.value))}
              disabled={regionSaving}
            >
              {lebaneseRegions.map((region, index) => (
                <option key={region} value={index + 1}>
                  {region}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRegionSave}
              disabled={regionSaving}
              className="mt-2 w-full rounded-lg bg-[#dc143c] py-2 text-sm font-semibold text-white hover:bg-[#c41236] disabled:opacity-70"
            >
              {regionSaving ? "Saving..." : "Save Region"}
            </button>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-[#2d3e5f] rounded-full flex-shrink-0">
          <UserIcon className="w-5 h-5 text-[#94a3b8]" />
        </div>

        {!collapsed && (
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm text-white font-semibold truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-[#94a3b8] capitalize">
              {isAdmin ? "Officer" : "Citizen"}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex-shrink-0 p-2 rounded-lg text-[#94a3b8] hover:bg-[#2d3e5f] hover:text-white transition-all"
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}

import { Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import type { UserRoleType } from "../../types/index";
import { UserRole } from "../../types/index";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRoleType | UserRoleType[];
}

export function RoleBasedRoute({ children, requiredRole }: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userRole = (user?.role ?? "").toLowerCase() as UserRoleType;
  const hasAccess = !!user && requiredRoles.includes(userRole);

  if (!hasAccess) {
    // Redirect to unauthorized page or dashboard based on their role
    if (userRole === UserRole.CITIZEN) {
      return <Navigate to="/dashboard/citizen" replace />;
    } else if (userRole === UserRole.ADMIN) {
      return <Navigate to="/dashboard/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

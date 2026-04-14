import { Routes, Route, Navigate } from "react-router";
import { Home } from "./components/dashboards/HomeDashboard";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { CitizenDashboard } from "./components/dashboards/CitizenDashboard";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { AdminStatisticsPage } from "./pages/AdminStatisticsPage";
import { ResolvedReportsPage } from "./pages/ResolvedReportsPage";
import { ParticipantsInvolvedPage } from "./pages/ParticipantsInvolvedPage";
import IncidentReportForm from "./components/forms/IncidentReportForm";
import { RoleBasedRoute } from "./components/routing/RoleBasedRoute";
import { UserRole } from "./types/index";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />


      {/* Protected Routes - Citizen */}
      <Route
        path="/dashboard/citizen"
        element={
          <RoleBasedRoute requiredRole={UserRole.CITIZEN}>
            <CitizenDashboard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/report"
        element={
          <RoleBasedRoute requiredRole={UserRole.CITIZEN}>
            <IncidentReportForm />
          </RoleBasedRoute>
        }
      />

      {/* Protected Routes - Admin */}
      <Route
        path="/dashboard/admin"
        element={
          <RoleBasedRoute requiredRole={UserRole.ADMIN}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/admin/statistics"
        element={
          <RoleBasedRoute requiredRole={UserRole.ADMIN}>
            <AdminStatisticsPage />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/admin/resolved"
        element={
          <RoleBasedRoute requiredRole={UserRole.ADMIN}>
            <ResolvedReportsPage />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/dashboard/admin/participants"
        element={
          <RoleBasedRoute requiredRole={UserRole.ADMIN}>
            <ParticipantsInvolvedPage />
          </RoleBasedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
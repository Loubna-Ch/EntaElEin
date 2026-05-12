import { Routes, Route, Navigate } from "react-router";
import { Home } from "./features/home/pages/HomePage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SignupPage } from "./features/auth/pages/SignupPage";
import { CitizenDashboard } from "./features/citizen/pages/CitizenDashboard";
import { AdminDashboard } from "./features/admin/pages/AdminDashboard";
import { AdminStatisticsPage } from "./features/admin/pages/AdminStatisticsPage";
import { ResolvedReportsPage } from "./features/admin/pages/ResolvedReportsPage";
import { ParticipantsInvolvedPage } from "./features/admin/pages/ParticipantsInvolvedPage";
import { FeedbackPage } from "./features/admin/pages/FeedbackPage";
import IncidentReportForm from "./features/report/pages/IncidentReportForm";
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

      <Route
        path="/dashboard/admin/feedback"
        element={
          <RoleBasedRoute requiredRole={UserRole.ADMIN}>
            <FeedbackPage />
          </RoleBasedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
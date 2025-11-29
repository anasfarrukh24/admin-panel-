import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Usage:
    <RequireAuth>
      <ProtectedPage />
    </RequireAuth>

    or admin-only:
    <RequireAuth allowedRoles={['admin']}>
      <AdminPage />
    </RequireAuth>
*/

export default function RequireAuth({ children, allowedRoles = [] }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth || !auth.isAuthenticated()) {
    return <Navigate to="/SignIn" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !auth.hasRole(allowedRoles)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

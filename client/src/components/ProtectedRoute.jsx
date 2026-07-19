// ProtectedRoute.jsx
// Wraps a page and redirects to /login if there's no logged-in user, or
// to the home page if the user's role isn't allowed for this route.
// Usage: <ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

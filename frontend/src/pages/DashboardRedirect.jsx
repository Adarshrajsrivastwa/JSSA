import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { roleHomePath } from "../auth/auth";

export default function DashboardRedirect() {
  const { role } = useAuth();
  return <Navigate to={roleHomePath(role)} replace />;
}


import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "src/context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  return <Outlet />;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { session } = useSupabaseAuth();
  const location = useLocation();

  // Save last visited path
  useEffect(() => {
    if ((isAuthenticated || session) && location.pathname !== "/login") {
      sessionStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [location.pathname, isAuthenticated, session]);

  // Redirect if not authenticated by both systems
  if (!isAuthenticated && !session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

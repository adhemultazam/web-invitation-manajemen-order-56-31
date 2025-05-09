
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Save the current path to session storage whenever it changes
  useEffect(() => {
    if (isAuthenticated && location.pathname !== "/login") {
      sessionStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [location.pathname, isAuthenticated]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

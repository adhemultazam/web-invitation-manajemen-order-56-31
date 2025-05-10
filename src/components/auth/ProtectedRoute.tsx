
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/contexts/auth";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { session, user, isLoading } = useSupabaseAuth();
  const location = useLocation();

  // Save last visited path
  useEffect(() => {
    if ((isAuthenticated || session) && location.pathname !== "/login") {
      sessionStorage.setItem("lastVisitedPath", location.pathname);
    }
  }, [location.pathname, isAuthenticated, session]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated by Supabase
  if (!session && !user) {
    console.log("No Supabase session, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

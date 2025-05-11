
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }) {
  const { session, isLoading } = useSupabaseAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // We need a short delay to ensure the session state is updated
    const checkAuth = async () => {
      setTimeout(() => {
        setIsCheckingAuth(false);
      }, 500);
    };
    
    checkAuth();
  }, [session]);

  // Show loading indicator while checking auth state
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

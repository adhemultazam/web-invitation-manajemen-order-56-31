import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/auth";

export function ProtectedRoute({ children }) {
  const { session } = useSupabaseAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

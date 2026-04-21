import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageSkeleton } from "@/components/PageSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

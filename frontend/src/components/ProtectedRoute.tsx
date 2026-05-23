// components/ProtectedRoute.tsx
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) return <PageLoader />; // your existing page-loader component
  if (!user) {
    setLocation("/sign-in");
    return null;
  }
  return children;
}
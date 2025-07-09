import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🕓 Wait until AuthContext finishes loading
  if (loading) return null; // Or show spinner

  if (!user) {
    toast.error("Please login to continue");
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user?.isAdmin) {
    toast.error("Admin access required");
    return <Navigate to="/auth/login" />;
  }

  return children;
};

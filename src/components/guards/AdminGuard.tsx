import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminGuard;

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

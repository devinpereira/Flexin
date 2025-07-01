import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useUserAuth }  from "../hooks/useUserAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);
  useUserAuth();

  if (loading || !user || user.role === null) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isAccountVerified) return <Navigate to="/signup" replace state={{ step: "otp" }} />

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

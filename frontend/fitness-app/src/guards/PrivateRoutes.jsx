import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ roles = [] }) => {
  const { user, isAuthenticated } = useContext(UserContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />; // Optional "403" page
  }

  return <Outlet />;
};

export default PrivateRoute;

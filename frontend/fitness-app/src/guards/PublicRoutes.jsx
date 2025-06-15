import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PublicRoute = () => {
  const { isAuthenticated } = useContext(UserContext);

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;

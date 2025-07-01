import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PublicRoute = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const isAuthPage = ["/login", "/signup", "/oauth-success"].includes(location.pathname);

  if (user && user.isAccountVerified && isAuthPage) {
    return <Navigate to="/calculators" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
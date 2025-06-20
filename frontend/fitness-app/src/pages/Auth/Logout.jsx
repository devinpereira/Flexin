import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.removeItem("token");
    clearUser();
    window.dispatchEvent(new Event("logout"));

    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;

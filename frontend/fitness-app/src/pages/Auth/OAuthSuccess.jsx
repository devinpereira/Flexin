import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const OAuthSuccess = () => {
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
          const { data } = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

          updateUser(data);
          navigate("/calculators");
        } catch (err) {
          setError("Failed to fetch user info");
          navigate("/login");
        }
      } else {
        setError("Token not found");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, updateUser]);

  return <p>{error || "Logging in..."}</p>;
};

export default OAuthSuccess;
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { validateEmail } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/custom-schedules");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center overflow-hidden bg-fixed"
      style={{ backgroundImage: "url(/src/assets/background.png)" }}
    >
      <Navigation />
      <div className="container mx-auto h-screen flex items-center justify-end px-4">
        {/* Left Side Image (Visible on medium screens and up) */}
        <div
          className="hidden md:block flex-1 h-full bg-center bg-contain bg-no-repeat mr-20"
          style={{ backgroundImage: "url(/src/assets/left-image.png)" }}
        ></div>

        {/* Login Form Container */}
        <div className="bg-[#040d1a]/40 shadow-[0px_0px_21.799999237060547px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-1px] outline-white backdrop-blur-[8.65px]  p-3 w-full max-w-md mr-35">
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <h2 className="text-3xl text-white font-bold mb-8 text-center">
            Sign In
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Enter your email"
                onChange={({ target }) => setEmail(target.value)}
                value={email}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Enter your password"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F16436] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition duration-300"
            >
              Sign In
            </button>

            {/* Divider Line */}
            <div className="h-0 relative shadow-[0px_0px_11.399999618530273px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-0.50px] outline-[#f16436] my-4">
              <div className="absolute inset-0 border-t border-[#f16436]"></div>
            </div>
            <br />

            {/* Stacked Social Sign-In Buttons */}
            <div className="space-y-4">
              <button className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#c0c0c0] transition duration-300">
                <img
                  src="/src/assets/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>

              <button className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#c0c0c0] transition duration-300">
                <img
                  src="/src/assets/apple.svg"
                  alt="Apple Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign in with Apple</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <a href="#" className="text-white/70 hover:text-white text-sm">
                Don't have an account? Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

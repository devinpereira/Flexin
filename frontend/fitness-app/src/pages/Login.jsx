import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add framer-motion for animations
import { validateEmail } from "../utils/helper.js";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext.jsx";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/store');
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center overflow-hidden bg-fixed"
      style={{ backgroundImage: 'url(/src/assets/background.png)' }}
    >
      <Navigation />
      <div className="container mx-auto h-screen flex items-center justify-center px-4 sm:justify-end py-10 sm:py-0">
        {/* Left Side Image (Visible on medium screens and up) */}
        <div className="hidden md:block flex-1 h-full bg-center bg-contain bg-no-repeat mr-20"
          style={{ backgroundImage: 'url(/src/assets/left-image.png)' }}>
        </div>

        {/* Login Form Container */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-[#040d1a]/40 shadow-[0px_0px_21.799999237060547px_0px_rgba(241,100,54,1.00)] 
                    outline-1 outline-offset-[-1px] outline-white backdrop-blur-[8.65px] 
                    p-5 sm:p-6 md:p-8 w-full max-w-md mr-0 sm:mr-35 rounded-lg"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-3xl text-white font-bold mb-6 sm:mb-8 text-center"
          >
            Sign In
          </motion.h2>
          
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                          placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                          transform transition duration-300 focus:scale-[1.02]"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                          placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                          transform transition duration-300 focus:scale-[1.02]"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full bg-[#F16436] text-white py-3 px-4 rounded-lg font-medium 
                        hover:bg-opacity-90 active:bg-opacity-100 transition duration-300
                        transform active:scale-95 flex justify-center items-center"
              whileTap={{ scale: 0.97 }}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            {/* Divider Line */}
            <motion.div variants={itemVariants} className="h-0 relative shadow-[0px_0px_11.399999618530273px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-0.50px] outline-[#f16436] my-4">
              <div className="absolute inset-0 border-t border-[#f16436]"></div>
            </motion.div>

            {/* Stacked Social Sign-In Buttons */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 mt-4">
              <button
                type="button"
                className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 
                          hover:bg-[#c0c0c0] active:bg-[#b0b0b0] transition duration-300
                          transform active:scale-[0.99]"
              >
                <img
                  src="/src/assets/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>

              <button
                type="button"
                className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 
                          hover:bg-[#c0c0c0] active:bg-[#b0b0b0] transition duration-300
                          transform active:scale-[0.99]"
              >
                <img
                  src="/src/assets/apple.svg"
                  alt="Apple Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign in with Apple</span>
              </button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center mt-4"
            >
              <Link 
                to="/signup" 
                className="text-white/70 hover:text-white text-sm transition-colors duration-300"
              >
                Don't have an account? <span className="underline">Sign Up</span>
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
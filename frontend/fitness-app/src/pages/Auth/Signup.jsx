import React, { useContext, useState } from 'react';
import Navigation from '../../components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { validateEmail } from "../../utils/helper.js";
import { UserContext } from "../../context/UserContext.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import countryCodes from '../../utils/countryCodes.json'; // Add a country code JSON file in utils (see note below)

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Add state for age validation
  const [ageError, setAgeError] = useState(false);
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [step, setStep] = useState('signup'); // 'signup' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [signupPayload, setSignupPayload] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');

  // Handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setError("Please enter full name");
      console.log("Please enter full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      console.log("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter password");
      console.log("Please enter password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      console.log("Passwords do not match");
      return;
    }

    setError("");

    // Save signup data for OTP step
    setSignupPayload({
      fullName,
      email,
      password,
      profileImageUrl,
      dob: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
      role: 'user'
    });
    setStep('otp');
  };

  // Simulate sending OTP (replace with real API in production)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    // Validate phone number with country code
    const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`;
    if (!phone || !/^\d{5,15}$/.test(phone)) {
      setError("Please enter a valid phone number");
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
    }, 800);
  };

  // Simulate verifying OTP and completing signup
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP sent to your phone");
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(async () => {
      try {
        // Attach phone to signup payload and call signup API
        const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
          ...signupPayload,
          phone
        });
        const { token, user } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          updateUser(user);
          navigate("/calculators");
        }
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : "Something went wrong. Please try again later"
        );
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

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

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-fixed flex flex-col"
      style={{ backgroundImage: "url(/src/assets/background.png)" }}
    >
      <Navigation />
      <div className="flex-grow flex items-center justify-center px-4 sm:justify-end min-h-0">
        {/* Left Side Image (Visible on medium screens and up) */}
        <div
          className="hidden md:block flex-1 h-[90%] bg-center bg-contain bg-no-repeat mr-20 min-w-0"
          style={{ backgroundImage: "url(/src/assets/left-image.png)" }}
        ></div>

        {/* Sign Up/OTP Form Container */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-[#040d1a]/40 shadow-[0px_0px_21.8px_0px_rgba(241,100,54,1.00)] 
                    outline-1 outline-offset-[-1px] outline-white backdrop-blur-[8.65px] 
                    p-5 sm:p-6 md:p-8 w-full max-w-md mr-0 sm:mr-35 rounded-lg overflow-auto max-h-[90vh]"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl text-white font-bold mb-4 sm:mb-6 text-center"
          >
            {step === 'signup' ? "Sign Up" : "Verify Your Number"}
          </motion.h2>
          {error && <p className="text-red-500 text-xs pb-2">{error}</p>}
          {ageError && <p className="text-red-500 text-xs pb-2">You must be at least 13 years old to sign up.</p>}

          {step === 'signup' ? (
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSignUp}>
              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={({ target }) => setFullName(target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                            placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                            transform transition duration-300 focus:scale-[1.02]"
                  placeholder="Enter your full name"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                            placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                            transform transition duration-300 focus:scale-[1.02]"
                  placeholder="Enter your email"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={birthDay}
                    onChange={({ target }) => setBirthDay(target.value)}
                    className="bg-transparent border border-white/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    required
                  >
                    <option value="" disabled className="bg-[#040d1a]">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day} className="bg-[#040d1a]">{day}</option>
                    ))}
                  </select>

                  <select
                    value={birthMonth}
                    onChange={({ target }) => setBirthMonth(target.value)}
                    className="bg-transparent border border-white/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    required
                  >
                    <option value="" disabled className="bg-[#040d1a]">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month} className="bg-[#040d1a]">{month}</option>
                    ))}
                  </select>

                  <select
                    value={birthYear}
                    onChange={({ target }) => setBirthYear(target.value)}
                    className="bg-transparent border border-white/30 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                    required
                  >
                    <option value="" disabled className="bg-[#040d1a]">Year</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year} className="bg-[#040d1a]">{year}</option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                              transform transition duration-300 focus:scale-[1.02] pr-12"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={({ target }) => setConfirmPassword(target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                              transform transition duration-300 focus:scale-[1.02] pr-12"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
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
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <Link
                  to="/auth/login"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                >
                  Already have an account? <span className="underline">Sign In</span>
                </Link>
              </motion.div>
            </form>
          ) : (
            <form className="space-y-3 sm:space-y-4" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
              <motion.div variants={itemVariants}>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="bg-transparent border border-white/30 rounded-lg px-2 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#F16436] max-w-[110px]"
                    disabled={otpSent}
                  >
                    {countryCodes.map(c => (
                      <option key={c.code} value={c.dial_code} className="bg-[#040d1a]">
                        {c.name} {c.dial_code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={({ target }) => setPhone(target.value.replace(/\D/g, ''))}
                    className="flex-1 px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                              transform transition duration-300 focus:scale-[1.02]"
                    placeholder="Enter your phone number"
                    required
                    disabled={otpSent}
                  />
                </div>
              </motion.div>
              {otpSent && (
                <motion.div variants={itemVariants}>
                  <label className="block text-white text-sm font-medium mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={({ target }) => setOtp(target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                              placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                              transform transition duration-300 focus:scale-[1.02]"
                    placeholder="Enter the OTP sent to your phone"
                    required
                  />
                </motion.div>
              )}
              <motion.button
                variants={itemVariants}
                type="submit"
                className="w-full bg-[#F16436] text-white py-3 px-4 rounded-lg font-medium 
                          hover:bg-opacity-90 active:bg-opacity-100 transition duration-300
                          transform active:scale-95 flex justify-center items-center"
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {otpSent ? (isLoading ? 'Verifying...' : 'Verify OTP') : (isLoading ? 'Sending OTP...' : 'Send OTP')}
              </motion.button>
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                >
                  Already have an account? <span className="underline">Sign In</span>
                </Link>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

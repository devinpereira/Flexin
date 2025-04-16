import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add framer-motion for animations

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Add state for age validation
  const [ageError, setAgeError] = useState(false);
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

  // Calculate age based on birthdate
  const calculateAge = (year, month, day) => {
    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Validate age whenever date changes
  const validateAge = (year, month, day) => {
    if (!year || !month || !day) return;
    
    const age = calculateAge(year, month, day);
    setAgeError(age < 17);
    return age >= 17;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check age before proceeding
    if (birthYear && birthMonth && birthDay) {
      if (!validateAge(birthYear, birthMonth, birthDay)) {
        return; // Don't proceed if underage
      }
    }
    
    setIsLoading(true);
    
    // Construct the date of birth
    const dateOfBirth = birthYear && birthMonth && birthDay 
      ? `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}` 
      : null;
    
    // Simulate signup process
    setTimeout(() => {
      console.log('Date of Birth:', dateOfBirth); // For testing
      console.log('Age:', calculateAge(birthYear, birthMonth, birthDay)); // For testing
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

        {/* Signup Form Container */}
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
            Sign Up
          </motion.h2>
          
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                          placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                          transform transition duration-300 focus:scale-[1.02]"
                placeholder="Enter your full name"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
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

            {/* Date of Birth field */}
            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                Date of Birth
                {ageError && <span className="text-red-400 ml-2">(Must be 17+ to sign up)</span>}
              </label>
              <div className="flex space-x-2">
                {/* Day select */}
                <select
                  value={birthDay}
                  onChange={(e) => {
                    setBirthDay(e.target.value);
                    if (birthYear && birthMonth && e.target.value) {
                      validateAge(birthYear, birthMonth, e.target.value);
                    }
                  }}
                  className={`w-1/4 px-3 py-3 bg-transparent border ${
                    ageError ? 'border-red-400' : 'border-white/30'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]
                            transform transition duration-300 focus:scale-[1.02]`}
                  required
                >
                  <option value="" className="bg-[#121225]">Day</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i+1} value={i+1} className="bg-[#121225]">
                      {i+1}
                    </option>
                  ))}
                </select>
                
                {/* Month select */}
                <select
                  value={birthMonth}
                  onChange={(e) => {
                    setBirthMonth(e.target.value);
                    if (birthYear && e.target.value && birthDay) {
                      validateAge(birthYear, e.target.value, birthDay);
                    }
                  }}
                  className={`w-2/5 px-3 py-3 bg-transparent border ${
                    ageError ? 'border-red-400' : 'border-white/30'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]
                            transform transition duration-300 focus:scale-[1.02]`}
                  required
                >
                  <option value="" className="bg-[#121225]">Month</option>
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((month, i) => (
                    <option key={i} value={i+1} className="bg-[#121225]">
                      {month}
                    </option>
                  ))}
                </select>
                
                {/* Year select with scrollable options - optimized to start from current year - 10 */}
                <select
                  value={birthYear}
                  onChange={(e) => {
                    setBirthYear(e.target.value);
                    if (e.target.value && birthMonth && birthDay) {
                      validateAge(e.target.value, birthMonth, birthDay);
                    }
                  }}
                  className={`w-1/3 px-3 py-3 bg-transparent border ${
                    ageError ? 'border-red-400' : 'border-white/30'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F16436]
                            transform transition duration-300 focus:scale-[1.02]`}
                  required
                >
                  <option value="" className="bg-[#121225]">Year</option>
                  {(() => {
                    const years = [];
                    const currentYear = new Date().getFullYear();
                    const minValidYear = currentYear - 17; // Minimum valid year for 17+ age requirement
                    
                    // Start from 10 years ago (easier selection) down to 100 years ago
                    for (let year = currentYear - 10; year >= currentYear - 100; year--) {
                      years.push(
                        <option 
                          key={year} 
                          value={year} 
                          className={`bg-[#121225] ${year > minValidYear ? 'text-red-400' : ''}`}
                        >
                          {year} {year > minValidYear ? '(Underage)' : ''}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </div>
            </motion.div>

            {/* Age Error Message */}
            {ageError && (
              <motion.div 
                variants={itemVariants}
                className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100 text-sm"
              >
                You must be at least 17 years old to create an account.
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                          placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                          transform transition duration-300 focus:scale-[1.02]"
                placeholder="Create a password"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-white text-sm font-medium mb-1 sm:mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white 
                          placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]
                          transform transition duration-300 focus:scale-[1.02]"
                placeholder="Confirm your password"
                required
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={ageError}
              className={`w-full ${
                ageError ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#F16436] hover:bg-opacity-90 active:bg-opacity-100'
              } text-white py-3 px-4 rounded-lg font-medium 
                        transition duration-300
                        transform active:scale-95 flex justify-center items-center mt-2`}
              whileTap={{ scale: ageError ? 1 : 0.97 }}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </motion.button>

            {/* Divider Line */}
            <motion.div variants={itemVariants} className="h-0 relative shadow-[0px_0px_11.399999618530273px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-0.50px] outline-[#f16436] my-3">
              <div className="absolute inset-0 border-t border-[#f16436]"></div>
            </motion.div>

            {/* Stacked Social Sign-Up Buttons */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4 mt-3">
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
                <span className="text-sm font-medium">Sign up with Google</span>
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
                <span className="text-sm font-medium">Sign up with Apple</span>
              </button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="text-center mt-3"
            >
              <Link 
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors duration-300"
              >
                Already have an account? <span className="underline">Sign In</span>
              </Link>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
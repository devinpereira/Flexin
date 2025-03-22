import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center overflow-hidden bg-fixed"
      style={{ backgroundImage: 'url(/src/assets/background.png)' }}
    >
      <Navigation />
      <div className="container mx-auto h-screen flex items-center justify-end px-4">
        {/* Left Side Image (Visible on medium screens and up) */}
        <div className="hidden md:block flex-1 h-full bg-center bg-contain bg-no-repeat mr-20"
          style={{ backgroundImage: 'url(/src/assets/left-image.png)' }}>
        </div>

        {/* Signup Form Container */}
        <div className="bg-[#040d1a]/40 shadow-[0px_0px_21.799999237060547px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-1px] outline-white backdrop-blur-[8.65px]  p-3 w-full max-w-md mr-35">
          <h2 className="text-3xl text-white font-bold mb-8 text-center">Sign Up</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F16436]"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F16436] text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition duration-300"
            >
              Sign Up
            </button>

            {/* Divider Line */}
            <div className="h-0 relative shadow-[0px_0px_11.399999618530273px_0px_rgba(241,100,54,1.00)] outline-1 outline-offset-[-0.50px] outline-[#f16436] my-4">
              <div className="absolute inset-0 border-t border-[#f16436]"></div>
            </div><br />

            {/* Stacked Social Sign-Up Buttons */}
            <div className="space-y-4">
              <button
                className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#c0c0c0] transition duration-300"
              >
                <img
                  src="/src/assets/google.svg"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign up with Google</span>
              </button>

              <button
                className="w-full relative bg-[#d9d9d9] rounded-sm py-2 px-4 flex items-center justify-center gap-2 hover:bg-[#c0c0c0] transition duration-300"
              >
                <img
                  src="/src/assets/apple.svg"
                  alt="Apple Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium">Sign up with Apple</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/" className="text-white/70 hover:text-white text-sm">
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
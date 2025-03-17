import React from 'react';


const Navbar = () => {
  return (
    <nav className="bg-black/30 rounded-[15px] backdrop-blur-[10.25px] p-2 mx-30 mt-15">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" width="120" height="40" className='cursor-pointer' />
          <div className="hidden md:flex space-x-15 ml-20">
            <a href="/" className="text-white hover:text-[#f67a45] text-lg">
              HOME
            </a>
            <a href="/store" className="text-white hover:text-[#f67a45] text-lg">
              STORE
            </a>
            <a href="/calculators" className="text-white hover:text-[#f67a45] text-lg">
              CALCULATORS
            </a>
            <a href="/trainers" className="text-white hover:text-[#f67a45] text-lg">
              TRAINERS
            </a>
            <a href="#" className="text-white hover:text-[#f67a45] text-lg">
              COMMUNITY
            </a>
          </div>
        </div>

        {/* Right side - Sign In Button */}
        <div className="flex items-center">
          <button
            className="bg-[#F16436] text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
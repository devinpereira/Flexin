import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaUserShield, FaChevronDown, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useNavigationHistory } from '../context/NavigationContext';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const adminMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useNavigationHistory();
  const { user } = useContext(UserContext);

  // Check if user has admin role
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  // Check if current page is login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Close menu when location changes (user navigates to new page)
  useEffect(() => {
    setMobileMenuOpen(false);
    setAdminMenuOpen(false);
  }, [location]);

  // Handle clicks outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }

      if (adminMenuOpen &&
        adminMenuRef.current &&
        !adminMenuRef.current.contains(event.target)) {
        setAdminMenuOpen(false);
      }

      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen, adminMenuOpen, profileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleAdminMenu = () => {
    setAdminMenuOpen(prev => !prev);
  };

  // Updated navigation handler that protects routes requiring authentication
  const handleNavLinkClick = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      // Save the intended destination for redirect after login
      sessionStorage.setItem('redirectAfterLogin', path);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (window.clearUser) window.clearUser(); // for context if available
    window.dispatchEvent(new Event("logout"));
    navigate("/login");
  };

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-[60px] md:h-[90px]"></div>

      {/* Fixed navigation bar */}
      <nav className="fixed top-0 md:top-5 left-0 right-0 z-50 bg-black/30 rounded-none md:rounded-[15px] backdrop-blur-[10.25px] p-2 md:mx-4 lg:mx-8">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="py-2">
              <img src="/src/assets/logo.svg" alt="Logo" width="100" height="40" className="cursor-pointer" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4 lg:space-x-8 ml-4 md:ml-10 lg:ml-20">
              <Link to="/" className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1">
                HOME
              </Link>
              <Link to="/store" className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1">
                STORE
              </Link>
              <Link to="/trainers" className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1">
                TRAINERS
              </Link>
              <Link to="/calculators" className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1">
                CALCULATORS
              </Link>
              <Link to="/community" className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1">
                COMMUNITY
              </Link>

              {/* Admin link - only visible for admin users */}
              {isAdmin && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={toggleAdminMenu}
                    className="text-white hover:text-[#f67a45] text-base lg:text-lg px-2 py-1 flex items-center gap-1"
                  >
                    <FaUserShield className="inline mr-1" />
                    ADMIN
                  </button>

                  {/* Admin dropdown menu */}
                  {adminMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-[#121225] border border-[#f67a45]/30 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                      <Link to="/admin" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Dashboard
                      </Link>
                      <Link to="/admin/fitness" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Fitness Management
                      </Link>
                      <Link to="/admin/trainers" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Trainer Management
                      </Link>
                      <Link to="/admin/store" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Store Management
                      </Link>
                      <Link to="/admin/community" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Community Management
                      </Link>
                      <Link to="/admin/settings" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                        Settings
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Mobile menu toggle and buttons */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-3">
              {isAuthPage ? (
                // Show login/signup buttons only on auth pages
                <>
                  <Link to="/login" className="text-white hover:text-[#f67a45] border border-white/30 rounded-full px-6 py-1.5 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-[#f67a45] text-white rounded-full px-6 py-1.5 hover:bg-[#e56d3d] transition-colors">
                    Sign Up
                  </Link>
                </>
              ) : (
                // Show profile/account dropdown on other pages
                <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
                  <button
                    className="text-white hover:text-[#f67a45] transition-colors flex items-center gap-2"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                  >
                    <img
                      src={
                        user?.profileImageUrl
                          ? user.profileImageUrl.startsWith("http")
                            ? user.profileImageUrl
                            : `/src/assets/profile1.png`
                          : "/src/assets/profile1.png"
                      }
                      className="w-8 h-8 rounded-full"
                      alt="Profile"
                    />
                    <span>Account</span>
                    <FaChevronDown className="ml-1" />
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FaUser /> Profile
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              ref={buttonRef}
              className="md:hidden text-white p-2 touch-manipulation"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          ref={menuRef}
          className={`${mobileMenuOpen ? 'max-h-110 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} 
            md:hidden overflow-hidden transition-all duration-300 ease-in-out absolute left-0 right-0 bg-black/95 backdrop-blur-md`}
        >
          <div className="px-6 py-4 space-y-4">
            <Link to="/" className="block text-white hover:text-[#f67a45] py-3 text-lg">
              HOME
            </Link>
            <Link to="/store" className="block text-white hover:text-[#f67a45] py-3 text-lg">
              STORE
            </Link>
            <Link to="/trainers" className="block text-white hover:text-[#f67a45] py-3 text-lg">
              TRAINERS
            </Link>
            <Link to="/calculators" className="block text-white hover:text-[#f67a45] py-3 text-lg">
              CALCULATORS
            </Link>
            <Link to="/community" className="block text-white hover:text-[#f67a45] py-3 text-lg">
              COMMUNITY
            </Link>

            {/* Admin section in mobile menu - only for admin users */}
            {isAdmin && (
              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center py-2 text-[#f67a45]">
                  <FaUserShield className="mr-2" />
                  <span className="font-semibold">ADMIN PANEL</span>
                </div>
                <div className="pl-4 space-y-3">
                  <Link to="/admin" className="block text-white hover:text-[#f67a45] py-2">
                    Dashboard
                  </Link>
                  <Link to="/admin/fitness" className="block text-white hover:text-[#f67a45] py-2">
                    Fitness Management
                  </Link>
                  <Link to="/admin/trainers" className="block text-white hover:text-[#f67a45] py-2">
                    Trainer Management
                  </Link>
                  <Link to="/admin/store" className="block text-white hover:text-[#f67a45] py-2">
                    Store Management
                  </Link>
                  <Link to="/admin/community" className="block text-white hover:text-[#f67a45] py-2">
                    Community Management
                  </Link>
                  <Link to="/admin/settings" className="block text-white hover:text-[#f67a45] py-2">
                    Settings
                  </Link>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-3">
              {isAuthPage ? (
                // Show only signup button
                <Link to="/auth/signup" className="bg-[#f67a45] text-white rounded-full px-4 py-2.5 hover:bg-[#e56d3d] transition-colors text-base w-full text-center">
                  Sign Up
                </Link>
              ) : (
                // Show profile link on other pages
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:text-[#f67a45] border border-white/30 rounded-full transition-colors">
                  <img src="/src/assets/profile1.png" className="w-8 h-8 rounded-full" alt="Profile" />
                  <span className="text-base">Account</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
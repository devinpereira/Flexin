import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import { FaUserShield, FaChevronDown, FaSignOutAlt, FaUser, FaCog, FaQuestion, FaDumbbell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigationHistory } from '../context/NavigationContext';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const adminMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useNavigationHistory();
  const { user } = useContext(UserContext);

  // Check if user has admin role
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  // Check if current page is login or signup page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Mock notifications data - In a real app, this would come from an API or context
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      content: 'New message from your trainer',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'system',
      content: 'Your subscription will expire soon',
      time: '3 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'achievement',
      content: 'You completed your weekly goal!',
      time: '1 day ago',
      read: true
    }
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menu when location changes (user navigates to new page)
  useEffect(() => {
    setMobileMenuOpen(false);
    setAdminMenuOpen(false);
    setNotificationOpen(false);
    setProfileMenuOpen(false);
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

      if (profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }

      if (notificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen, adminMenuOpen, profileMenuOpen, notificationOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleAdminMenu = () => {
    setAdminMenuOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    setNotificationOpen(prev => !prev);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
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
    navigate("/logout");
  };

  // Get current path for highlighting active link
  const { pathname } = location;

  // Check if a link is active
  const isLinkActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Animation variants for dropdowns
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 5,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg></div>;
      case 'system':
        return <div className="bg-red-100 text-red-600 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
      case 'achievement':
        return <div className="bg-green-100 text-green-600 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
      default:
        return <div className="bg-gray-100 text-gray-600 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
    }
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
            <Link to="/" className="py-2 transition-transform hover:scale-105 duration-300">
              <img src="/src/assets/logo.svg" alt="Logo" width="100" height="40" className="cursor-pointer" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4 lg:space-x-8 ml-4 md:ml-10 lg:ml-20">
              <Link
                to="/"
                className={`text-white ${isLinkActive('/') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 relative group transition-all duration-300`}
              >
                HOME
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link
                to="/store"
                className={`text-white ${isLinkActive('/store') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 relative group transition-all duration-300`}
              >
                STORE
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/store') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link
                to="/trainers/my-trainers"
                className={`text-white ${isLinkActive('/trainers') || isLinkActive('/explore') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 relative group transition-all duration-300`}
              >
                TRAINERS
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/trainers') || isLinkActive('/explore') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link
                to="/calculators"
                className={`text-white ${isLinkActive('/calculators') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 relative group transition-all duration-300`}
              >
                CALCULATORS
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/calculators') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
              <Link
                to="/community/home"
                className={`text-white ${isLinkActive('/community') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 relative group transition-all duration-300`}
              >
                COMMUNITY
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/community') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              {/* Admin link - only visible for admin users */}
              {isAdmin && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={toggleAdminMenu}
                    className={`text-white ${isLinkActive('/admin') ? 'text-[#f67a45]' : 'hover:text-[#f67a45]'} text-base lg:text-lg px-2 py-1 flex items-center gap-1 relative group transition-all duration-300`}
                  >
                    <FaUserShield className="inline mr-1" />
                    ADMIN
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#f67a45] transition-all duration-300 ${isLinkActive('/admin') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>

                  {/* Admin dropdown menu */}
                  <AnimatePresence>
                    {adminMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute top-full left-0 mt-2 bg-[#121225] border border-[#f67a45]/30 rounded-lg shadow-lg py-2 min-w-[180px] z-50"
                      >
                        <Link to="/admin" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Dashboard
                        </Link>
                        <Link to="/admin/fitness" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Fitness Management
                        </Link>
                        <Link to="/admin/trainers" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Trainer Management
                        </Link>
                        <Link to="/admin/store" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Store Management
                        </Link>
                        <Link to="/admin/community" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Community Management
                        </Link>
                        <Link to="/admin/settings" className="block px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] transition-colors duration-200">
                          Settings
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Mobile menu toggle and buttons */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-3 items-center">
              {isAuthenticated && !isAuthPage && (
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="text-white hover:text-[#f67a45] p-2 rounded-full hover:bg-white/10 transition-all duration-200 relative"
                    aria-label="Notifications"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-[#f67a45] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 mt-2 bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg shadow-lg w-80 z-50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        <div className="max-h-[320px] overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map(notification => (
                              <div
                                key={notification.id}
                                className={`p-3 border-b border-gray-700/50 hover:bg-[#242440] transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-[#f67a45]/5' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-white/80'}`}>
                                    {notification.content}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <span className="h-2 w-2 rounded-full bg-[#f67a45] self-start mt-1"></span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-white/60">
                              No notifications
                            </div>
                          )}
                        </div>

                        <div className="p-2 border-t border-gray-700 text-center">
                          <Link
                            to="/notifications"
                            className="text-[#f67a45] text-sm hover:underline"
                            onClick={() => setNotificationOpen(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isAuthPage ? (
                // Show login/signup buttons only on auth pages
                <>
                  <Link
                    to="/login"
                    className={`text-white hover:text-[#f67a45] border border-white/30 rounded-full px-6 py-1.5 transition-all duration-300 hover:border-[#f67a45] hover:shadow-[0_0_10px_rgba(246,122,69,0.3)] ${isLinkActive('/login') ? 'bg-white/10 text-[#f67a45] border-[#f67a45]' : ''}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`bg-[#f67a45] text-white rounded-full px-6 py-1.5 hover:bg-[#e56d3d] transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(246,122,69,0.5)] ${isLinkActive('/signup') ? 'bg-[#e56d3d] shadow-[0_0_15px_rgba(246,122,69,0.5)]' : ''}`}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                // Show profile/account dropdown on other pages
                <div className="flex items-center gap-3 relative" ref={profileMenuRef}>
                  <button
                    className="text-white hover:text-[#f67a45] transition-all duration-300 flex items-center gap-2 group"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                  >
                    <div className="relative overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#f67a45] transition-all duration-300">
                      <img
                        src={
                          user?.profileImageUrl
                            ? user.profileImageUrl.startsWith("http")
                              ? user.profileImageUrl
                              : `/src/assets/profile1.png`
                            : "/src/assets/profile1.png"
                        }
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Profile"
                      />
                    </div>
                    <span className="group-hover:text-[#f67a45]">Account</span>
                    <FaChevronDown className={`ml-1 text-xs group-hover:text-[#f67a45] transition-transform duration-300 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute right-0 top-full mt-2 bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg shadow-lg py-2 min-w-[220px] z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-700">
                          <div className="font-medium text-white truncate">{user?.fullName || 'User'}</div>
                          <div className="text-sm text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                        </div>

                        <Link
                          to="/community/profile"
                          className={`px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200 ${isLinkActive('/community/profile') ? 'bg-[#f67a45]/20 text-[#f67a45]' : ''}`}
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaUser className="text-[#f67a45]" /> My Profile
                        </Link>

                        <Link
                          to="/calculators"
                          className={`px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200 ${isLinkActive('/calculators') ? 'bg-[#f67a45]/20 text-[#f67a45]' : ''}`}
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaDumbbell className="text-[#f67a45]" /> My Workouts
                        </Link>

                        <Link
                          to="/settings"
                          className={`px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200 ${isLinkActive('/settings') ? 'bg-[#f67a45]/20 text-[#f67a45]' : ''}`}
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaCog className="text-[#f67a45]" /> Settings
                        </Link>

                        <Link
                          to="/help"
                          className={`px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200 ${isLinkActive('/help') ? 'bg-[#f67a45]/20 text-[#f67a45]' : ''}`}
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaQuestion className="text-[#f67a45]" /> Help & Support
                        </Link>

                        <div className="border-t border-gray-700 mt-1 pt-1">
                          {user?.role === 'trainer' && (
                            <button
                              className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200"
                              onClick={() => {
                                handleNavLinkClick('/trainer/dashboard');
                                setProfileMenuOpen(false);
                              }}
                            >
                              <FaUserShield className="text-[#f67a45]" /> Trainer Dashboard
                            </button>
                          )}

                          <button
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-2 transition-colors duration-200"
                            onClick={() => {
                              handleLogout();
                              setProfileMenuOpen(false);
                            }}
                          >
                            <FaSignOutAlt className="text-[#f67a45]" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            <Link
              to="/"
              className={`block py-3 text-lg transition-colors duration-200 ${isLinkActive('/') ? 'text-[#f67a45]' : 'text-white hover:text-[#f67a45]'}`}
            >
              HOME
            </Link>
            <Link
              to="/store"
              className={`block py-3 text-lg transition-colors duration-200 ${isLinkActive('/store') ? 'text-[#f67a45]' : 'text-white hover:text-[#f67a45]'}`}
            >
              STORE
            </Link>
            <Link
              to="/trainers"
              className={`block py-3 text-lg transition-colors duration-200 ${isLinkActive('/trainers') || isLinkActive('/explore') ? 'text-[#f67a45]' : 'text-white hover:text-[#f67a45]'}`}
            >
              TRAINERS
            </Link>
            <Link
              to="/calculators"
              className={`block py-3 text-lg transition-colors duration-200 ${isLinkActive('/calculators') ? 'text-[#f67a45]' : 'text-white hover:text-[#f67a45]'}`}
            >
              CALCULATORS
            </Link>
            <Link
              to="/community"
              className={`block py-3 text-lg transition-colors duration-200 ${isLinkActive('/community') ? 'text-[#f67a45]' : 'text-white hover:text-[#f67a45]'}`}
            >
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
                  <Link to="/admin" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
                    Dashboard
                  </Link>
                  <Link to="/admin/fitness" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
                    Fitness Management
                  </Link>
                  <Link to="/admin/trainers" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
                    Trainer Management
                  </Link>
                  <Link to="/admin/store" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
                    Store Management
                  </Link>
                  <Link to="/admin/community" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
                    Community Management
                  </Link>
                  <Link to="/admin/settings" className="block text-white hover:text-[#f67a45] py-2 transition-colors duration-200">
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
                <Link to="/profile" className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:text-[#f67a45] border border-white/30 rounded-full transition-colors duration-200">
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../Navigation';
import {
  FaDumbbell,
  FaCalendarAlt,
  FaCalculator,
  FaRunning,
  FaChartBar,
  FaBars,
  FaTimes,
  FaUser
} from 'react-icons/fa';

const CalculatorLayout = ({ children, pageTitle = 'Calculator' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active section based on current path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/calculators') return 'Training';
    if (path === '/custom-schedules' || path.includes('/view-schedule') ||
      path.includes('/edit-schedule') || path === '/add-schedule') return 'Custom Schedules';
    if (path === '/fitness-calculators') return 'Calculators';
    if (path === '/exercise' || path === '/search-exercises') return 'Exercises';
    if (path === '/reports') return 'Reports';
    return 'Training'; // Default
  };

  const [activeSection, setActiveSection] = useState(getActiveSection());

  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location.pathname]);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation items with icons and paths
  const navItems = [
    { id: 'Training', icon: <FaDumbbell size={20} />, path: '/calculators' },
    { id: 'Custom Schedules', icon: <FaCalendarAlt size={20} />, path: '/custom-schedules' },
    { id: 'Calculators', icon: <FaCalculator size={20} />, path: '/fitness-calculators' },
    { id: 'Exercises', icon: <FaRunning size={20} />, path: '/exercise' },
    { id: 'Reports', icon: <FaChartBar size={20} />, path: '/reports' }
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>

        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            {navItems.map(item => (
              <a
                key={item.id}
                href="#"
                className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === item.id
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                  navigate(item.path);
                }}
              >
                {item.icon}
                <span>{item.id}</span>
              </a>
            ))}

            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-4 sm:pt-8 px-2 sm:px-4 max-w-8xl">
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[220px] lg:w-[275px] p-4 lg:p-6 h-full overflow-y-auto">
            {/* Logo or brand area */}
            <div className="mb-10 mt-6 px-4">
              <img src="/src/assets/logo.svg" alt="Logo" className="h-8" />
            </div>

            <div className="space-y-3">
              {navItems.map(item => (
                <a
                  key={item.id}
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === item.id
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                    navigate(item.path);
                  }}
                >
                  {item.icon}
                  <span>{item.id}</span>
                </a>
              ))}

              <div className="pt-6 border-t border-white/20 mt-32">
                <a
                  href="#"
                  className="flex items-center gap-3 px-6 py-3 rounded-full text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45] transition-all duration-200"
                >
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span>Account</span>
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content with responsive margins */}
        <div className="w-full md:pl-[220px] lg:pl-[275px] pr-0">
          <div className="max-w-full overflow-x-hidden">
            {/* Page Header - Responsive */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-white text-xl sm:text-2xl font-bold">{pageTitle}</h2>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>

      {/* Extra padding at the bottom for mobile to account for the floating button */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default CalculatorLayout;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../Navigation';
import { FaUserFriends } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';

const TrainerLayout = ({ children, pageTitle = 'Trainers' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active section based on current path and referring page
  const getActiveSection = () => {
    const path = location.pathname;

    // Check if we came from explore page (using state from navigation)
    const fromExplore = location.state?.fromExplore;

    // If viewing a trainer profile and we came from explore, keep Explore active
    if (path.includes('/trainers/') && fromExplore) {
      return 'Explore';
    }

    // Check standard routes
    if (path === '/apply-as-trainer') return 'Explore';
    if (path === '/explore') return 'Explore';
    if (path === '/trainers/my-trainers' || path.includes('/trainers/')) return 'My Trainers';
    return 'My Trainers'; // Default
  };

  const [activeSection, setActiveSection] = useState(getActiveSection());

  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location.pathname, location.state]);

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

  // Handle navigation with state to track source
  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Explore') {
      navigate('/explore');
    } else if (section === 'My Trainers') {
      navigate('/trainers/my-trainers');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaUserFriends size={24} />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>

        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'My Trainers'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('My Trainers');
              }}
            >
              <FaUserFriends size={20} />
              <span>My Trainers</span>
            </a>

            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'Explore'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('Explore');
              }}
            >
              <MdExplore size={20} />
              <span>Explore</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main container with proper spacing */}
      <div className="container mx-auto pt-4 sm:pt-8 px-4 pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row">
          {/* Desktop Side Navigation - Fixed position with proper height */}
          <div className="hidden md:block fixed left-0 top-70 z-10 h-[calc(100vh-90px)]">
            <nav className="bg-[#03020d] rounded-tr-[30px] w-[220px] lg:w-[275px] p-6 h-full overflow-y-auto">
              <div className="space-y-6 mt-8">
                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('My Trainers');
                  }}
                >
                  <FaUserFriends size={20} />
                  <span>My Trainers</span>
                </a>

                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('Explore');
                  }}
                >
                  <MdExplore size={20} />
                  <span>Explore</span>
                </a>

                <div className="mt-32 border-t border-white/20 pt-6">
                  {/* <div className="flex items-center gap-3">
                    <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                    <span className="text-white">Account</span>
                  </div> */}
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content Area with proper spacing and width */}
          <div className="w-full md:pl-[240px] lg:pl-[295px] overflow-visible">
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{pageTitle}</h1>
            <div className="overflow-visible max-w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';
import { useUserAuth } from '../hooks/useUserAuth';
import { useNavigationHistory } from '../context/NavigationContext';

const Trainers = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const { goBack, isAuthenticated, setIsAuthenticated } = useNavigationHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if user is authenticated when component mounts
  useEffect(() => {
    // For development, skip authentication check
    setIsAuthenticated(true);
    setIsLoading(false);
    
    // Comment out the authentication logic for now
    /*
    const token = localStorage.getItem('token');
    
    // Update authentication status
    setIsAuthenticated(!!token);
    
    // If not authenticated, redirect to login
    if (!token) {
      // Save the current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', '/trainers');
      navigate('/login');
    } else {
      setIsLoading(false);
    }
    */
  }, [navigate, setIsAuthenticated]);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

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
  
  // If still checking authentication or not authenticated, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Mock trainer data
  const trainers = [
    { id: 1, name: "John Smith", image: "/src/assets/trainers/trainer1.png", specialty: "Strength & Conditioning" },
    { id: 2, name: "Sarah Johnson", image: "/src/assets/trainers/trainer2.png", specialty: "Yoga & Flexibility" },
    { id: 3, name: "Mike Williams", image: "/src/assets/trainers/trainer3.png", specialty: "Bodybuilding" },
    { id: 4, name: "Emily Davis", image: "/src/assets/trainers/trainer4.png", specialty: "Cardio & HIIT" }
  ];

  const handleGoToSchedule = (trainerId) => {
    navigate(`/schedule/${trainerId}`);
  };
  
  const handleViewProfile = (trainerId) => {
    navigate(`/trainer-profile/${trainerId}`);
  };

  // Handle navigation for left sidebar
  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Explore') {
      navigate('/explore');
    } else if (section === 'My Trainers') {
      // Stay on the current page since we're already on the trainers page
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          {isMobileMenuOpen ? <FaUserFriends size={24} /> : <MdExplore size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'My Trainers'
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
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Explore'
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
            
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/trainer.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto pt-4 sm:pt-8 px-4">
        <div className="flex flex-col">
          {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
          <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
            <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
              <div className="space-y-6 mt-8">
                {/* My Trainers */}
                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                    activeSection === 'My Trainers'
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
                
                {/* Explore */}
                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                    activeSection === 'Explore'
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
                  <div className="flex items-center gap-3">
                    <img src="/src/assets/trainer.png" className="w-10 h-10 rounded-full" alt="Profile" />
                    <span className="text-white">Account</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          
          {/* Main Content - Adjusted for all device sizes */}
          <div className="w-full md:ml-[275px] lg:ml-[300px]">
            <div className="py-4">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-6">{activeSection}</h2>
              <hr className="border-gray-600 mb-4 sm:mb-6" />
              
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6 sm:mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {trainers.map(trainer => (
                    <div key={trainer.id} className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex flex-col items-center">
                      <div className="w-full h-32 sm:h-40 mb-3 sm:mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={trainer.image} 
                          alt={trainer.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/trainer.png';
                          }}
                          onClick={() => handleViewProfile(trainer.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                      <h3 className="text-white text-base sm:text-lg font-medium mb-0.5 sm:mb-1">{trainer.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{trainer.specialty}</p>
                      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3">
                        <button 
                          onClick={() => handleViewProfile(trainer.id)}
                          className="bg-transparent border border-[#f67a45]/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base flex-1"
                        >
                          Profile
                        </button>
                        <button 
                          onClick={() => handleGoToSchedule(trainer.id)}
                          className="bg-[#f67a45] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base flex-1"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Discover More Trainers button */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <button 
                    onClick={() => navigate('/explore')}
                    className="bg-[#1A1A2F] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#2A2A3F] transition-colors font-medium flex items-center gap-2 border border-[#f67a45]/30 text-sm sm:text-base"
                  >
                    <FaPlus size={14} />
                    <span>Discover More Trainers</span>
                  </button>
                </div>
              </div>
              
              {/* Find New Trainers card */}
              <div className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-8 mb-24 sm:mb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                    <MdExplore className="text-[#f67a45] text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-white text-base sm:text-xl font-bold mb-2">Looking for more options?</h3>
                  <p className="text-white/70 mb-4 sm:mb-6 max-w-lg text-sm">Explore our marketplace of fitness professionals to find the perfect trainer for your goals and preferences.</p>
                  <button 
                    onClick={() => navigate('/explore')}
                    className="bg-[#f67a45] text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaPlus size={14} />
                    Explore All Trainers
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
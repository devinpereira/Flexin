import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ScheduleCard from '../components/CustomSchedule/ScheduleCard';

import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaPlus,
  FaTimes,
  FaBars
} from 'react-icons/fa';

const CustomSchedules = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Custom Schedules');
  const [schedules, setSchedules] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage] = useState('');
  const [alertType] = useState('success');
  const [showTutorialImages, setShowTutorialImages] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock data for schedules (in a real app, this would come from an API/database)
  useEffect(() => {
    // Simulate loading schedules
    const savedSchedules = localStorage.getItem('customSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

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

  const handleAddSchedule = () => {
    navigate('/add-schedule');
  };

  const handleViewSchedule = (scheduleId) => {
    navigate(`/edit-schedule/${scheduleId}`);
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
          <FaBars size={24} />
        </button>
      </div>
      
      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            {/* Training */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Training'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('Training');
                navigate('/calculators');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaDumbbell size={20} />
              <span>Training</span>
            </a>
            
            {/* Custom Schedules */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Custom Schedules'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('Custom Schedules');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaCalendarAlt size={20} />
              <span>Custom Schedules</span>
            </a>
            
            {/* Calculators */}
            <a
              href="/fitness-calculators"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Calculators'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/fitness-calculators');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaCalculator size={20} />
              <span>Calculators</span>
            </a>
            
            {/* Exercises */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Exercises'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('Exercises');
                navigate('/exercises');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaRunning size={20} />
              <span>Exercises</span>
            </a>
            
            {/* Reports */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Reports'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('Reports');
                navigate('/reports');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaChartBar size={20} />
              <span>Reports</span>
            </a>
            
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto pt-4 sm:pt-8 px-4">
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              {/* Training */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Training'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Training');
                  navigate('/calculators');
                }}
              >
                <FaDumbbell size={20} />
                <span>Training</span>
              </a>
              
              {/* Custom Schedules */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Custom Schedules'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Custom Schedules');
                }}
              >
                <FaCalendarAlt size={20} />
                <span>Custom Schedules</span>
              </a>
              
              {/* Calculators */}
              <a
                href="/fitness-calculators"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Calculators'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/fitness-calculators');
                }}
              >
                <FaCalculator size={20} />
                <span>Calculators</span>
              </a>
              
              {/* Exercises */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Exercises'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Exercises');
                  navigate('/exercises');
                }}
              >
                <FaRunning size={20} />
                <span>Exercises</span>
              </a>
              
              {/* Reports */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Reports'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Reports');
                  navigate('/reports');
                }}
              >
                <FaChartBar size={20} />
                <span>Reports</span>
              </a>

              <div className="mt-32 border-t border-white/20 pt-6">
                <div className="flex items-center gap-3">
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span className="text-white">Account</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content with responsive margins */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          {/* Page Header - Responsive layout */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold">{activeSection}</h2>
            <hr className="border-gray-600 mt-2 sm:mt-4 mb-4 sm:mb-6" />
          </div>
          
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 md:p-8">
            {schedules.length > 0 ? (
              <div>
                {/* Schedules Grid - Responsive columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {schedules.map((schedule) => (
                    <ScheduleCard 
                      key={schedule.id} 
                      schedule={schedule} 
                      onClick={() => handleViewSchedule(schedule.id)} 
                    />
                  ))}
                  
                  {/* Add New Schedule Card - Responsive padding */}
                  <div 
                    className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[200px] sm:min-h-[250px] cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                    onClick={handleAddSchedule}
                  >
                    <div className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-2 sm:mb-3">
                      <FaPlus className="text-[#f67a45] text-lg sm:text-xl" />
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-medium mb-1 sm:mb-2">Add New Schedule</h3>
                    <p className="text-white/60 text-xs sm:text-sm">Create a custom workout routine</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Tutorial Images Section with close button - Responsive */}
                {showTutorialImages && (
                  <div className="mb-6 sm:mb-8 relative w-full max-w-2xl">
                    <button 
                      onClick={() => setShowTutorialImages(false)}
                      className="absolute -top-2 -right-2 bg-[#1A1A2F] text-white p-1 rounded-full hover:bg-[#f67a45] transition-colors z-10"
                    >
                      <FaTimes size={14} />
                    </button>
                    <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <img 
                            src="/src/assets/tutorial/custom-schedule-1.jpg" 
                            alt="Create a schedule" 
                            className="rounded-lg w-full h-auto"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/src/assets/tutorial/placeholder.jpg';
                            }}
                          />
                          <p className="text-white/70 text-xs sm:text-sm mt-2 text-center">Create your own workout schedule</p>
                        </div>
                        <div>
                          <img 
                            src="/src/assets/tutorial/custom-schedule-2.jpg" 
                            alt="Customize exercises" 
                            className="rounded-lg w-full h-auto" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/src/assets/tutorial/placeholder.jpg';
                            }}
                          />
                          <p className="text-white/70 text-xs sm:text-sm mt-2 text-center">Add and customize exercises</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Empty State Add Schedule Button - Responsive sizing and padding */}
                <div 
                  className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-6 sm:p-12 flex flex-col items-center justify-center text-center w-full max-w-md cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                  onClick={handleAddSchedule}
                >
                  <div className="bg-[#f67a45]/20 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
                    <FaPlus className="text-[#f67a45] text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3">Add a Schedule</h3>
                  <p className="text-white/70 mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">Create your own custom workout schedule tailored to your fitness goals and preferences.</p>
                  <button 
                    className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaPlus size={12} className="sm:text-[14px]" />
                    New Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom Alert - Responsive */}
      {showAlert && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center ${
            alertType === 'success' ? 'bg-green-600' :
            alertType === 'error' ? 'bg-red-600' :
            alertType === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
          }`}>
            <div className={`mr-3 sm:mr-4 rounded-full p-1 ${
              alertType === 'success' ? 'bg-green-500' :
              alertType === 'error' ? 'bg-red-500' :
              alertType === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}>
              {alertType === 'success' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {alertType === 'error' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {alertType === 'warning' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              )}
              {alertType === 'info' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <p className="text-white font-medium text-sm sm:text-base">{alertMessage}</p>
            <button 
              className="ml-4 sm:ml-6 text-white/80 hover:text-white"
              onClick={() => setShowAlert(false)}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Extra padding at the bottom for mobile to account for the floating button */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default CustomSchedules;
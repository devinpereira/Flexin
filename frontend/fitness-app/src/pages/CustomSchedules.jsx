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
  FaPencilAlt
} from 'react-icons/fa';

const CustomSchedules = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Custom Schedules');
  const [schedules, setSchedules] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage] = useState('');
  const [alertType] = useState('success');
  const [showTutorialImages, setShowTutorialImages] = useState(true);

  // Mock data for schedules (in a real app, this would come from an API/database)
  useEffect(() => {
    // Simulate loading schedules
    const savedSchedules = localStorage.getItem('customSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
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
      
      <div className="container mx-auto pt-8 px-4 flex">
        {/* Left Navigation */}
        <div className="fixed left-0 top-50 z-10 h-screen">
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
                                              window.location.href = '/fitness-calculators';
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
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          <h2 className="text-white text-2xl font-bold mb-6">{activeSection}</h2>
          <hr className="border-gray-600 mb-6" />
          
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8">
            {schedules.length > 0 ? (
              <div>
                {/* Schedules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {schedules.map((schedule) => (
                    <ScheduleCard 
                      key={schedule.id} 
                      schedule={schedule} 
                      onClick={() => handleViewSchedule(schedule.id)} 
                    />
                  ))}
                  
                  {/* Add New Schedule Card */}
                  <div 
                    className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[250px] cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                    onClick={handleAddSchedule}
                  >
                    <div className="bg-[#f67a45]/20 p-4 rounded-full mb-3">
                      <FaPlus className="text-[#f67a45] text-xl" />
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Add New Schedule</h3>
                    <p className="text-white/60 text-sm">Create a custom workout routine</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Tutorial Images Section with close button */}
                {showTutorialImages && (
                  <div className="mb-8 relative w-full max-w-2xl">
                    <button 
                      onClick={() => setShowTutorialImages(false)}
                      className="absolute -top-2 -right-2 bg-[#1A1A2F] text-white p-1 rounded-full hover:bg-[#f67a45] transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                    <div className="bg-[#1A1A2F] p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <p className="text-white/70 text-sm mt-2 text-center">Create your own workout schedule</p>
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
                          <p className="text-white/70 text-sm mt-2 text-center">Add and customize exercises</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Empty State Add Schedule Button */}
                <div 
                  className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-12 flex flex-col items-center justify-center text-center w-full max-w-md cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                  onClick={handleAddSchedule}
                >
                  <div className="bg-[#f67a45]/20 p-6 rounded-full mb-6">
                    <FaPlus className="text-[#f67a45] text-3xl" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">Add a Schedule</h3>
                  <p className="text-white/70 mb-6 max-w-sm">Create your own custom workout schedule tailored to your fitness goals and preferences.</p>
                  <button 
                    className="bg-[#f67a45] text-white px-8 py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                  >
                    <FaPlus size={14} />
                    New Schedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-lg px-6 py-4 flex items-center ${
            alertType === 'success' ? 'bg-green-600' :
            alertType === 'error' ? 'bg-red-600' :
            alertType === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
          }`}>
            <div className={`mr-4 rounded-full p-1 ${
              alertType === 'success' ? 'bg-green-500' :
              alertType === 'error' ? 'bg-red-500' :
              alertType === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}>
              {alertType === 'success' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {alertType === 'error' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {alertType === 'warning' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              )}
              {alertType === 'info' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <p className="text-white font-medium">{alertMessage}</p>
            <button 
              className="ml-6 text-white/80 hover:text-white"
              onClick={() => setShowAlert(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSchedules;
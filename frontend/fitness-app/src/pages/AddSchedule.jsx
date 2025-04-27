import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { v4 as uuidv4 } from 'uuid';

import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaArrowLeft,
  FaSave,
  FaPencilAlt,
  FaPlus,
  FaBars
} from 'react-icons/fa';

const AddSchedule = () => {
  const navigate = useNavigate();
  const [activeSection] = useState('Custom Schedules');
  const [scheduleName, setScheduleName] = useState('New Workout Schedule');
  const [editingName, setEditingName] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [exercises, setExercises] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  // Days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const displayAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleAddExercise = () => {
    navigate('/search-exercises', { 
      state: { 
        day: selectedDay, 
        existingExercises: exercises[selectedDay] || [] 
      } 
    });
  };

  const handleSaveSchedule = () => {
    // Validate schedule has at least one exercise
    const hasExercises = Object.values(exercises).some(day => (day || []).length > 0);
    
    if (!hasExercises) {
      displayAlert('Please add at least one exercise to your schedule', 'warning');
      return;
    }
    
    // Create schedule object
    try {
      const newSchedule = {
        id: uuidv4(),
        name: scheduleName,
        days: weekdays.filter(day => (exercises[day] || []).length > 0),
        exercises,
        createdAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules')) || [];
      savedSchedules.push(newSchedule);
      localStorage.setItem('customSchedules', JSON.stringify(savedSchedules));
      
      displayAlert('Schedule created successfully!', 'success');
      
      // Navigate back to custom schedules after a brief delay
      setTimeout(() => {
        navigate('/custom-schedules');
      }, 1000);
    } catch (error) {
      displayAlert('Failed to save schedule', 'error');
      console.error('Error saving schedule:', error);
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
          <FaCalendarAlt size={24} />
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
                activeSection === 'Training'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/calculators');
              }}
            >
              <FaDumbbell size={20} />
              <span>Training</span>
            </a>
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Custom Schedules'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/custom-schedules');
              }}
            >
              <FaCalendarAlt size={20} />
              <span>Custom Schedules</span>
            </a>
            
            {/* Add more mobile navigation items */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
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
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Exercises'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/exercises');
              }}
            >
              <FaRunning size={20} />
              <span>Exercises</span>
            </a>
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
                  navigate('/custom-schedules');
                }}
              >
                <FaCalendarAlt size={20} />
                <span>Custom Schedules</span>
              </a>
              
              {/* Calculators */}
              <a
                href="#"
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/custom-schedules')}
                className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-[#f67a45]/20"
              >
                <FaArrowLeft />
              </button>
              
              <div className="flex items-center">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={scheduleName}
                      onChange={(e) => setScheduleName(e.target.value)}
                      className="bg-[#1A1A2F] border border-gray-700 text-white text-xl sm:text-2xl font-bold px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      autoFocus
                      onBlur={() => setEditingName(false)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setEditingName(false);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-white text-lg sm:text-2xl font-bold truncate">{scheduleName}</h2>
                    <button 
                      onClick={() => setEditingName(true)}
                      className="text-white/50 hover:text-[#f67a45] p-1"
                    >
                      <FaPencilAlt size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleSaveSchedule}
              className="bg-[#f67a45] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaSave size={14} />
              <span>Save Schedule</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Schedule Days */}
            <div className="w-full lg:w-2/3">
              {/* Tabs for days of the week - Scrollable on mobile */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
                <div className="flex overflow-x-auto pb-1">
                  {weekdays.map((day) => (
                    <button
                      key={day}
                      className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${
                        selectedDay === day
                          ? 'bg-[#f67a45] text-white font-medium'
                          : 'text-white hover:bg-[#1A1A2F]'
                      } relative`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                      {(exercises[day] || []).length > 0 && (
                        <span className="absolute top-1 right-1 bg-white text-[#121225] text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {(exercises[day] || []).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Day exercises */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold">{selectedDay}'s Exercises</h3>
                  <button 
                    onClick={handleAddExercise}
                    className="bg-[#f67a45] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaPlus size={12} />
                    <span>Add Exercise</span>
                  </button>
                </div>
                
                {(exercises[selectedDay] || []).length > 0 ? (
                  <div className="space-y-4">
                    {(exercises[selectedDay] || []).map((exercise, index) => (
                      <div key={exercise.id} className="bg-white rounded-lg p-3 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                            <img 
                              src={exercise.image} 
                              alt={exercise.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/src/assets/exercises/default.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#121225] text-sm sm:text-base">{exercise.name}</h4>
                            <div className="text-gray-500 text-xs sm:text-sm">{exercise.category}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">{exercise.sets} sets × {exercise.reps} reps</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button 
                            onClick={() => {
                              const updatedExercises = { ...exercises };
                              updatedExercises[selectedDay] = (updatedExercises[selectedDay] || []).filter(e => e.id !== exercise.id);
                              setExercises(updatedExercises);
                            }}
                            className="text-red-500 hover:bg-red-50 p-1 sm:p-2 rounded-full"
                            aria-label="Remove exercise"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {index > 0 && (
                            <button 
                              onClick={() => {
                                // Move exercise up in order
                                const updatedExercises = { ...exercises };
                                const currentList = [...(updatedExercises[selectedDay] || [])];
                                const temp = currentList[index];
                                currentList[index] = currentList[index - 1];
                                currentList[index - 1] = temp;
                                updatedExercises[selectedDay] = currentList;
                                setExercises(updatedExercises);
                              }}
                              className="text-gray-700 hover:bg-gray-100 p-1 sm:p-2 rounded-full"
                              aria-label="Move exercise up"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                          {index < (exercises[selectedDay] || []).length - 1 && (
                            <button 
                              onClick={() => {
                                // Move exercise down in order
                                const updatedExercises = { ...exercises };
                                const currentList = [...(updatedExercises[selectedDay] || [])];
                                const temp = currentList[index];
                                currentList[index] = currentList[index + 1];
                                currentList[index + 1] = temp;
                                updatedExercises[selectedDay] = currentList;
                                setExercises(updatedExercises);
                              }}
                              className="text-gray-700 hover:bg-gray-100 p-1 sm:p-2 rounded-full"
                              aria-label="Move exercise down"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-5 sm:p-8 text-center">
                    <p className="text-white/70 mb-3 sm:mb-4">No exercises added to {selectedDay} yet.</p>
                    <button 
                      onClick={handleAddExercise}
                      className="bg-[#f67a45]/20 text-[#f67a45] px-4 sm:px-6 py-2 rounded-full hover:bg-[#f67a45]/30 transition-colors text-sm"
                    >
                      Add Your First Exercise
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Schedule Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 sticky top-6">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-4">Schedule Tips</h3>
                
                <div className="space-y-4">
                  <div className="bg-[#1A1A2F] p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Creating an Effective Schedule</h4>
                    <ul className="space-y-2 text-white/70 text-sm pl-5 list-disc">
                      <li>Focus on different muscle groups each day</li>
                      <li>Include both strength and mobility exercises</li>
                      <li>Plan for rest days between intense workouts</li>
                      <li>Start with compound exercises before isolation</li>
                      <li>Include both pushing and pulling movements</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1A1A2F] p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Schedule Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">Schedule Name:</span>
                        <span className="text-white text-sm">{scheduleName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">Total Days:</span>
                        <span className="text-white text-sm">
                          {weekdays.filter(day => (exercises[day] || []).length > 0).length} / 7
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70 text-sm">Total Exercises:</span>
                        <span className="text-white text-sm">
                          {Object.values(exercises).reduce((total, dayExercises) => total + (dayExercises || []).length, 0)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#f67a45] rounded-full"
                          style={{ 
                            width: `${Math.min(
                              Object.values(exercises).reduce((total, dayExercises) => total + (dayExercises || []).length, 0) * 10, 
                              100
                            )}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-white/50 mt-1 text-right">
                        {Object.values(exercises).reduce((total, dayExercises) => total + (dayExercises || []).length, 0) > 0 
                          ? 'Looking good!'
                          : 'Add exercises to get started'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-white/70 mb-2 text-sm">Active Days:</p>
                    <div className="flex flex-wrap gap-2">
                      {weekdays.map(day => (
                        <div 
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                            (exercises[day] || []).length > 0
                              ? 'bg-[#f67a45]/20 text-[#f67a45]'
                              : selectedDay === day 
                                ? 'bg-[#1A1A2F] border border-[#f67a45]/50 text-white'
                                : 'bg-[#1A1A2F] text-white/50'
                          }`}
                        >
                          {day.slice(0, 3)} {(exercises[day] || []).length > 0 && `(${(exercises[day] || []).length})`}
                        </div>
                      ))}
                    </div>
                    
                    {Object.values(exercises).reduce((total, dayExercises) => total + (dayExercises || []).length, 0) > 0 && (
                      <button 
                        onClick={handleSaveSchedule}
                        className="w-full bg-[#f67a45] text-white py-3 rounded-lg hover:bg-[#e56d3d] transition-colors mt-6"
                      >
                        Save Schedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Alert */}
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

export default AddSchedule;
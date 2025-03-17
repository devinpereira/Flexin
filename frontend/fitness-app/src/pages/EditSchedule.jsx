import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';
import DayExercises from '../components/CustomSchedule/DayExercises';

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
  FaTrash
} from 'react-icons/fa';

const EditSchedule = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [activeSection] = useState('Custom Schedules');
  const [schedule, setSchedule] = useState(null);
  const [scheduleName, setScheduleName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [exercises, setExercises] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load schedule data
  useEffect(() => {
    if (!scheduleId) return;

    try {
      // In a real app, this would be an API call
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules')) || [];
      const foundSchedule = savedSchedules.find(s => s.id === scheduleId);
      
      if (foundSchedule) {
        setSchedule(foundSchedule);
        setScheduleName(foundSchedule.name);
        setExercises(foundSchedule.exercises || {});
        
        // Select first day that has exercises
        const firstDayWithExercises = Object.keys(foundSchedule.exercises || {})
          .find(day => (foundSchedule.exercises[day] || []).length > 0) || 'Monday';
        setSelectedDay(firstDayWithExercises);
      } else {
        displayAlert('Schedule not found', 'error');
        setTimeout(() => navigate('/custom-schedules'), 1500);
      }
    } catch (error) {
      displayAlert('Error loading schedule', 'error');
      console.error('Error loading schedule:', error);
    }
  }, [scheduleId, navigate]);

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
        existingExercises: exercises[selectedDay] || [],
        scheduleId
      } 
    });
  };

  const handleUpdateExercise = (day, exerciseId, updatedData) => {
    setExercises(prev => {
      const updatedDay = (prev[day] || []).map(exercise => 
        exercise.id === exerciseId ? { ...exercise, ...updatedData } : exercise
      );
      
      return {
        ...prev,
        [day]: updatedDay
      };
    });
  };

  const handleDeleteExercise = (day, exerciseId) => {
    setExercises(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(exercise => exercise.id !== exerciseId)
    }));
    
    displayAlert('Exercise removed from schedule', 'info');
  };

  const handleSaveSchedule = () => {
    // Validate schedule has at least one exercise
    const hasExercises = Object.values(exercises).some(day => (day || []).length > 0);
    
    if (!hasExercises) {
      displayAlert('Please add at least one exercise to your schedule', 'warning');
      return;
    }
    
    // Update schedule object
    const updatedSchedule = {
      ...schedule,
      name: scheduleName,
      days: weekdays.filter(day => (exercises[day] || []).length > 0),
      exercises,
      updatedAt: new Date().toISOString()
    };
    
    // In a real app, this would be an API call
    try {
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules')) || [];
      const updatedSchedules = savedSchedules.map(s => 
        s.id === scheduleId ? updatedSchedule : s
      );
      
      localStorage.setItem('customSchedules', JSON.stringify(updatedSchedules));
      
      displayAlert('Schedule updated successfully!', 'success');
    } catch (error) {
      displayAlert('Failed to update schedule', 'error');
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteSchedule = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSchedule = () => {
    try {
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules')) || [];
      const filteredSchedules = savedSchedules.filter(s => s.id !== scheduleId);
      
      localStorage.setItem('customSchedules', JSON.stringify(filteredSchedules));
      
      displayAlert('Schedule deleted successfully!', 'info');
      
      setTimeout(() => {
        navigate('/custom-schedules');
      }, 1000);
    } catch (error) {
      displayAlert('Failed to delete schedule', 'error');
      console.error('Error deleting schedule:', error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // If schedule is still loading
  if (!schedule) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
        <div className="text-white text-xl">Loading schedule...</div>
      </div>
    );
  }

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
                  navigate('/calculators');
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
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
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
                      className="bg-[#1A1A2F] border border-gray-700 text-white text-2xl font-bold px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
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
                    <h2 className="text-white text-2xl font-bold">{scheduleName}</h2>
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
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDeleteSchedule}
                className="bg-red-600/20 text-red-500 px-6 py-2 rounded-full hover:bg-red-600/30 transition-colors flex items-center gap-2"
              >
                <FaTrash size={14} />
                Delete
              </button>
              
              <button 
                onClick={handleSaveSchedule}
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
              >
                <FaSave size={14} />
                Save Changes
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column - Schedule Days */}
            <div className="w-full lg:w-2/3">
              {/* Tabs for days of the week */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
                <div className="flex overflow-x-auto">
                  {weekdays.map((day) => (
                    <button
                      key={day}
                      className={`px-4 py-3 whitespace-nowrap ${
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
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-bold">{selectedDay}'s Exercises</h3>
                  <button 
                    onClick={handleAddExercise}
                    className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                  >
                    <FaPlus size={14} />
                    Add Exercise
                  </button>
                </div>
                
                {(exercises[selectedDay] || []).length > 0 ? (
                  <DayExercises 
                    exercises={exercises[selectedDay] || []} 
                    day={selectedDay}
                    onUpdate={handleUpdateExercise}
                    onDelete={handleDeleteExercise}
                  />
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
                    <p className="text-white/70 mb-4">No exercises added to {selectedDay} yet.</p>
                    <button 
                      onClick={handleAddExercise}
                      className="bg-[#f67a45]/20 text-[#f67a45] px-6 py-2 rounded-full hover:bg-[#f67a45]/30 transition-colors"
                    >
                      Add Your First Exercise
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Schedule Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
                <h3 className="text-white text-xl font-bold mb-4">Schedule Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 mb-2">Schedule Name:</p>
                    <p className="text-white font-medium">{scheduleName}</p>
                  </div>
                  
                  <div>
                    <p className="text-white/70 mb-2">Created:</p>
                    <p className="text-white/80 text-sm">
                      {new Date(schedule.createdAt).toLocaleDateString()} at {new Date(schedule.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {schedule.updatedAt && (
                    <div>
                      <p className="text-white/70 mb-2">Last Updated:</p>
                      <p className="text-white/80 text-sm">
                        {new Date(schedule.updatedAt).toLocaleDateString()} at {new Date(schedule.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-white/70 mb-2">Active Days:</p>
                    <div className="flex flex-wrap gap-2">
                      {weekdays.map(day => (
                        <div 
                          key={day}
                          className={`px-3 py-1 rounded-full text-sm ${
                            (exercises[day] || []).length > 0
                              ? 'bg-[#f67a45]/20 text-[#f67a45]'
                              : 'bg-[#1A1A2F] text-white/50'
                          }`}
                        >
                          {day.slice(0, 3)} {(exercises[day] || []).length > 0 && `(${(exercises[day] || []).length})`}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-white/70 mb-2">Total Exercises:</p>
                    <p className="text-white text-2xl font-bold">
                      {Object.values(exercises).reduce((total, dayExercises) => total + (dayExercises || []).length, 0)}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/70 mb-2">Preview:</p>
                    {Object.entries(exercises).map(([day, dayExercises]) => (
                      (dayExercises || []).length > 0 && (
                        <div key={day} className="mb-3">
                          <p className="text-white/90 font-medium mb-1">{day}:</p>
                          <ul className="pl-4">
                            {(dayExercises || []).slice(0, 3).map(exercise => (
                              <li key={exercise.id} className="text-white/70 text-sm list-disc">
                                {exercise.name} ({exercise.sets}×{exercise.reps})
                              </li>
                            ))}
                            {(dayExercises || []).length > 3 && (
                              <li className="text-white/50 text-sm italic">
                                +{(dayExercises || []).length - 3} more exercises
                              </li>
                            )}
                          </ul>
                        </div>
                      )
                    ))}
                    
                    {Object.values(exercises).every(day => !(day || []).length) && (
                      <p className="text-white/50 italic">No exercises added yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-white text-xl font-bold mb-4">Delete Schedule</h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to delete "{scheduleName}"? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-white/10 text-white px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteSchedule}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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

export default EditSchedule;
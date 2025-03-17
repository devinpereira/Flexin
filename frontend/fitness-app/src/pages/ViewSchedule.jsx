import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';

import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaArrowLeft,
  FaEdit,
  FaPlay,
  FaCheck
} from 'react-icons/fa';

const ViewSchedule = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [activeSection] = useState('Custom Schedules');
  const [schedule, setSchedule] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});

  // Days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get today's day of the week
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Load schedule data
  useEffect(() => {
    if (!scheduleId) return;

    try {
      // In a real app, this would be an API call
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules')) || [];
      const foundSchedule = savedSchedules.find(s => s.id === scheduleId);
      
      if (foundSchedule) {
        setSchedule(foundSchedule);
        
        // Select today or first day with exercises
        const dayToSelect = foundSchedule.days.includes(today) 
          ? today 
          : (foundSchedule.days[0] || 'Monday');
        setSelectedDay(dayToSelect);
        
        // Initialize completed exercises object
        const initialCompletedState = {};
        Object.entries(foundSchedule.exercises || {}).forEach(([day, exercises]) => {
          initialCompletedState[day] = {};
          exercises.forEach(exercise => {
            initialCompletedState[day][exercise.id] = false;
          });
        });
        setCompletedExercises(initialCompletedState);
      } else {
        displayAlert('Schedule not found', 'error');
        setTimeout(() => navigate('/custom-schedules'), 1500);
      }
    } catch (error) {
      displayAlert('Error loading schedule', 'error');
      console.error('Error loading schedule:', error);
    }
  }, [scheduleId, navigate, today]);

  const displayAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleEditSchedule = () => {
    navigate(`/edit-schedule/${scheduleId}`);
  };

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    displayAlert(`${selectedDay}'s workout started! 💪`, 'success');
  };

  const toggleExerciseCompletion = (exerciseId) => {
    setCompletedExercises(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [exerciseId]: !prev[selectedDay][exerciseId]
      }
    }));
  };

  const countCompletedExercises = (day) => {
    if (!completedExercises[day]) return 0;
    return Object.values(completedExercises[day]).filter(status => status).length;
  };

  const totalExercisesForDay = (day) => {
    return (schedule?.exercises[day] || []).length;
  };

  const allExercisesCompleted = () => {
    if (!schedule || !selectedDay || !completedExercises[selectedDay]) return false;
    const exercisesForDay = schedule.exercises[selectedDay] || [];
    if (exercisesForDay.length === 0) return false;
    
    return exercisesForDay.every(exercise => 
      completedExercises[selectedDay][exercise.id]
    );
  };

  const handleFinishWorkout = () => {
    displayAlert('Great job! Workout completed! 🎉', 'success');
    
    // In a real app, you would save workout history here
    setTimeout(() => {
      setWorkoutStarted(false);
      
      // Reset completion state
      const resetState = {};
      Object.entries(completedExercises).forEach(([day, exercises]) => {
        resetState[day] = {};
        Object.keys(exercises).forEach(id => {
          resetState[day][id] = false;
        });
      });
      setCompletedExercises(resetState);
    }, 2000);
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
              
              <h2 className="text-white text-2xl font-bold">{schedule.name}</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleEditSchedule}
                className="bg-[#1A1A2F] text-white px-6 py-2 rounded-full hover:bg-[#1A1A2F]/80 transition-colors flex items-center gap-2"
              >
                <FaEdit size={14} />
                Edit Schedule
              </button>
              
              {!workoutStarted ? (
                <button 
                  onClick={handleStartWorkout}
                  className={`bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2 ${
                    (schedule.exercises[selectedDay] || []).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={(schedule.exercises[selectedDay] || []).length === 0}
                >
                  <FaPlay size={14} />
                  Start Workout
                </button>
              ) : (
                <button 
                  onClick={handleFinishWorkout}
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                    allExercisesCompleted() 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  } transition-colors`}
                  disabled={!allExercisesCompleted()}
                >
                  <FaCheck size={14} />
                  Finish Workout
                </button>
              )}
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
                      } relative ${
                        day === today ? 'border-b-2 border-[#f67a45]' : ''
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                      {(schedule.exercises[day] || []).length > 0 && (
                        <span className="absolute top-1 right-1 bg-white text-[#121225] text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {(schedule.exercises[day] || []).length}
                        </span>
                      )}
                      {workoutStarted && completedExercises[day] && countCompletedExercises(day) > 0 && (
                        <span className="absolute bottom-1 right-1">
                          <span className="text-xs text-[#f67a45]">
                            {countCompletedExercises(day)}/{totalExercisesForDay(day)}
                          </span>
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
                  {workoutStarted && (
                    <div className="text-white bg-[#f67a45]/20 rounded-lg px-4 py-1">
                      Completed: {countCompletedExercises(selectedDay)}/{totalExercisesForDay(selectedDay)}
                    </div>
                  )}
                </div>
                
                {(schedule.exercises[selectedDay] || []).length > 0 ? (
                  <div className="space-y-4">
                    {(schedule.exercises[selectedDay] || []).map((exercise) => (
                      <div 
                        key={exercise.id} 
                        className={`bg-white rounded-lg p-4 ${
                          workoutStarted ? 'cursor-pointer hover:bg-white/95 transition-all' : ''
                        } ${
                          workoutStarted && completedExercises[selectedDay][exercise.id] 
                            ? 'border-2 border-green-500' 
                            : ''
                        }`}
                        onClick={() => workoutStarted && toggleExerciseCompletion(exercise.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            {/* Exercise Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
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
                            
                            {/* Exercise Details */}
                            <div className="flex-1">
                              <h4 className="font-bold text-[#121225]">{exercise.name}</h4>
                              <div className="text-gray-500">{exercise.category}</div>
                            </div>
                          </div>
                          
                          {/* Sets and Reps Display */}
                          <div className="flex items-center gap-4">
                            <div className="px-3 py-1 bg-gray-100 rounded-md text-gray-700">
                              {exercise.sets} sets × {exercise.reps} reps
                            </div>
                            
                            {/* Completion Checkbox */}
                            {workoutStarted && (
                              <div 
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  completedExercises[selectedDay][exercise.id]
                                    ? 'bg-green-500' 
                                    : 'bg-gray-200'
                                }`}
                              >
                                {completedExercises[selectedDay][exercise.id] && (
                                  <FaCheck className="text-white" size={12} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Exercise Instructions (collapsed unless in workout mode) */}
                        {workoutStarted && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">{exercise.description}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <div className="text-[#f67a45] font-medium">
                                {completedExercises[selectedDay][exercise.id] 
                                  ? 'Completed! 👍' 
                                  : 'Click to mark as complete'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
                    <p className="text-white/70">No exercises added to {selectedDay}.</p>
                    <p className="text-white/50 mt-2">
                      Select another day or edit this schedule to add exercises.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Schedule Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-6">
                <h3 className="text-white text-xl font-bold mb-4">Workout Summary</h3>
                
                <div className="space-y-4">
                  {workoutStarted ? (
                    <>
                      <div className="bg-[#1A1A2F] p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Current Status</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Progress:</span>
                          <span className="text-white font-medium">
                            {countCompletedExercises(selectedDay)}/{totalExercisesForDay(selectedDay)} exercises
                          </span>
                        </div>
                        
                        <div className="mt-2 bg-white/10 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#f67a45] h-full rounded-full"
                            style={{ 
                              width: `${totalExercisesForDay(selectedDay) > 0 
                                ? (countCompletedExercises(selectedDay) / totalExercisesForDay(selectedDay)) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                        
                        <div className="mt-6 text-center">
                          {allExercisesCompleted() ? (
                            <p className="text-green-400 font-medium">
                              All exercises completed! 🎉
                            </p>
                          ) : (
                            <p className="text-white/70">
                              Click on exercises to mark them as completed
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-[#1A1A2F] p-4 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Workout Tips</h4>
                        <ul className="space-y-2 text-white/70 text-sm pl-5 list-disc">
                          <li>Stay hydrated throughout your workout</li>
                          <li>Focus on proper form over heavy weights</li>
                          <li>Rest 30-90 seconds between sets</li>
                          <li>Breathe out during the effort phase</li>
                          <li>Cool down with 5-10 minutes of stretching</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-white/70 mb-2">Schedule Overview:</p>
                        <p className="text-white/90">
                          This workout schedule includes {schedule.days.length} active days with a 
                          total of {Object.values(schedule.exercises).reduce((total, dayExercises) => 
                            total + (dayExercises || []).length, 0)} exercises.
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-white/70 mb-2">Active Days:</p>
                        <div className="flex flex-wrap gap-2">
                          {weekdays.map(day => (
                            <div 
                              key={day}
                              className={`px-3 py-1 rounded-full text-sm ${
                                schedule.days.includes(day)
                                  ? day === today 
                                    ? 'bg-[#f67a45] text-white' 
                                    : 'bg-[#f67a45]/20 text-[#f67a45]'
                                  : 'bg-[#1A1A2F] text-white/50'
                              } ${day === today ? 'ring-2 ring-[#f67a45]/50' : ''}`}
                            >
                              {day.slice(0, 3)} {(schedule.exercises[day] || []).length > 0 && 
                                `(${(schedule.exercises[day] || []).length})`}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {today && schedule.days.includes(today) && (
                        <div className="mt-6 bg-[#1A1A2F] p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Today's Workout</h4>
                          <p className="text-white/70 mb-4">
                            It's {today}! You have {(schedule.exercises[today] || []).length} exercises
                            planned for today.
                          </p>
                          <button 
                            onClick={() => {
                              setSelectedDay(today);
                              handleStartWorkout();
                            }}
                            className="w-full bg-[#f67a45] text-white py-2 rounded-lg hover:bg-[#e56d3d] transition-colors"
                            disabled={(schedule.exercises[today] || []).length === 0}
                          >
                            Start Today's Workout
                          </button>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-white/70 mb-2">{selectedDay}'s Exercises:</p>
                        {(schedule.exercises[selectedDay] || []).length > 0 ? (
                          <ul className="pl-4">
                            {(schedule.exercises[selectedDay] || []).map(exercise => (
                              <li key={exercise.id} className="text-white/70 text-sm list-disc">
                                {exercise.name} ({exercise.sets}×{exercise.reps})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-white/50 italic">No exercises for {selectedDay}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
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

export default ViewSchedule;
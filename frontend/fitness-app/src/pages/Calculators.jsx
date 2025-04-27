import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaEye,
  FaEdit,
  FaPlay,
  FaBars
} from 'react-icons/fa';

const Calculators = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Training');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  
  // For modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Custom alert state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // success, error, warning, info

  // Function to show custom alert
  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
    
    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setAlertOpen(false);
    }, 3000);
  };


  // Mock training schedule data
  const trainingSchedule = {
    Monday: [
      { id: 1, name: 'Push-ups', reps: '3 x 15', image: '/src/assets/exercise1.png', modalImage: '/src/assets/exercise2.png', description: 'Start in a plank position with your hands slightly wider than your shoulders. Lower your body until your chest nearly touches the floor, then push yourself back up.' },
      { id: 2, name: 'Squats', reps: '3 x 20', image: '/src/assets/exercise1.png', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping knees behind toes. Return to standing position.' },
      { id: 3, name: 'Plank', reps: '3 x 1 min', image: '/src/assets/exercise1.png', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Get into a push-up position, but rest on your forearms. Keep your body in a straight line from head to heels.' }
    ],
    Tuesday: [
      { id: 4, name: 'Pull-ups', reps: '3 x 8', image: '/src/assets/exercises/pullups.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Hang from a bar with palms facing away from you. Pull your body up until your chin is over the bar.' },
      { id: 5, name: 'Lunges', reps: '3 x 12 each leg', image: '/src/assets/exercises/lunges.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Step forward with one leg and lower your body until both knees form 90-degree angles. Return to standing and repeat with the other leg.' },
      { id: 6, name: 'Russian Twists', reps: '3 x 20', image: '/src/assets/exercises/russian_twists.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Sit on the floor, knees bent and feet lifted. Twist your torso to touch the ground on each side.' }
    ],
    Wednesday: [
      { id: 7, name: 'Rest Day', reps: 'Active Recovery', image: '/src/assets/exercises/rest.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Take a day off from intense training. Focus on light stretching, walking, or other low-intensity activities to promote recovery.' }
    ],
    Thursday: [
      { id: 8, name: 'Bench Press', reps: '4 x 10', image: '/src/assets/exercises/bench_press.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Lie on a bench, lower the barbell to your chest, then push it back up to the starting position.' },
      { id: 9, name: 'Deadlifts', reps: '4 x 8', image: '/src/assets/exercises/deadlifts.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Stand with feet hip-width apart, bend at hips and knees to lower your hands to the bar, then stand up straight while lifting the bar.' },
      { id: 10, name: 'Shoulder Press', reps: '3 x 12', image: '/src/assets/exercises/shoulder_press.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Sit or stand with dumbbells at shoulder height, palms facing forward. Press the weights up overhead, then lower them back down.' }
    ],
    Friday: [
      { id: 11, name: 'Burpees', reps: '3 x 15', image: '/src/assets/exercises/burpees.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Start standing, drop into a squat position, kick feet back into a plank, return to squat, then jump up reaching overhead.' },
      { id: 12, name: 'Mountain Climbers', reps: '3 x 30 sec', image: '/src/assets/exercises/mountain_climbers.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Start in a plank position, then alternate bringing knees toward chest in a running motion.' },
      { id: 13, name: 'Jumping Jacks', reps: '3 x 50', image: '/src/assets/exercises/jumping_jacks.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Start with feet together and arms at sides, then jump while spreading legs and raising arms overhead.' }
    ],
    Saturday: [
      { id: 14, name: 'Yoga Flow', reps: '45 min', image: '/src/assets/exercises/yoga.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'A series of poses that flow from one to another, focusing on breathing, flexibility, and mindfulness.' },
      { id: 15, name: 'Foam Rolling', reps: '15 min', image: '/src/assets/exercises/foam_rolling.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Use a foam roller to release tension in muscles, focusing on areas of tightness or soreness.' }
    ],
    Sunday: [
      { id: 16, name: 'Rest Day', reps: 'Complete Rest', image: '/src/assets/exercises/rest.jpg', modalImage: '/src/assets/exercises/modal_pushups.jpg', description: 'Take a full day off to allow your body to recover and prepare for the next week.' }
    ]
  };

  // Days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Mock BMI and BMR data
  const userStats = {
    bmi: 23.4,
    bmrCalories: 1850,
    weight: 75, // kg
    height: 178, // cm
    age: 28,
    gender: 'Male'
  };

  // Handler to view exercise details
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setViewModalOpen(true);
  };

  // Handler to edit exercise
  const handleEditExercise = (exercise) => {
    setSelectedExercise({...exercise});
    setEditModalOpen(true);
  };

  // Handler to start workout
  const handleStartWorkout = (day) => {
    // In a real app, this would navigate to a workout session page
    console.log(`Starting workout for ${day}`);
    showAlert(`Starting workout for ${day}`, 'success');
  };

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
                setIsMobileMenuOpen(false);
              }}
            >
              <FaDumbbell size={20} />
              <span>Training</span>
            </a>
            
            <a
              href="/custom-schedules"
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
                setActiveSection('Exercises');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaRunning size={20} />
              <span>Exercises</span>
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
                }}
              >
                <FaDumbbell size={20} />
                <span>Training</span>
              </a>
              
              {/* Custom Schedules */}
              <a
                href="/custom-schedules"
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
          {/* Page Header - Responsive */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold">{activeSection}</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left column - Training Schedule - Full width on mobile, 2/3 on large screens */}
            <div className="w-full lg:w-2/3">
              {/* Tabs for days of the week - Scrollable on mobile */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <div className="flex overflow-x-auto pb-1">
                  {weekdays.map((day) => (
                    <button
                      key={day}
                      className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${
                        selectedDay === day
                          ? 'bg-[#f67a45] text-white font-medium'
                          : 'text-white hover:bg-[#1A1A2F]'
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Exercises for selected day - Responsive padding and spacing */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-white text-lg sm:text-xl font-bold">{selectedDay}'s Exercises</h3>
                  <button 
                    onClick={() => handleStartWorkout(selectedDay)}
                    className="bg-[#f67a45] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <FaPlay size={14} />
                    <span>Start Workout</span>
                  </button>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {trainingSchedule[selectedDay].map((exercise) => (
                    <div key={exercise.id} className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden mr-2 sm:mr-4 flex-shrink-0">
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
                          <h4 className="text-white text-sm sm:text-base font-medium">{exercise.name}</h4>
                          <p className="text-[#f67a45] text-xs sm:text-sm">{exercise.reps}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewExercise(exercise)}
                          className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditExercise(exercise)}
                          className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                        >
                          <FaEdit size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - BMI and BMR - Full width on mobile, 1/3 on large screens */}
            <div className="w-full lg:w-1/3">
              {/* BMI Card - Responsive padding and spacing */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">BMI Calculator</h3>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-white text-sm sm:text-base">Your BMI</span>
                  <span className="text-[#f67a45] text-lg sm:text-xl font-bold">{userStats.bmi}</span>
                </div>
                <div className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="h-4 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full relative">
                    {/* Position marker based on BMI value (typically 18.5-30 range) */}
                    <div 
                      className="absolute w-4 h-4 bg-white rounded-full -mt-0 transform -translate-y-1/2"
                      style={{ left: `${((userStats.bmi - 15) / 20) * 100}%`, top: '50%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/70">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                </div>
                <button className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 rounded-lg hover:bg-[#f67a45]/30 transition-colors text-sm sm:text-base" onClick={() => showAlert('BMI recalculated successfully', 'info')}>
                  Recalculate BMI
                </button>
              </div>
              
              {/* BMR Card - Responsive padding and spacing */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">BMR Calculator</h3>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-white text-sm sm:text-base">Daily Calories</span>
                  <span className="text-[#f67a45] text-lg sm:text-xl font-bold">{userStats.bmrCalories}</span>
                </div>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-white/70">Sedentary</span>
                    <span className="text-white">{Math.round(userStats.bmrCalories * 1.2)} cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Light Exercise</span>
                    <span className="text-white">{Math.round(userStats.bmrCalories * 1.375)} cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Moderate Exercise</span>
                    <span className="text-white">{Math.round(userStats.bmrCalories * 1.55)} cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Heavy Exercise</span>
                    <span className="text-white">{Math.round(userStats.bmrCalories * 1.725)} cal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Athlete</span>
                    <span className="text-white">{Math.round(userStats.bmrCalories * 1.9)} cal</span>
                  </div>
                </div>
                <button className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 rounded-lg hover:bg-[#f67a45]/30 transition-colors mt-4 text-sm sm:text-base" onClick={() => showAlert('BMR recalculated successfully', 'info')}>
                  Recalculate BMR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Alert Component */}
      {alertOpen && (
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
            <p className="text-white text-sm sm:text-base font-medium">{alertMessage}</p>
            <button 
              className="ml-4 sm:ml-6 text-white/80 hover:text-white"
              onClick={() => setAlertOpen(false)}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* View Exercise Modal - Responsive */}
      {viewModalOpen && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1A1A2F] p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-bold">Exercise Details</h3>
              <button 
                onClick={() => setViewModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body - Responsive padding */}
            <div className="p-4 sm:p-6">
              {/* Exercise Image */}
              <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <img
                  src={selectedExercise.modalImage}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/exercise2.png';
                  }}
                />
              </div>
              
              {/* Exercise Info */}
              <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6 mb-4">
                <h4 className="text-white text-lg font-bold mb-2">{selectedExercise.name}</h4>
                <div className="flex items-center mb-4">
                  <div className="px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-sm">
                    {selectedExercise.reps}
                  </div>
                </div>
                <h5 className="text-white font-medium mb-2">How to perform:</h5>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {selectedExercise.description}
                </p>
              </div>
              
              {/* Muscles Worked */}
              <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6">
                <h5 className="text-white font-medium mb-3">Muscles Targeted:</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Chest</span>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Shoulders</span>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Triceps</span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-[#1A1A2F] p-3 sm:p-4 flex justify-end">
              <button 
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditExercise(selectedExercise);
                }}
                className="bg-[#f67a45] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base"
              >
                Edit Exercise
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Exercise Modal - Responsive */}
      {editModalOpen && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1A1A2F] p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-bold">Edit Exercise</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
              {/* Exercise Image */}
              <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <img
                  src={selectedExercise.modalImage}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/exercises/default.jpg';
                  }}
                />
              </div>
              
              {/* Exercise Info */}
              <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6 mb-4">
                <h4 className="text-white text-lg font-bold mb-4">{selectedExercise.name}</h4>
                
                {/* Edit Reps Section */}
                <div className="mb-5 sm:mb-6">
                  <h5 className="text-white font-medium mb-3 text-sm sm:text-base">Adjust Reps:</h5>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setSelectedExercise(prev => {
                        // Parse the current reps to extract the sets and reps
                        const [sets, reps] = prev.reps.split(' x ');
                        // Decrease reps by 1 if possible
                        const newReps = Math.max(1, parseInt(reps) - 1);
                        return { ...prev, reps: `${sets} x ${newReps}` };
                      })}
                      className="bg-white/10 text-white h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <div className="px-4 sm:px-6 py-2 mx-3 bg-[#121225] text-white rounded-lg text-sm sm:text-base">
                      {selectedExercise.reps}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedExercise(prev => {
                        // Parse the current reps to extract the sets and reps
                        const [sets, reps] = prev.reps.split(' x ');
                        // Increase reps by 1
                        const newReps = parseInt(reps) + 1;
                        return { ...prev, reps: `${sets} x ${newReps}` };
                      })}
                      className="bg-white/10 text-white h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Edit Sets Section */}
                <div className="mb-4">
                  <h5 className="text-white font-medium mb-3 text-sm sm:text-base">Adjust Sets:</h5>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setSelectedExercise(prev => {
                        // Parse the current reps to extract the sets and reps
                        const [sets, reps] = prev.reps.split(' x ');
                        // Decrease sets by 1 if possible
                        const newSets = Math.max(1, parseInt(sets) - 1);
                        return { ...prev, reps: `${newSets} x ${reps}` };
                      })}
                      className="bg-white/10 text-white h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <div className="px-4 sm:px-6 py-2 mx-3 bg-[#121225] text-white rounded-lg text-sm sm:text-base">
                      {selectedExercise.reps.split(' x ')[0]} sets
                    </div>
                    
                    <button 
                      onClick={() => setSelectedExercise(prev => {
                        // Parse the current reps to extract the sets and reps
                        const [sets, reps] = prev.reps.split(' x ');
                        // Increase sets by 1
                        const newSets = parseInt(sets) + 1;
                        return { ...prev, reps: `${newSets} x ${reps}` };
                      })}
                      className="bg-white/10 text-white h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h5 className="text-white font-medium mb-2 text-sm sm:text-base">How to perform:</h5>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  {selectedExercise.description}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-[#1A1A2F] p-3 sm:p-4 flex justify-end gap-2 sm:gap-3">
              <button 
                onClick={() => setEditModalOpen(false)}
                className="bg-white/10 text-white px-3 sm:px-6 py-2 rounded-full hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, this would update the exercise in the database
                  const updatedSchedule = {...trainingSchedule};
                  const dayExercises = [...updatedSchedule[selectedDay]];
                  const exerciseIndex = dayExercises.findIndex(ex => ex.id === selectedExercise.id);
                  
                  if (exerciseIndex !== -1) {
                    dayExercises[exerciseIndex] = {...selectedExercise};
                    updatedSchedule[selectedDay] = dayExercises;
                    // You would update state here in a real application
                    console.log("Updated exercise:", selectedExercise);
                    showAlert(`Exercise updated: ${selectedExercise.name} - ${selectedExercise.reps}`, 'success');
                  }
                  
                  setEditModalOpen(false);
                }}
                className="bg-[#f67a45] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra padding at the bottom for mobile to account for the floating button */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default Calculators;
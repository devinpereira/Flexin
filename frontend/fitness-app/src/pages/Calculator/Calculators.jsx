import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  FaEye,
  FaEdit,
  FaPlay,
} from 'react-icons/fa';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import FitnessProfileWizard from '../../components/Wizard/FitnessProfileWizard';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { FitnessProfileContext } from '../../context/FitnessProfileContext';
import WorkoutModal from '../../components/Calculator/WorkoutModal';

const Calculators = () => {
  const { profile, updateProfile, calculateBMI, calculateBMR } = useContext(FitnessProfileContext);
  // Add state for the wizard visibility
  const [showWizard, setShowWizard] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileCreated, setProfileCreated] = useState(false);
  const [trainingSchedule, setTrainingSchedule] = useState({
    Monday: [], Tuesday: [], Wednesday: [],
    Thursday: [], Friday: [], Saturday: [], Sunday: []
  });

  // Existing state and variables
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Add new state variables for workout modal
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [initialCountdown, setInitialCountdown] = useState(false);

  // Audio refs for sound effects
  const beepSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);

  // Check if user has completed fitness profile setup
  useEffect(() => {
    const checkFitnessProfile = async () => {
      try {
        const savedProfile = await axiosInstance.get(API_PATHS.FITNESS.GET_FITNESS_PROFILE);

        if (savedProfile.data.exists) {
          updateProfile(savedProfile.data.profile);
          setShowWizard(false);
        } else {
          setShowWizard(true);
        }
      } catch (error) {
        console.error("Error loading fitness profile:", error);
        setShowWizard(true);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkFitnessProfile();
  }, [profileCreated]);

  // Get the workout plan for the week
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const workout = await axiosInstance.get(API_PATHS.WORKOUT.GET_WORKOUT_PLANS);

        if (workout.status === 200) {
          setTrainingSchedule(workout.data.schedule);
        }
      } catch (error) {
        console.error("Error loading workout plans:", error);
      }
    };

    loadSchedule();
  }, []);

  // Handle wizard completion
  const handleWizardComplete = (userData) => {
    updateProfile(userData);
    setShowWizard(false);
    setProfileCreated(true);

    showAlert('Fitness profile successfully created!', 'success');
  };

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

  // Days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // BMI and BMR data
  const userStats = {
    bmi: profile ? calculateBMI() : 23.4,
    bmrCalories: profile ? calculateBMR() : 1850,
    weight: profile ? profile.weight : 75,
    height: profile ? profile.height : 178,
    age: profile ? profile.age : 28,
    gender: profile ? profile.gender : 'Male',
    activityLevel: profile ? profile.activityLevel : 'Moderately Active'
  };

  useEffect(() => {
    if (profile) {
      userStats.bmi = calculateBMI(),
      userStats.bmrCalories = calculateBMR();
      userStats.weight = profile.weight;
      userStats.height = profile.height;
      userStats.age = profile.age;
      userStats.gender = profile.gender;
      userStats.activityLevel = profile.activityLevel;
    };
  }, [profile]);

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  // Normalize profile.activityLevel before lookup
  const normalizedActivity = userStats.activityLevel.toLowerCase().replace(/\s+/g, '_'); // Replace spaces with _

  // Handler to view exercise details
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setViewModalOpen(true);
  };

  // Handler to edit exercise
  const handleEditExercise = (exercise) => {
    setSelectedExercise({ ...exercise });
    setEditModalOpen(true);
  };

  // Handle starting a workout
  const handleStartWorkout = (day) => {
    const dayExercises = trainingSchedule[day] || [];

    if (dayExercises.length === 0) {
      showAlert(`No exercises found for ${day}`, 'warning');
      return;
    }

    setWorkoutExercises(dayExercises);
    setInitialCountdown(true);
    setWorkoutActive(true);
    console.log(`Starting workout for ${day}`);
  };

  // Display loading state while checking profile
  if (isLoadingProfile) {
    return (
      <CalculatorLayout pageTitle="Training">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f67a45]"></div>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout pageTitle="Training">
      {/* Show wizard if needed */}
      {showWizard && (
        <FitnessProfileWizard
          onComplete={handleWizardComplete}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 max-w-full">
        {/* Left column - Training Schedule - Full width on mobile, 2/3 on large screens */}
        <div className="w-full lg:w-2/3 min-w-0">
          {/* Tabs for days of the week - Scrollable on mobile */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-4 sm:mb-6">
            <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#f67a45]/30 scrollbar-track-transparent pb-1">
              {weekdays.map((day) => (
                <button
                  key={day}
                  className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base ${selectedDay === day
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

            <div className="space-y-3 sm:space-y-4 overflow-hidden">
              {trainingSchedule[selectedDay].map((exercise, index) => (
                <div key={index} className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="flex items-center w-full sm:w-auto">
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
                    <div className="min-w-0">
                      <h4 className="text-white text-sm sm:text-base font-medium truncate">{exercise.name}</h4>
                      <p className="text-[#f67a45] text-xs sm:text-sm">{exercise.reps}</p>
                    </div>
                  </div>
                  {exercise.name !== "Rest Day" && (
                    <div className="flex gap-2 mt-2 sm:mt-0 ml-auto sm:ml-0">
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - BMI and BMR - Full width on mobile, 1/3 on large screens */}
        <div className="w-full lg:w-1/3 min-w-0">
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
              <span className="text-[#f67a45] text-lg sm:text-xl font-bold">{userStats.bmrCalories} cal</span>
            </div>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-white/70">Sedentary</span>
                <span className="text-white">{Math.round(userStats.bmrCalories * 1.2 / activityMultipliers[normalizedActivity])} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Light Exercise</span>
                <span className="text-white">{Math.round(userStats.bmrCalories * 1.375 / activityMultipliers[normalizedActivity])} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Moderate Exercise</span>
                <span className="text-white">{Math.round(userStats.bmrCalories * 1.55 / activityMultipliers[normalizedActivity])} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Heavy Exercise</span>
                <span className="text-white">{Math.round(userStats.bmrCalories * 1.725 / activityMultipliers[normalizedActivity])} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Athlete</span>
                <span className="text-white">{Math.round(userStats.bmrCalories * 1.9 / activityMultipliers[normalizedActivity])} cal</span>
              </div>
            </div>
            <button className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 rounded-lg hover:bg-[#f67a45]/30 transition-colors mt-4 text-sm sm:text-base" onClick={() => showAlert('BMR recalculated successfully', 'info')}>
              Recalculate BMR
            </button>
          </div>
        </div>
      </div>

      {/* Custom Alert Component */}
      {alertOpen && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center ${alertType === 'success' ? 'bg-green-600' :
            alertType === 'error' ? 'bg-red-600' :
              alertType === 'warning' ? 'bg-yellow-600' :
                'bg-blue-600'
            }`}>
            <div className={`mr-3 sm:mr-4 rounded-full p-1 ${alertType === 'success' ? 'bg-green-500' :
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#121225] rounded-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1A1A2F] p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-bold">Exercise Details</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Responsive padding with scrolling */}
            <div className="p-4 sm:p-6 overflow-y-auto">
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

            {/* Modal Footer - Pinned to bottom */}
            <div className="bg-[#1A1A2F] p-3 sm:p-4 flex justify-end mt-auto">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#121225] rounded-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1A1A2F] p-3 sm:p-4">
              <h3 className="text-white text-lg sm:text-xl font-bold">Edit Exercise</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body with overflow scrolling */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              {/* Exercise Image */}
              <div className="w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 sm:mb-6">
                <img
                  src={selectedExercise.modalImage}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/exercise-default2.png';
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

            {/* Modal Footer - Pinned to bottom */}
            <div className="bg-[#1A1A2F] p-3 sm:p-4 flex justify-end gap-2 sm:gap-3 mt-auto">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-white/10 text-white px-3 sm:px-6 py-2 rounded-full hover:bg-white/20 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={ async () => {
                  const updatedDayExercises = [...trainingSchedule[selectedDay]];
                  const index = updatedDayExercises.findIndex(ex => ex.id === selectedExercise.id);

                  if (index !== -1) {
                    updatedDayExercises[index] = { ...selectedExercise };

                    const updatedSchedule = {
                      ...trainingSchedule,
                      [selectedDay]: updatedDayExercises
                    };

                    setTrainingSchedule(updatedSchedule);
                    
                    try {
                      await axiosInstance.put(API_PATHS.WORKOUT.UPDATE_WORKOUT, { schedule: updatedSchedule, });
                      showAlert(`Exercise updated: ${selectedExercise.name} - ${selectedExercise.reps}`, 'success');

                    } catch(err) {
                      console.error("Failed to update workout plan:", err);
                      showAlert('Failed to update workout plan. Try again.', 'error');
                    };
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

      {/* Workout Modal */}
      {workoutActive && (
        <WorkoutModal
          exercises={workoutExercises}
          initialCountdown={initialCountdown}
          setInitialCountdown={setInitialCountdown}
          onClose={() => {
            setWorkoutActive(false);
            setInitialCountdown(false);
          }}
          beepSoundRef={beepSoundRef}
          countdownSoundRef={countdownSoundRef}
        />
      )}

      {/* Audio elements for sound effects */}
      <audio ref={beepSoundRef} src="/src/assets/sounds/beep.mp3" preload="auto"></audio>
      <audio ref={countdownSoundRef} src="/src/assets/sounds/countdown.mp3" preload="auto"></audio>

      {/* Extra padding at the bottom for mobile to account for the floating button */}
      <div className="h-24 md:h-0"></div>
    </CalculatorLayout>
  );
};

export default Calculators;
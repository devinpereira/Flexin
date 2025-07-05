import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaArrowLeft, FaCheck, FaDumbbell, FaWeight, FaRunning, FaHeartbeat } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const FitnessProfileWizard = ({ onComplete }) => {
  // State for the current step
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // User data state
  const [userData, setUserData] = useState({
    experience: 'Beginner', // beginner, Intermediate, advanced
    age: '',
    gender: 'Male', // male, female, other
    weight: '',
    weightUnit: 'kg', // kg, lbs
    height: '',
    heightUnit: 'cm', // cm, ft
    activityLevel: 'Moderately active', // sedentary, light, moderate, active, very_active
    goals: ['Lose weight'], // lose_weight, build_muscle, improve_endurance, general_fitness
    preferredWorkoutDuration: '30-45', // 15-30, 30-45, 45-60, 60+
    workoutDaysPerWeek: 3, // 1-7
    healthConditions: [],
    equipmentAccess: 'Limited equipment' // none, limited, full_gym
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fitness goals options
  const fitnessGoalOptions = [
    { id: 'Lose weight', label: 'Lose Weight', icon: <FaWeight /> },
    { id: 'Build muscle', label: 'Build Muscle', icon: <FaDumbbell /> },
    { id: 'Improve endurance', label: 'Improve Endurance', icon: <FaRunning /> },
    { id: 'General fitness', label: 'General Fitness', icon: <FaHeartbeat /> }
  ];

  // Health conditions options
  const healthConditionOptions = [
    { id: 'None', label: 'None' },
    { id: 'Back pain', label: 'Back Pain/Issues' },
    { id: 'Joint pain', label: 'Joint Pain' },
    { id: 'High blood pressure', label: 'High Blood Pressure' },
    { id: 'Heart condition', label: 'Heart Condition' },
    { id: 'Diabetes', label: 'Diabetes' },
    { id: 'Asthma', label: 'Asthma' }
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUserData(prev => {
      // Handle checkboxes (multi-select)
      if (type === 'checkbox') {
        if (name === 'goals') {
          return {
            ...prev,
            goals: checked
              ? [...prev.goals, value]
              : prev.goals.filter(goal => goal !== value)
          };
        } else if (name === 'healthConditions') {
          return {
            ...prev,
            healthConditions: checked
              ? [...prev.healthConditions, value]
              : prev.healthConditions.filter(condition => condition !== value)
          };
        }
      }

      // Handle regular inputs
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Handle radio button changes
  const handleRadioChange = (name, value) => {
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate step based on current step
  const validateStep = () => {
    let stepErrors = {};

    switch (step) {
      case 1: // Experience level
        // No validation needed for step 1
        break;

      case 2: // Personal metrics
        if (!userData.age) stepErrors.age = "Age is required";
        else if (userData.age < 13 || userData.age > 100) stepErrors.age = "Age must be between 13 and 100";

        if (!userData.weight) stepErrors.weight = "Weight is required";
        else if (userData.weight <= 0) stepErrors.weight = "Weight must be greater than 0";

        if (!userData.height) stepErrors.height = "Height is required";
        else if (userData.height <= 0) stepErrors.height = "Height must be greater than 0";
        break;

      case 3: // Goals and activity
        if (userData.goals.length === 0) stepErrors.goals = "Select at least one fitness goal";

        if (!userData.workoutDaysPerWeek) stepErrors.workoutDaysPerWeek = "Please select how many days per week";
        break;

      case 4: // Final step - verify all data
        // Comprehensive validation before submission
        if (!userData.age) stepErrors.age = "Age is required";
        if (!userData.weight) stepErrors.weight = "Weight is required";
        if (!userData.height) stepErrors.height = "Height is required";
        if (userData.goals.length === 0) stepErrors.goals = "Select at least one fitness goal";
        break;

      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Go to next step if validation passes
  const nextStep = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        submitForm();
      }
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Submit the form data
  const submitForm = async () => {
    console.log("Submitting form with data:", userData);
    setIsSubmitting(true);
      const response = await axiosInstance.post(API_PATHS.FITNESS.CREATE_FITNESS_PROFILE, userData);

      if (response.status === 200) {
        onComplete(response.data.profile);
      }
      setIsSubmitting(false);

  };

  // Animation variants for the steps
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  // Progress indicator calculation
  const progress = (step / totalSteps) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-[#121225] max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl">
        {/* Header with progress bar */}
        <div className="bg-[#1A1A2F] p-4 sm:p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg sm:text-xl font-bold">Fitness Profile Setup</h2>
            <button
              className="text-white/70 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-white">
                  Step {step} of {totalSteps}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-[#f67a45]">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="flex h-2 mb-4 overflow-hidden rounded bg-[#03020d]">
              <motion.div
                initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center rounded bg-[#f67a45]"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Form content with steps */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-bold">What's your fitness experience level?</h3>
                <p className="text-white/70">Select the option that best describes your current fitness level</p>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    className={`w-full p-4 sm:p-5 rounded-xl border ${userData.experience === 'Beginner'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/10 hover:bg-[#1A1A2F]'} 
                      flex items-center transition-colors`}
                    onClick={() => handleRadioChange('experience', 'Beginner')}
                  >
                    <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border-2 ${userData.experience === 'Beginner' ? 'border-[#f67a45]' : 'border-white/30'
                      }`}>
                      {userData.experience === 'Beginner' && <div className="w-3 h-3 rounded-full bg-[#f67a45]"></div>}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-medium">Beginner</h4>
                      <p className="text-white/60 text-sm">New to fitness or returning after a long break</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`w-full p-4 sm:p-5 rounded-xl border ${userData.experience === 'Intermediate'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/10 hover:bg-[#1A1A2F]'} 
                      flex items-center transition-colors`}
                    onClick={() => handleRadioChange('experience', 'Intermediate')}
                  >
                    <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border-2 ${userData.experience === 'Intermediate' ? 'border-[#f67a45]' : 'border-white/30'
                      }`}>
                      {userData.experience === 'Intermediate' && <div className="w-3 h-3 rounded-full bg-[#f67a45]"></div>}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-medium">Intermediate</h4>
                      <p className="text-white/60 text-sm">Exercise regularly with some experience</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`w-full p-4 sm:p-5 rounded-xl border ${userData.experience === 'Advanced'
                      ? 'border-[#f67a45] bg-[#f67a45]/10'
                      : 'border-white/10 hover:bg-[#1A1A2F]'} 
                      flex items-center transition-colors`}
                    onClick={() => handleRadioChange('experience', 'Advanced')}
                  >
                    <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center border-2 ${userData.experience === 'Advanced' ? 'border-[#f67a45]' : 'border-white/30'
                      }`}>
                      {userData.experience === 'Advanced' && <div className="w-3 h-3 rounded-full bg-[#f67a45]"></div>}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-medium">Advanced</h4>
                      <p className="text-white/60 text-sm">Experienced with fitness and training techniques</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-bold">Personal Information</h3>
                <p className="text-white/70">These metrics help us calculate your BMI, BMR and other personalized fitness recommendations</p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Gender</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className={`flex-1 p-3 rounded-lg border ${userData.gender === 'Male'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          text-center transition-colors`}
                        onClick={() => handleRadioChange('gender', 'Male')}
                      >
                        <span className={userData.gender === 'Male' ? 'text-white' : 'text-white/70'}>Male</span>
                      </button>

                      <button
                        type="button"
                        className={`flex-1 p-3 rounded-lg border ${userData.gender === 'Female'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          text-center transition-colors`}
                        onClick={() => handleRadioChange('gender', 'Female')}
                      >
                        <span className={userData.gender === 'Female' ? 'text-white' : 'text-white/70'}>Female</span>
                      </button>

                      <button
                        type="button"
                        className={`flex-1 p-3 rounded-lg border ${userData.gender === 'Other'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          text-center transition-colors`}
                        onClick={() => handleRadioChange('gender', 'Other')}
                      >
                        <span className={userData.gender === 'Other' ? 'text-white' : 'text-white/70'}>Other</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={userData.age}
                      onChange={handleChange}
                      min="13"
                      max="100"
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      placeholder="Enter your age"
                    />
                    {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Weight
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="weight"
                        value={userData.weight}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                        placeholder="Enter your weight"
                      />
                      <select
                        name="weightUnit"
                        value={userData.weightUnit}
                        onChange={handleChange}
                        className="w-20 px-2 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      >
                        <option value="kg" className="bg-[#1A1A2F]">kg</option>
                        <option value="lbs" className="bg-[#1A1A2F]">lbs</option>
                      </select>
                    </div>
                    {errors.weight && <p className="text-red-400 text-xs mt-1">{errors.weight}</p>}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Height
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="height"
                        value={userData.height}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                        placeholder="Enter your height"
                      />
                      <select
                        name="heightUnit"
                        value={userData.heightUnit}
                        onChange={handleChange}
                        className="w-20 px-2 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      >
                        <option value="cm" className="bg-[#1A1A2F]">cm</option>
                        <option value="ft" className="bg-[#1A1A2F]">ft</option>
                      </select>
                    </div>
                    {errors.height && <p className="text-red-400 text-xs mt-1">{errors.height}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-bold">Your Fitness Goals</h3>
                <p className="text-white/70">Select your primary fitness goals (select all that apply)</p>

                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fitnessGoalOptions.map(goal => (
                      <label
                        key={goal.id}
                        className={`p-4 rounded-xl border cursor-pointer 
                          ${userData.goals.includes(goal.id)
                            ? 'border-[#f67a45] bg-[#f67a45]/10'
                            : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          flex items-center transition-colors`}
                      >
                        <input
                          type="checkbox"
                          name="goals"
                          value={goal.id}
                          checked={userData.goals.includes(goal.id)}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${userData.goals.includes(goal.id) ? 'bg-[#f67a45]' : 'border border-white/30'
                          }`}>
                          {userData.goals.includes(goal.id) && <FaCheck className="text-white text-xs" />}
                        </div>
                        <div className="flex items-center">
                          <span className="text-[#f67a45] mr-3">{goal.icon}</span>
                          <span className="text-white">{goal.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.goals && <p className="text-red-400 text-xs mt-1">{errors.goals}</p>}

                  <div className="pt-2">
                    <label className="block text-white text-sm font-medium mb-2">
                      How many days per week do you want to work out?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7].map(day => (
                        <button
                          key={day}
                          type="button"
                          className={`w-10 h-10 rounded-full ${userData.workoutDaysPerWeek === day
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'}`}
                          onClick={() => handleRadioChange('workoutDaysPerWeek', day)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {errors.workoutDaysPerWeek && <p className="text-red-400 text-xs mt-1">{errors.workoutDaysPerWeek}</p>}
                  </div>

                  <div className="pt-2">
                    <label className="block text-white text-sm font-medium mb-2">
                      Preferred workout duration
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: '15-30', label: '15-30 min' },
                        { id: '30-45', label: '30-45 min' },
                        { id: '45-60', label: '45-60 min' },
                        { id: '60+', label: '60+ min' }
                      ].map(option => (
                        <button
                          key={option.id}
                          type="button"
                          className={`p-2 rounded-lg ${userData.preferredWorkoutDuration === option.id
                            ? 'bg-[#f67a45] text-white'
                            : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'}`}
                          onClick={() => handleRadioChange('preferredWorkoutDuration', option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={step}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-white text-xl font-bold">Final Details</h3>
                <p className="text-white/70">Just a few more details to help personalize your experience</p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Activity Level</label>
                    <select
                      name="activityLevel"
                      value={userData.activityLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    >
                      <option value="Sedentary" className="bg-[#1A1A2F]">Sedentary (little or no exercise)</option>
                      <option value="Lightly active" className="bg-[#1A1A2F]">Light (light exercise 1-3 days/week)</option>
                      <option value="Moderately active" className="bg-[#1A1A2F]">Moderate (moderate exercise 3-5 days/week)</option>
                      <option value="Active" className="bg-[#1A1A2F]">Active (hard exercise 6-7 days/week)</option>
                      <option value="Very active" className="bg-[#1A1A2F]">Very Active (very hard exercise & physical job)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Equipment Access</label>
                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        className={`p-3 rounded-lg border text-left ${userData.equipmentAccess === 'No equipment'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          transition-colors`}
                        onClick={() => handleRadioChange('equipmentAccess', 'No equipment')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 ${userData.equipmentAccess === 'No equipment' ? 'border-[#f67a45]' : 'border-white/30'
                            }`}>
                            {userData.equipmentAccess === 'No equipment' && <div className="w-2.5 h-2.5 rounded-full bg-[#f67a45]"></div>}
                          </div>
                          <div>
                            <span className="text-white">No Equipment</span>
                            <p className="text-white/60 text-xs">Bodyweight exercises only</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg border text-left ${userData.equipmentAccess === 'Limited equipment'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          transition-colors`}
                        onClick={() => handleRadioChange('equipmentAccess', 'Limited equipment')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 ${userData.equipmentAccess === 'Limited equipment' ? 'border-[#f67a45]' : 'border-white/30'
                            }`}>
                            {userData.equipmentAccess === 'Limited equipment' && <div className="w-2.5 h-2.5 rounded-full bg-[#f67a45]"></div>}
                          </div>
                          <div>
                            <span className="text-white">Limited Equipment</span>
                            <p className="text-white/60 text-xs">Dumbbells, resistance bands, etc.</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`p-3 rounded-lg border text-left ${userData.equipmentAccess === 'Full gym access'
                          ? 'border-[#f67a45] bg-[#f67a45]/10'
                          : 'border-white/10 hover:bg-[#1A1A2F]'} 
                          transition-colors`}
                        onClick={() => handleRadioChange('equipmentAccess', 'Full gym access')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border-2 ${userData.equipmentAccess === 'Full gym access' ? 'border-[#f67a45]' : 'border-white/30'
                            }`}>
                            {userData.equipmentAccess === 'Full gym access' && <div className="w-2.5 h-2.5 rounded-full bg-[#f67a45]"></div>}
                          </div>
                          <div>
                            <span className="text-white">Full Gym Access</span>
                            <p className="text-white/60 text-xs">Access to a complete gym with all equipment</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Health Conditions (if any)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {healthConditionOptions.map(condition => (
                        <label
                          key={condition.id}
                          className={`p-2 rounded-lg border cursor-pointer 
                            ${userData.healthConditions.includes(condition.id) || (condition.id === 'None' && userData.healthConditions.length === 0)
                              ? 'border-[#f67a45] bg-[#f67a45]/10'
                              : 'border-white/10 hover:bg-[#1A1A2F]'} 
                            flex items-center transition-colors`}
                        >
                          <input
                            type="checkbox"
                            name="healthConditions"
                            value={condition.id}
                            checked={
                              condition.id === 'None'
                                ? userData.healthConditions.length === 0
                                : userData.healthConditions.includes(condition.id)
                            }
                            onChange={(e) => {
                              if (condition.id === 'None' && e.target.checked) {
                                // If 'None' is selected, clear all other selections
                                setUserData(prev => ({ ...prev, healthConditions: [] }));
                              } else if (condition.id !== 'None') {
                                // For other conditions, handle normally
                                handleChange(e);
                              }
                            }}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded flex items-center justify-center mr-2 ${(userData.healthConditions.includes(condition.id) ||
                              (condition.id === 'None' && userData.healthConditions.length === 0))
                              ? 'bg-[#f67a45]'
                              : 'border border-white/30'
                            }`}>
                            {(userData.healthConditions.includes(condition.id) ||
                              (condition.id === 'None' && userData.healthConditions.length === 0)) &&
                              <FaCheck className="text-white text-xs" />}
                          </div>
                          <span className="text-white text-sm">{condition.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-sm mb-4">
                    By clicking "Complete Setup", your fitness profile will be saved.
                    This data will be used to personalize your experience in the app.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer with navigation buttons */}
        <div className="bg-[#1A1A2F] p-4 sm:p-6 flex justify-between items-center border-t border-white/10">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 rounded-lg text-white border border-white/30 hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>{step > 1 ? 'Previous' : 'Cancel'}</span>
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-[#f67a45] text-white hover:bg-[#e56d3d] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                {step < totalSteps ? (
                  <>
                    <span>Next</span>
                    <FaArrowRight className="text-sm" />
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <FaCheck className="text-sm" />
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessProfileWizard;

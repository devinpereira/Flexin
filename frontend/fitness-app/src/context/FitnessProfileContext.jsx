import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const FitnessProfileContext =  createContext();

// Provider component
const FitnessProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update profile data
  const updateProfile = (newProfileData) => {
      setProfile(newProfileData);
      setIsLoading(false);
  };

  // Clear profile data
  const clearProfile = () => {
      setProfile(null);
      setIsLoading(false);
  };

  // Calculate BMI based on profile data
  const calculateBMI = () => {
    if (!profile) return null;

    // Convert weight to kg if needed
    const weightInKg = profile.weight;

    // Convert height to meters
    const heightInMeters = profile.height / 100;

    // Calculate BMI: weight (kg) / height² (m)
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  };

  // Calculate BMR based on profile data
  const calculateBMR = () => {
    if (!profile) return null;

    // Convert weight to kg if needed
    const weightInKg = profile.weight;

    // Convert height to cm
    const heightInCm = profile.height;

    // Mifflin-St Jeor Equation
    let bmr;
    if (profile.gender === 'Male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * profile.age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * profile.age - 161;
    }

    // Apply activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    // Normalize profile.activityLevel before lookup
    const normalizedActivity = profile.activityLevel
      .toLowerCase()
      .replace(/\s+/g, '_'); // Replace spaces with _

    const adjustedBmr = Math.round(bmr * (activityMultipliers[normalizedActivity] || 1.2));
    return adjustedBmr;
  };

  return (
    <FitnessProfileContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        clearProfile,
        calculateBMI,
        calculateBMR,
      }}
    >
      {children}
    </FitnessProfileContext.Provider>
  );
};

export default FitnessProfileProvider;

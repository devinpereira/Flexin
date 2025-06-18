import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const FitnessProfileContext = createContext();

// Custom hook for using the fitness profile context
export const useFitnessProfile = () => useContext(FitnessProfileContext);

// Provider component
export const FitnessProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile data from storage on initial render
  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem('fitnessProfileData');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error loading fitness profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile data
  const updateProfile = (newProfileData) => {
    try {
      // Save to storage
      localStorage.setItem('fitnessProfileData', JSON.stringify(newProfileData));
      
      // Update state
      setProfile(newProfileData);
      
      // In a real app, this would also make an API call to update the server
      console.log('Profile data would be sent to backend:', newProfileData);
      
      return true;
    } catch (error) {
      console.error('Error updating fitness profile:', error);
      return false;
    }
  };

  // Clear profile data
  const clearProfile = () => {
    try {
      localStorage.removeItem('fitnessProfileData');
      setProfile(null);
      return true;
    } catch (error) {
      console.error('Error clearing fitness profile:', error);
      return false;
    }
  };

  // Calculate BMI based on profile data
  const calculateBMI = () => {
    if (!profile) return null;
    
    // Convert weight to kg if needed
    const weightInKg = profile.weightUnit === 'lbs' 
      ? profile.weight * 0.45359237 
      : profile.weight;
    
    // Convert height to meters
    let heightInMeters;
    if (profile.heightUnit === 'ft') {
      heightInMeters = profile.height * 0.3048;
    } else {
      heightInMeters = profile.height / 100;
    }
    
    // Calculate BMI: weight (kg) / height² (m)
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(1));
  };

  // Calculate BMR based on profile data
  const calculateBMR = () => {
    if (!profile) return null;
    
    // Convert weight to kg if needed
    const weightInKg = profile.weightUnit === 'lbs' 
      ? profile.weight * 0.45359237 
      : profile.weight;
    
    // Convert height to cm
    const heightInCm = profile.heightUnit === 'ft' 
      ? profile.height * 30.48 
      : profile.height;
    
    // Mifflin-St Jeor Equation
    let bmr;
    if (profile.gender === 'male') {
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
    
    const adjustedBmr = Math.round(bmr * activityMultipliers[profile.activityLevel]);
    return adjustedBmr;
  };

  // Check if user needs to complete the fitness profile wizard
  const needsProfileSetup = () => {
    return !profile;
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
        needsProfileSetup
      }}
    >
      {children}
    </FitnessProfileContext.Provider>
  );
};

export default FitnessProfileProvider;

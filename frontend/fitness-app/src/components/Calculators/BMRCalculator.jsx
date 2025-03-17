import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BMRCalculator = () => {
  // State for calculator inputs
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  
  // State for calculator results
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState({});
  
  // State for UI
  const [expanded, setExpanded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  // Activity level factors
  const activityFactors = {
    sedentary: { factor: 1.2, description: 'Little or no exercise' },
    light: { factor: 1.375, description: 'Light exercise 1-3 days/week' },
    moderate: { factor: 1.55, description: 'Moderate exercise 3-5 days/week' },
    active: { factor: 1.725, description: 'Hard exercise 6-7 days/week' },
    veryActive: { factor: 1.9, description: 'Very hard exercise & physical job' }
  };
  
  // Calculate BMR using the Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (!height || !weight || !age) {
      alert('Please fill all the required fields');
      return;
    }
    
    // Mifflin-St Jeor Equation:
    // For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    
    let bmrValue;
    if (gender === 'male') {
      bmrValue = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) + 5;
    } else {
      bmrValue = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age)) - 161;
    }
    
    // Round to nearest whole number
    bmrValue = Math.round(bmrValue);
    
    setBmr(bmrValue);
    setLastResult(bmrValue);
    
    // Calculate daily calories for each activity level
    const calories = {};
    Object.keys(activityFactors).forEach(level => {
      calories[level] = Math.round(bmrValue * activityFactors[level].factor);
    });
    
    setDailyCalories(calories);
    
    // Store in localStorage
    try {
      const bmrHistory = JSON.parse(localStorage.getItem('bmrHistory')) || [];
      bmrHistory.push({
        date: new Date().toISOString(),
        age,
        gender,
        height,
        weight,
        activityLevel,
        bmr: bmrValue,
        dailyCalories: calories
      });
      localStorage.setItem('bmrHistory', JSON.stringify(bmrHistory));
    } catch (error) {
      console.error('Error saving BMR history:', error);
    }
  };
  
  // Load last result on mount
  useEffect(() => {
    try {
      const bmrHistory = JSON.parse(localStorage.getItem('bmrHistory')) || [];
      if (bmrHistory.length > 0) {
        const lastBmr = bmrHistory[bmrHistory.length - 1];
        setLastResult(lastBmr.bmr);
      }
    } catch (error) {
      console.error('Error loading BMR history:', error);
    }
  }, []);
  
  // Handle form reset
  const resetForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setGender('male');
    setActivityLevel('sedentary');
  };
  
  // Get dietary advice based on activity level
  const getDietaryAdvice = () => {
    switch (activityLevel) {
      case 'sedentary':
        return "Focus on nutrient-dense foods and be mindful of portion sizes. Include protein with each meal to maintain muscle mass.";
      case 'light':
        return "Prioritize protein intake and complex carbohydrates. Aim to eat balanced meals with plenty of fruits and vegetables.";
      case 'moderate':
        return "Ensure adequate protein intake (1.2-1.5g per kg of body weight) and include healthy carbs to fuel your workouts.";
      case 'active':
        return "Increase your carbohydrate and protein intake. Consider pre and post-workout nutrition to optimize recovery.";
      case 'veryActive':
        return "Focus on calorie-dense, nutritious foods. You may need to eat 5-6 meals per day to meet your energy requirements.";
      default:
        return "Focus on a balanced diet with adequate protein, complex carbohydrates, and healthy fats.";
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Header */}
      <div 
        className="bg-[#121225] text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-bold">BMR Calculator</h3>
        <div className="flex items-center gap-3">
          {lastResult && (
            <span className="bg-white/10 px-3 py-1 rounded-lg text-sm">
              Last BMR: <span className="font-bold">{lastResult}</span> calories
            </span>
          )}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Inputs */}
          <div className="flex-1 p-6">
            <h4 className="text-[#121225] font-medium mb-4">Enter Your Details</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="age-bmr">
                  Age
                </label>
                <input
                  type="number"
                  id="age-bmr"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="Years"
                  min="2"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="gender-bmr">
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender-bmr"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="mr-2 text-[#f67a45] focus:ring-[#f67a45]"
                    />
                    Male
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender-bmr"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="mr-2 text-[#f67a45] focus:ring-[#f67a45]"
                    />
                    Female
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="height-bmr">
                  Height
                </label>
                <input
                  type="number"
                  id="height-bmr"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="cm"
                  min="50"
                  max="250"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="weight-bmr">
                  Weight
                </label>
                <input
                  type="number"
                  id="weight-bmr"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="kg"
                  min="10"
                  max="300"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="activity">
                  Activity Level
                </label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly active (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderately active (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="veryActive">Very active (hard exercise & physical job)</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={calculateBMR}
                  className="bg-[#f67a45] text-white px-5 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex-1"
                >
                  Calculate BMR
                </button>
                <button
                  onClick={resetForm}
                  className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          {/* Dividing Line */}
          <div className="hidden md:block w-[1px] bg-gray-200 mx-2"></div>
          
          {/* Right Side - Results */}
          <div className="flex-1 p-6 bg-gray-50">
            <h4 className="text-[#121225] font-medium mb-4">Your Results</h4>
            
            <div className="flex flex-col">
              {bmr !== null ? (
                <>
                  {/* BMR Result */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                    <h5 className="text-lg font-medium text-[#121225] mb-2">Basal Metabolic Rate (BMR)</h5>
                    <div className="text-4xl font-bold text-[#f67a45] mb-2">
                      {bmr} <span className="text-lg font-normal text-gray-600">calories/day</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This is the number of calories your body needs to maintain basic functions at rest.
                    </p>
                  </div>
                  
                  {/* Daily Calorie Needs Table */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4">
                    <h5 className="text-lg font-medium text-[#121225] mb-3">Daily Calorie Needs Based on Activity Level</h5>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Activity Level</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Description</th>
                            <th className="px-4 py-2 text-sm font-medium text-gray-700">Calories</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(activityFactors).map(([key, { description }]) => (
                            <tr key={key} className={activityLevel === key ? "bg-[#f67a45]/10" : "border-b border-gray-200"}>
                              <td className="px-4 py-3 capitalize">
                                <span className={activityLevel === key ? "font-medium text-[#f67a45]" : ""}>
                                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                </span>
                                {activityLevel === key && (
                                  <span className="ml-2 text-xs bg-[#f67a45] text-white px-2 py-0.5 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{description}</td>
                              <td className="px-4 py-3 font-medium">
                                {dailyCalories[key]}
                                <span className="ml-1 text-sm font-normal text-gray-600">cal</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Dietary Advice */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h5 className="text-lg font-medium text-[#121225] mb-2">Dietary Advice</h5>
                    <p className="text-gray-700">{getDietaryAdvice()}</p>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      * These calculations are estimates based on the Mifflin-St Jeor Equation.
                      Individual needs may vary.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-center py-12">
                  Enter your details and click "Calculate BMR" to see your results here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMRCalculator;
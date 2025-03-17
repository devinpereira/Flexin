import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BMICalculator = () => {
  // State for calculator inputs
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  
  // State for calculator results
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [bmiColor, setBmiColor] = useState('#777');
  
  // State for UI
  const [expanded, setExpanded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  // Refs
  const meterRef = useRef(null);
  
  // Calculate BMI
  const calculateBMI = () => {
    if (!height || !weight || !age) {
      alert('Please fill all the required fields');
      return;
    }
    
    // Convert height to meters (from cm)
    const heightInMeters = Number(height) / 100;
    
    // Calculate BMI
    const bmiValue = Number(weight) / (heightInMeters * heightInMeters);
    
    // Round to 1 decimal place
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    
    setBmi(roundedBMI);
    setLastResult(roundedBMI);
    
    // Determine BMI category
    let category = '';
    let color = '';
    
    if (roundedBMI < 18.5) {
      category = 'Underweight';
      color = '#3498db'; // Blue
    } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
      category = 'Normal weight';
      color = '#2ecc71'; // Green
    } else if (roundedBMI >= 25 && roundedBMI < 30) {
      category = 'Overweight';
      color = '#f39c12'; // Yellow/Orange
    } else {
      category = 'Obesity';
      color = '#e74c3c'; // Red
    }
    
    setBmiCategory(category);
    setBmiColor(color);
    
    // Store in localStorage
    try {
      const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];
      bmiHistory.push({
        date: new Date().toISOString(),
        age,
        gender,
        height,
        weight,
        bmi: roundedBMI,
        category
      });
      localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
    } catch (error) {
      console.error('Error saving BMI history:', error);
    }
    
    // Update meter position
    updateMeter(roundedBMI);
  };
  
  // Update analog meter
  const updateMeter = (bmiValue) => {
    if (!meterRef.current) return;
    
    // Calculate rotation based on BMI (typically 10-40 range)
    // Map 10-40 BMI to -90 to 90 degrees
    const minBMI = 10;
    const maxBMI = 40;
    const minDegree = -90;
    const maxDegree = 90;
    
    let rotation = ((bmiValue - minBMI) / (maxBMI - minBMI)) * (maxDegree - minDegree) + minDegree;
    
    // Clamp rotation to valid range
    rotation = Math.max(minDegree, Math.min(maxDegree, rotation));
    
    // Apply rotation to needle
    meterRef.current.style.transform = `rotate(${rotation}deg)`;
  };
  
  // Load last result on mount
  useEffect(() => {
    try {
      const bmiHistory = JSON.parse(localStorage.getItem('bmiHistory')) || [];
      if (bmiHistory.length > 0) {
        const lastBmi = bmiHistory[bmiHistory.length - 1];
        setLastResult(lastBmi.bmi);
      }
    } catch (error) {
      console.error('Error loading BMI history:', error);
    }
  }, []);
  
  // Handle form reset
  const resetForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setGender('male');
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Header */}
      <div 
        className="bg-[#121225] text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-bold">BMI Calculator</h3>
        <div className="flex items-center gap-3">
          {lastResult && (
            <span className="bg-white/10 px-3 py-1 rounded-lg text-sm">
              Last BMI: <span className="font-bold">{lastResult}</span>
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
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="age">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="Years"
                  min="2"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="gender">
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
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
                      name="gender"
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
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="height">
                  Height
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="cm"
                  min="50"
                  max="250"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="weight">
                  Weight
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="kg"
                  min="10"
                  max="300"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={calculateBMI}
                  className="bg-[#f67a45] text-white px-5 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex-1"
                >
                  Calculate BMI
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
            
            <div className="flex flex-col items-center">
              {/* BMI Meter */}
              <div className="relative w-48 h-24 mb-6">
                <div className="absolute w-full h-full bg-gray-100 rounded-t-full border border-gray-200"></div>
                
                {/* Meter Scale */}
                <div className="absolute w-full h-full">
                  {/* Scale Lines */}
                  <div className="absolute bottom-0 left-1/4 h-3 w-0.5 bg-gray-400"></div>
                  <div className="absolute bottom-0 left-2/4 h-4 w-0.5 bg-gray-700"></div>
                  <div className="absolute bottom-0 left-3/4 h-3 w-0.5 bg-gray-400"></div>
                  
                  {/* Scale Labels */}
                  <div className="absolute bottom-4 left-0 text-xs text-gray-600">10</div>
                  <div className="absolute bottom-4 left-1/4 transform -translate-x-1/2 text-xs text-gray-600">20</div>
                  <div className="absolute bottom-4 left-2/4 transform -translate-x-1/2 text-xs text-gray-600">25</div>
                  <div className="absolute bottom-4 left-3/4 transform -translate-x-1/2 text-xs text-gray-600">30</div>
                  <div className="absolute bottom-4 right-0 transform translate-x-0 text-xs text-gray-600">40</div>
                </div>
                
                {/* Meter Needle */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  <div 
                    ref={meterRef}
                    className="origin-bottom h-20 w-1 bg-red-500 transition-transform duration-1000"
                    style={{ transform: 'rotate(0deg)' }}
                  ></div>
                  <div className="w-4 h-4 rounded-full bg-gray-800 -mt-2 -ml-1.5"></div>
                </div>
                
                {/* Colored Zones */}
                <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                  <div className="flex-1 bg-blue-500 rounded-bl-full"></div>
                  <div className="flex-1 bg-green-500"></div>
                  <div className="flex-1 bg-yellow-500"></div>
                  <div className="flex-1 bg-red-500 rounded-br-full"></div>
                </div>
              </div>
              
              {/* BMI Value */}
              {bmi !== null ? (
                <>
                  <div className="text-4xl font-bold" style={{ color: bmiColor }}>
                    {bmi}
                  </div>
                  <div className="text-lg font-medium mt-1 mb-4" style={{ color: bmiColor }}>
                    {bmiCategory}
                  </div>
                  
                  <div className="w-full max-w-xs bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium mb-2 text-[#121225]">BMI Categories</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center justify-between">
                        <span>Underweight</span>
                        <span className="font-medium text-blue-600">&lt; 18.5</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Normal weight</span>
                        <span className="font-medium text-green-600">18.5 - 24.9</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Overweight</span>
                        <span className="font-medium text-yellow-600">25 - 29.9</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Obesity</span>
                        <span className="font-medium text-red-600">&gt; 30</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-4 text-center">
                    BMI is a screening tool, not a diagnostic of body fatness or health.
                  </p>
                </>
              ) : (
                <div className="text-gray-500 text-center py-6">
                  Enter your details and click "Calculate BMI" to see your results here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
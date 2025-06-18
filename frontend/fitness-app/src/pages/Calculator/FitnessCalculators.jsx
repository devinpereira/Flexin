import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import BMICalculator from '../../components/Calculators/BMICalculator';
import BMRCalculator from '../../components/Calculators/BMRCalculator';
import MealsCalculator from '../../components/Calculators/MealsCalculator';
import { FaWeight, FaFireAlt, FaUtensils, FaCalculator } from 'react-icons/fa';

const FitnessCalculators = () => {
  const navigate = useNavigate();
  const [activeCalculator, setActiveCalculator] = useState('all');

  // Function to render the active calculator or all calculators
  const renderCalculators = () => {
    switch (activeCalculator) {
      case 'bmi':
        return <BMICalculator />;
      case 'bmr':
        return <BMRCalculator />;
      case 'meals':
        return <MealsCalculator />;
      case 'all':
      default:
        return (
          <>
            <BMICalculator />
            <BMRCalculator />
            <MealsCalculator />
          </>
        );
    }
  };

  return (
    <CalculatorLayout pageTitle="Fitness Metrics">
      {/* Calculator type selector */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
        <div className="flex overflow-x-auto whitespace-nowrap py-1">
          <button
            className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${activeCalculator === 'all'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#1A1A2F]'
              }`}
            onClick={() => setActiveCalculator('all')}
          >
            <FaCalculator size={14} className="md:block" />
            <span className="text-sm sm:text-base">All</span>
          </button>

          <button
            className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${activeCalculator === 'bmi'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#1A1A2F]'
              }`}
            onClick={() => setActiveCalculator('bmi')}
          >
            <FaWeight size={14} className="md:block" />
            <span className="text-sm sm:text-base">BMI</span>
          </button>

          <button
            className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${activeCalculator === 'bmr'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#1A1A2F]'
              }`}
            onClick={() => setActiveCalculator('bmr')}
          >
            <FaFireAlt size={14} className="md:block" />
            <span className="text-sm sm:text-base">BMR</span>
          </button>

          <button
            className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${activeCalculator === 'meals'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#1A1A2F]'
              }`}
            onClick={() => setActiveCalculator('meals')}
          >
            <FaUtensils size={14} className="md:block" />
            <span className="text-sm sm:text-base">Meals</span>
          </button>
        </div>
      </div>

      {/* Calculator content */}
      <div className="space-y-6">
        {renderCalculators()}
      </div>
    </CalculatorLayout>
  );
};

export default FitnessCalculators;
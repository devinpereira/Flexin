import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import BMICalculator from '../components/Calculators/BMICalculator';
import BMRCalculator from '../components/Calculators/BMRCalculator';
import MealsCalculator from '../components/Calculators/MealsCalculator';

import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaWeight,
  FaFireAlt,
  FaUtensils
} from 'react-icons/fa';

const FitnessCalculators = () => {
  const navigate = useNavigate();
  const [activeSection] = useState('Calculators');
  const [activeCalculator, setActiveCalculator] = useState('all');

  // Function to render the active calculator or all calculators
  const renderCalculators = () => {
    switch(activeCalculator) {
      case 'bmi':
        return <BMICalculator />;
      case 'bmr':
        return <BMRCalculator />;
      case 'meals':
        return <MealsCalculator />;
      case 'all':
      default:
        return (
          <div className="space-y-6 pb-12">
            <BMICalculator />
            <BMRCalculator />
            <MealsCalculator />
          </div>
        );
    }
  };

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
          <div className="mb-6">
            <h2 className="text-white text-2xl font-bold">Fitness Metrics</h2>
            <p className="text-white/70">Track your body metrics and nutrition with these calculators</p>
          </div>

          {/* Calculator Selection Tabs */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
            <div className="flex overflow-x-auto">
              <button
                className={`px-6 py-3 whitespace-nowrap flex items-center gap-2 ${
                  activeCalculator === 'all'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#1A1A2F]'
                }`}
                onClick={() => setActiveCalculator('all')}
              >
                <FaCalculator size={16} />
                <span>All Calculators</span>
              </button>

              <button
                className={`px-6 py-3 whitespace-nowrap flex items-center gap-2 ${
                  activeCalculator === 'bmi'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#1A1A2F]'
                }`}
                onClick={() => setActiveCalculator('bmi')}
              >
                <FaWeight size={16} />
                <span>BMI Calculator</span>
              </button>

              <button
                className={`px-6 py-3 whitespace-nowrap flex items-center gap-2 ${
                  activeCalculator === 'bmr'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#1A1A2F]'
                }`}
                onClick={() => setActiveCalculator('bmr')}
              >
                <FaFireAlt size={16} />
                <span>BMR Calculator</span>
              </button>

              <button
                className={`px-6 py-3 whitespace-nowrap flex items-center gap-2 ${
                  activeCalculator === 'meals'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#1A1A2F]'
                }`}
                onClick={() => setActiveCalculator('meals')}
              >
                <FaUtensils size={16} />
                <span>Meals Calculator</span>
              </button>
            </div>
          </div>

          {/* Display Selected Calculator(s) */}
          {renderCalculators()}
        </div>
      </div>
    </div>
  );
};

export default FitnessCalculators;
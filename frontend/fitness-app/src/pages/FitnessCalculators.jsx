import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import BMICalculator from '../components/Calculators/BMICalculator';
import BMRCalculator from '../components/Calculators/BMRCalculator';
import MealsCalculator from '../components/Calculators/MealsCalculator';
import { useNavigationHistory } from '../context/NavigationContext';

import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaWeight,
  FaFireAlt,
  FaUtensils,
  FaArrowLeft,
  FaBars
} from 'react-icons/fa';

const FitnessCalculators = () => {
  const navigate = useNavigate();
  const { goBack } = useNavigationHistory();
  const [activeSection] = useState('Calculators');
  const [activeCalculator, setActiveCalculator] = useState('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setShowSidebar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            {/* Training */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Training'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/calculators');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaDumbbell size={20} />
              <span>Training</span>
            </a>
            
            {/* Custom Schedules */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Custom Schedules'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/custom-schedules');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaCalendarAlt size={20} />
              <span>Custom Schedules</span>
            </a>
            
            {/* Calculators */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Calculators'
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
              }}
            >
              <FaCalculator size={20} />
              <span>Calculators</span>
            </a>
            
            {/* Exercises */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Exercises'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/exercises');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaRunning size={20} />
              <span>Exercises</span>
            </a>
            
            {/* Reports */}
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Reports'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/reports');
                setIsMobileMenuOpen(false);
              }}
            >
              <FaChartBar size={20} />
              <span>Reports</span>
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
        {/* Page Title - Mobile version */}
        <div className="md:hidden mb-4 flex items-center">
          <button 
            onClick={() => goBack('/calculators')}
            className="text-white mr-3 flex items-center gap-2"
          >
            <FaArrowLeft /> <span className="sr-only">Back</span>
          </button>
          <h1 className="text-white text-lg sm:text-xl font-bold">Fitness Metrics</h1>
        </div>
        
        {/* Responsive Layout Container */}
        <div className="flex flex-col md:flex-row">
          {/* Left Navigation - Hidden on mobile, visible on md and up */}
          <div className="hidden md:block md:fixed left-0 top-50 z-10 h-screen">
            <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full overflow-y-auto">
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
          <div className="md:ml-[300px] flex-1">
            {/* Page Header - Hidden on mobile (already in top bar) */}
            <div className="hidden md:block mb-6">
              <h2 className="text-white text-2xl font-bold">Fitness Metrics</h2>
              <p className="text-white/70">Track your body metrics and nutrition with these calculators</p>
            </div>

            {/* Calculator Selection Tabs - Scrollable for mobile */}
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden mb-6">
              <div className="flex overflow-x-auto whitespace-nowrap py-1">
                <button
                  className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${
                    activeCalculator === 'all'
                      ? 'bg-[#f67a45] text-white font-medium'
                      : 'text-white hover:bg-[#1A1A2F]'
                  }`}
                  onClick={() => setActiveCalculator('all')}
                >
                  <FaCalculator size={14} className="md:block" />
                  <span className="text-sm sm:text-base">All</span>
                </button>

                <button
                  className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${
                    activeCalculator === 'bmi'
                      ? 'bg-[#f67a45] text-white font-medium'
                      : 'text-white hover:bg-[#1A1A2F]'
                  }`}
                  onClick={() => setActiveCalculator('bmi')}
                >
                  <FaWeight size={14} className="md:block" />
                  <span className="text-sm sm:text-base">BMI</span>
                </button>

                <button
                  className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${
                    activeCalculator === 'bmr'
                      ? 'bg-[#f67a45] text-white font-medium'
                      : 'text-white hover:bg-[#1A1A2F]'
                  }`}
                  onClick={() => setActiveCalculator('bmr')}
                >
                  <FaFireAlt size={14} className="md:block" />
                  <span className="text-sm sm:text-base">BMR</span>
                </button>

                <button
                  className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-1 sm:gap-2 ${
                    activeCalculator === 'meals'
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

            {/* Display Selected Calculator(s) */}
            <div className="pb-20">
              {renderCalculators()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Extra padding at the bottom for mobile to account for the floating button */}
      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default FitnessCalculators;
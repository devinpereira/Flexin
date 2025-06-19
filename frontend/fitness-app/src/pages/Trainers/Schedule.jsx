import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaPlus, FaBars } from 'react-icons/fa';
import { MdExplore, MdArrowBack } from 'react-icons/md';
import { BsCalendarWeek } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

const Schedule = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [activeDay, setActiveDay] = useState('Day 1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "John Smith",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning"
  };

  // Mock schedule data
  const schedule = {
    "Day 1": [
      { id: 1, name: "Incline Barbell Press", sets: 4, reps: 8, image: "/src/assets/exercise1.png" },
      { id: 2, name: "Dumbbell Bench Press", sets: 3, reps: 10, image: "/src/assets/exercise1.png" },
      { id: 3, name: "Cable Flyes", sets: 3, reps: 12, image: "/src/assets/exercise1.png" }
    ],
    "Day 2": [
      { id: 4, name: "Barbell Squat", sets: 5, reps: 5, image: "/src/assets/exercise1.png" },
      { id: 5, name: "Romanian Deadlift", sets: 4, reps: 8, image: "/src/assets/exercise1.png" },
      { id: 6, name: "Leg Press", sets: 3, reps: 12, image: "/src/assets/exercise1.png" }
    ],
    "Day 3": [
      { id: 7, name: "Pull-ups", sets: 4, reps: 8, image: "/src/assets/exercise1.png" },
      { id: 8, name: "Barbell Rows", sets: 4, reps: 8, image: "/src/assets/exercise1.png" },
      { id: 9, name: "Face Pulls", sets: 3, reps: 15, image: "/src/assets/exercise1.png" }
    ],
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaBars size={24} />
        </button>
      </div>
      
      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'My Trainers'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/trainers');
              }}
            >
              <FaUserFriends size={20} />
              <span>My Trainers</span>
            </a>
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Explore'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/explore');
              }}
            >
              <MdExplore size={20} />
              <span>Explore</span>
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
        {/* Desktop Side Navigation */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>
              
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/explore');
                }}
              >
                <MdExplore size={20} />
                <span>Explore</span>
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
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <button 
            onClick={() => navigate(`/trainer-profile/${trainerId}`)}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainer Profile</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Workout Schedule Content */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Workout Schedule</h2>
                
                {/* Days Selection */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                  {Object.keys(schedule).map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                        activeDay === day
                          ? 'bg-[#f67a45] text-white'
                          : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                {/* Exercises for Selected Day */}
                <div className="space-y-4">
                  {schedule[activeDay]?.map((exercise) => (
                    <div key={exercise.id} className="bg-[#1A1A2F] rounded-lg p-4 flex items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img
                          src={exercise.image}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/exercise-default.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{exercise.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                            {exercise.sets} sets
                          </span>
                          <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                            {exercise.reps} reps
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8">
                <h3 className="text-white text-lg font-bold mb-4">Trainer Notes</h3>
                <div className="bg-[#1A1A2F] p-4 rounded-lg">
                  <p className="text-white/80">
                    Follow this workout plan 3 times per week with at least one rest day between sessions. Start with a 10-minute warm-up and finish with 5-10 minutes of stretching. If you're struggling with an exercise, reduce the weight or modify the movement. Progress by adding weight when you can complete all sets and reps with good form.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sidebar - Trainer Info */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4">
                    <img 
                      src={trainer.image} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/profile1.png';
                      }}
                    />
                  </div>
                  <h3 className="text-white text-lg sm:text-xl font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2 text-sm sm:text-base">{trainer.specialty}</p>
                  <a 
                    onClick={() => navigate(`/trainer-profile/${trainerId}`)}
                    className="text-[#f67a45] hover:underline text-sm cursor-pointer"
                  >
                  View Profile
                  </a>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2">
                    <BsCalendarWeek />
                    <span>Schedule</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/meal-plan/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <GiMeal />
                    <span>Meal Plan</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/chat/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BiChat />
                    <span>Chat</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/subscription/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RiVipDiamondLine />
                    <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

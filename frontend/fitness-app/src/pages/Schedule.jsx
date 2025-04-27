import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
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

  const days = Object.keys(schedule);
  
  // Handle navigation for left sidebar
  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Explore') {
      navigate('/explore');
    } else if (section === 'My Trainers') {
      navigate('/trainers');
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
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'My Trainers'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('My Trainers');
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
                handleNavigation('Explore');
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
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              {/* My Trainers */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('My Trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>
              
              {/* Explore */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('Explore');
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
        
        {/* Main Content with responsive margins */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <button 
            onClick={() => navigate('/trainers')}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainers</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Left side - Schedule content - Full width on mobile, 3/4 on desktop */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Schedule</h2>
                
                {/* Days navigation - Scrollable on mobile */}
                <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#f67a45]/30 scrollbar-track-transparent">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full whitespace-nowrap ${
                        activeDay === day
                          ? 'bg-white text-[#121225]'
                          : 'bg-transparent text-white border border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                {/* Exercises for selected day - Responsive layout */}
                <div className="space-y-3 sm:space-y-4">
                  {schedule[activeDay]?.map((exercise) => (
                    <div key={exercise.id} className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center">
                      <div className="flex items-center flex-1 mb-3 sm:mb-0">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-100 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                          <img 
                            src={exercise.image} 
                            alt={exercise.name} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/src/assets/equipment.png';
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-[#121225] text-sm sm:text-base">{exercise.name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm">{exercise.sets} sets x {exercise.reps} reps</p>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 justify-end">
                        <a href="#" className="text-[#f67a45] hover:underline text-xs sm:text-sm px-3 py-1 border border-[#f67a45]/30 rounded-full text-center">View</a>
                        <a href="#" className="text-[#f67a45] hover:underline text-xs sm:text-sm px-3 py-1 border border-[#f67a45]/30 rounded-full text-center">Edit</a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <button className="bg-[#f67a45] text-white px-8 sm:px-10 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
                    Start
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side - Trainer info and actions - Stacked on mobile, side by side on desktop */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Trainer info card */}
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
              
              {/* Add More Trainers Box */}
              <div 
                onClick={() => navigate('/explore')}
                className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-32 sm:h-48 cursor-pointer hover:bg-[#1A1A2F] transition-colors"
              >
                <div className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-2 sm:mb-3">
                  <FaPlus className="text-[#f67a45] text-lg sm:text-xl" />
                </div>
                <p className="text-white text-center text-sm sm:text-base">Find More Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
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
      
      <div className="container mx-auto pt-8 px-4 flex">
        {/* Left Navigation */}
        <div className="fixed left-0 top-50 z-10 h-screen">
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
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          <button 
            onClick={() => navigate('/trainers')}
            className="mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainers</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left side - Schedule content */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
                <h2 className="text-white text-2xl font-bold mb-6">Schedule</h2>
                
                {/* Days navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-6 py-2 rounded-full ${
                        activeDay === day
                          ? 'bg-white text-[#121225]'
                          : 'bg-transparent text-white border border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                {/* Exercises for selected day */}
                <div className="space-y-4">
                  {schedule[activeDay]?.map((exercise) => (
                    <div key={exercise.id} className="bg-white rounded-lg p-4 flex items-center">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#121225]">{exercise.name}</h3>
                        <p className="text-gray-600">{exercise.sets} sets x {exercise.reps} reps</p>
                      </div>
                      
                      <div className="w-20 h-20 bg-gray-100 rounded-lg mx-4">
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
                      
                      <div className="flex flex-col gap-2">
                        <a href="#" className="text-[#f67a45] hover:underline text-sm">View</a>
                        <a href="#" className="text-[#f67a45] hover:underline text-sm">Edit</a>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button className="bg-[#f67a45] text-white px-10 py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium">
                    Start
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side - Trainer info and actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trainer info card */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
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
                  <h3 className="text-white text-xl font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2">{trainer.specialty}</p>
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
                className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-6 flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-[#1A1A2F] transition-colors"
              >
                <div className="bg-[#f67a45]/20 p-4 rounded-full mb-3">
                  <FaPlus className="text-[#f67a45] text-xl" />
                </div>
                <p className="text-white text-center">Find More Trainers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
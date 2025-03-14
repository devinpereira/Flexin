import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';

const Trainers = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');

  // Mock trainer data
  const trainers = [
    { id: 1, name: "John Smith", image: "/src/assets/trainers/trainer1.png", specialty: "Strength & Conditioning" },
    { id: 2, name: "Sarah Johnson", image: "/src/assets/trainers/trainer2.png", specialty: "Yoga & Flexibility" },
    { id: 3, name: "Mike Williams", image: "/src/assets/trainers/trainer3.png", specialty: "Bodybuilding" },
    { id: 4, name: "Emily Davis", image: "/src/assets/trainers/trainer4.png", specialty: "Cardio & HIIT" }
  ];

  const handleGoToSchedule = (trainerId) => {
    navigate(`/schedule/${trainerId}`);
  };

  // Handle navigation for left sidebar
  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Explore') {
      navigate('/explore');
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
                  <img src="/src/assets/trainer.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span className="text-white">Account</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          <h2 className="text-white text-2xl font-bold mb-6">{activeSection}</h2>
          <hr className="border-gray-600 mb-6" />
          
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainers.map(trainer => (
                <div key={trainer.id} className="bg-[#1A1A2F] rounded-lg p-4 flex flex-col items-center">
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={trainer.image} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/trainer.png';
                      }}
                    />
                  </div>
                  <h3 className="text-white text-lg font-medium mb-1">{trainer.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{trainer.specialty}</p>
                  <button 
                    onClick={() => handleGoToSchedule(trainer.id)}
                    className="bg-[#f67a45] text-white px-8 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                  >
                    Go
                  </button>
                </div>
              ))}
            </div>
            
            {/* Add Discover More Trainers button */}
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => navigate('/explore')}
                className="bg-[#1A1A2F] text-white px-10 py-3 rounded-full hover:bg-[#2A2A3F] transition-colors font-medium flex items-center gap-2 border border-[#f67a45]/30"
              >
                <FaPlus size={14} />
                Discover More Trainers
              </button>
            </div>
          </div>
          
          {/* Add "Find New Trainers" card */}
          <div className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f67a45]/20 p-6 rounded-full mb-4">
                <MdExplore className="text-[#f67a45] text-4xl" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Looking for more options?</h3>
              <p className="text-white/70 mb-6 max-w-lg">Explore our marketplace of fitness professionals to find the perfect trainer for your goals and preferences.</p>
              <button 
                onClick={() => navigate('/explore')}
                className="bg-[#f67a45] text-white px-10 py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium flex items-center gap-2"
              >
                <FaPlus size={14} />
                Explore All Trainers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';

const Explore = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Mock trainer data - expanded list for explore
  const allTrainers = [
    { id: 1, name: "John Smith", image: "/src/assets/trainers/trainer1.png", specialty: "Strength & Conditioning", rating: 4.8 },
    { id: 2, name: "Sarah Johnson", image: "/src/assets/trainers/trainer2.png", specialty: "Yoga & Flexibility", rating: 4.9 },
    { id: 3, name: "Mike Williams", image: "/src/assets/trainers/trainer3.png", specialty: "Bodybuilding", rating: 4.7 },
    { id: 4, name: "Emily Davis", image: "/src/assets/trainers/trainer4.png", specialty: "Cardio & HIIT", rating: 4.6 },
    { id: 5, name: "David Chen", image: "/src/assets/trainers/trainer5.png", specialty: "CrossFit", rating: 4.5 },
    { id: 6, name: "Lisa Rodriguez", image: "/src/assets/trainers/trainer6.png", specialty: "Pilates", rating: 4.9 },
    { id: 7, name: "Alex Thompson", image: "/src/assets/trainers/trainer7.png", specialty: "Nutrition", rating: 4.8 },
    { id: 8, name: "Jordan Lee", image: "/src/assets/trainers/trainer8.png", specialty: "Functional Training", rating: 4.7 }
  ];

  // Generate specialty options from trainer data
  const specialties = ['All', ...new Set(allTrainers.map(trainer => trainer.specialty))];

  // Filter trainers based on search query and specialty
  const filteredTrainers = allTrainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || trainer.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Handle adding a trainer (in a real app, this would update a database)
  const handleAddTrainer = (trainerId) => {
    // For demo purposes, just navigate to their schedule
    navigate(`/schedule/${trainerId}`);
  };

  // Handle viewing trainer's profile
  const handleViewTrainerProfile = (trainerId) => {
    navigate(`/trainer-profile/${trainerId}`);
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
                  setActiveSection('My Trainers');
                  navigate('/trainers');
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
                  setActiveSection('Explore');
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
          <h2 className="text-white text-2xl font-bold mb-6">Discover New Trainers</h2>
          
          {/* Search and Filter */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search trainers by name or specialty..."
                  className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <select 
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Trainers Grid */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrainers.map(trainer => (
                <div key={trainer.id} className="bg-[#1A1A2F] rounded-lg p-4 flex flex-col items-center">
                  {/* Make image clickable for profile */}
                  <div 
                    className="w-full h-48 mb-4 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleViewTrainerProfile(trainer.id)}
                  >
                    <img 
                      src={trainer.image} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/trainer.png';
                      }}
                    />
                  </div>
                  
                  {/* Make name clickable for profile */}
                  <h3 
                    className="text-white text-lg font-medium mb-1 hover:text-[#f67a45] cursor-pointer"
                    onClick={() => handleViewTrainerProfile(trainer.id)}
                  >
                    {trainer.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-2">{trainer.specialty}</p>
                  
                  <div className="flex items-center text-[#f67a45] mb-4">
                    <span className="mr-1">★</span>
                    <span>{trainer.rating}</span>
                  </div>
                  
                  {/* Add both View Profile and Add Trainer buttons */}
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => handleViewTrainerProfile(trainer.id)}
                      className="flex-1 bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      View Profile
                    </button>
                    
                    <button 
                      onClick={() => handleAddTrainer(trainer.id)}
                      className="flex-1 bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-1"
                    >
                      <FaPlus size={12} />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
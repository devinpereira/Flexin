import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaPlus, FaSearch } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';

const Explore = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('Explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMobileFiltersOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Handle navigation
  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'My Trainers') {
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
          {isMobileMenuOpen ? <FaUserFriends size={24} /> : <MdExplore size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>

        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'My Trainers'
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
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${activeSection === 'Explore'
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
        <div className="flex flex-col">
          {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
          <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
            <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
              <div className="space-y-6 mt-8">
                {/* My Trainers */}
                <a
                  href="#"
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'My Trainers'
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
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'Explore'
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
          <div className="w-full md:ml-[275px] lg:ml-[300px]">
            <div className="py-4">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Discover New Trainers</h2>

              {/* Search and Filter - Responsive version */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6">
                {/* Mobile filter toggle */}
                <div className="flex items-center justify-between mb-3 md:hidden">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search trainers..."
                      className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  </div>
                  <button
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    className="ml-2 bg-[#1A1A2F] px-3 py-2 rounded-lg text-white text-sm"
                  >
                    Filter
                  </button>
                </div>

                {/* Filters - collapsed on mobile unless opened */}
                <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="hidden md:block relative flex-1">
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
                        className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      >
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results count */}
              <div className="mb-3">
                <p className="text-white/70 text-sm">
                  {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Trainers Grid - Responsive */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-3 sm:p-6 mb-6 sm:mb-8">
                {filteredTrainers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredTrainers.map(trainer => (
                      <div key={trainer.id} className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex flex-col items-center">
                        {/* Image - responsive sizing */}
                        <div
                          className="w-full h-32 sm:h-40 mb-3 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => handleViewTrainerProfile(trainer.id)}
                        >
                          <img
                            src={trainer.image}
                            alt={trainer.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/src/assets/trainer.png';
                            }}
                          />
                        </div>

                        <h3
                          className="text-white text-base sm:text-lg font-medium mb-0.5 sm:mb-1 hover:text-[#f67a45] cursor-pointer"
                          onClick={() => handleViewTrainerProfile(trainer.id)}
                        >
                          {trainer.name}
                        </h3>

                        <p className="text-gray-400 text-xs sm:text-sm mb-1">{trainer.specialty}</p>

                        <div className="flex items-center text-[#f67a45] mb-3 text-sm">
                          <span className="mr-1">★</span>
                          <span>{trainer.rating}</span>
                        </div>

                        {/* Buttons - stack on small mobile, side by side otherwise */}
                        <div className="flex flex-col sm:flex-row w-full gap-2">
                          <button
                            onClick={() => handleViewTrainerProfile(trainer.id)}
                            className="bg-transparent border border-[#f67a45]/50 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base flex-1"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => handleAddTrainer(trainer.id)}
                            className="bg-[#f67a45] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base flex-1 flex items-center justify-center gap-1"
                          >
                            <FaPlus size={12} />
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
                    <p className="text-white/70">No trainers found matching your search criteria.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSpecialty('All');
                      }}
                      className="mt-4 text-[#f67a45] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Extra padding at bottom for mobile to account for the floating button */}
              <div className="h-24 md:h-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
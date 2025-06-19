import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaPlus } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';

const Trainers = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

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

  // Mock trainers data
  const myTrainers = [
    { id: 1, name: "John Smith", image: "/src/assets/trainer.png", specialty: "Strength & Conditioning" },
    { id: 2, name: "Sarah Johnson", image: "/src/assets/trainer.png", specialty: "Yoga & Flexibility" }
  ];

  // Handle navigation
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
      
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaUserFriends size={24} />
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
                  handleNavigation('My Trainers');
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
                  handleNavigation('Explore');
                }}
              >
                <MdExplore size={20} />
                <span>Explore</span>
              </a>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Trainers</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTrainers.map(trainer => (
              <div 
                key={trainer.id}
                className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-5 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => navigate(`/trainer-profile/${trainer.id}`)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
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
                  <h3 className="text-white text-lg font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{trainer.specialty}</p>
                  <button 
                    className="bg-[#f67a45] text-white px-4 py-1.5 rounded-full text-sm hover:bg-[#e56d3d] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trainer-profile/${trainer.id}`);
                    }}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add New Trainer Card */}
            <div 
              className="bg-[#121225] border border-dashed border-[#f67a45]/50 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A1A2F] transition-colors h-[250px]"
              onClick={() => navigate('/explore')}
            >
              <div className="bg-[#f67a45]/20 p-4 rounded-full mb-4">
                <FaPlus className="text-[#f67a45] text-xl" />
              </div>
              <p className="text-white text-center">Find a Trainer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;

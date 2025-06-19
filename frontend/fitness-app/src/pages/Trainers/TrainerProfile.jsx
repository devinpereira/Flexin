import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaStar, FaRegStar, FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { MdExplore, MdArrowBack } from 'react-icons/md';
import { BsCalendarWeek, BsStarHalf } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

const TrainerProfile = () => {
  const { trainerId } = useParams();
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
  
  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "Nipuna Lakruwan",
    title: "Certified Personal Trainer",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning",
    rating: 4.8,
    reviewCount: 28,
    price: "$50/session",
    description: "Nipuna is a dedicated fitness professional with over 10 years of experience helping clients achieve their fitness goals. Specializing in strength training and conditioning, Nipuna has worked with clients of all fitness levels, from beginners to professional athletes. His personalized approach ensures that each client receives a tailored program designed to meet their specific needs and goals.",
    socialMedia: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      twitter: "https://twitter.com/"
    }
  };
  
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#f67a45]" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="text-[#f67a45]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#f67a45]" />);
      }
    }
    
    return stars;
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
            onClick={() => navigate('/trainers')}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainers</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Trainer Profile Content */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Trainer Image */}
                  <div className="w-full md:w-1/3">
                    <div className="rounded-lg overflow-hidden mb-4">
                      <img 
                        src={trainer.image} 
                        alt={trainer.name} 
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                      <a href={trainer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f67a45]">
                        <FaFacebook size={20} />
                      </a>
                      <a href={trainer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f67a45]">
                        <FaInstagram size={20} />
                      </a>
                      <a href={trainer.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f67a45]">
                        <FaTiktok size={20} />
                      </a>
                      <a href={trainer.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f67a45]">
                        <FaTwitter size={20} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Trainer Info */}
                  <div className="w-full md:w-2/3">
                    <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">{trainer.name}</h1>
                    <p className="text-gray-400 mb-3">{trainer.title}</p>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {renderStars(trainer.rating)}
                      </div>
                      <span className="text-white">{trainer.rating}</span>
                      <span className="text-gray-400 ml-1">({trainer.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm">{trainer.specialty}</span>
                      <span className="text-[#f67a45] ml-4 text-lg font-semibold">{trainer.price}</span>
                    </div>
                    
                    <p className="text-white/80 mb-6 leading-relaxed">{trainer.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => navigate(`/schedule/${trainerId}`)}
                        className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 flex-1"
                      >
                        <BsCalendarWeek />
                        <span>Schedule</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/meal-plan/${trainerId}`)}
                        className="bg-gray-700/50 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 flex-1"
                      >
                        <GiMeal />
                        <span>Meal Plan</span>
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <button 
                        onClick={() => navigate(`/chat/${trainerId}`)}
                        className="bg-gray-700/50 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 flex-1"
                      >
                        <BiChat />
                        <span>Chat</span>
                      </button>
                      
                      <button 
                        onClick={() => navigate(`/subscription/${trainerId}`)}
                        className="bg-gray-700/50 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 flex-1"
                      >
                        <RiVipDiamondLine />
                        <span>Subscription</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Certifications Section */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Certifications</h2>
                <div className="space-y-4">
                  <div className="bg-[#1A1A2F] p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-1">Certified Personal Trainer (CPT)</h3>
                    <p className="text-gray-400 text-sm">National Academy of Sports Medicine (NASM)</p>
                  </div>
                  <div className="bg-[#1A1A2F] p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-1">Corrective Exercise Specialist (CES)</h3>
                    <p className="text-gray-400 text-sm">National Academy of Sports Medicine (NASM)</p>
                  </div>
                  <div className="bg-[#1A1A2F] p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-1">Sports Nutrition Certification</h3>
                    <p className="text-gray-400 text-sm">International Sports Sciences Association (ISSA)</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Client Reviews</h2>
                <div className="space-y-6">
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <img src="/src/assets/profile1.png" alt="Client" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <h3 className="text-white font-medium">John Doe</h3>
                          <div className="flex text-[#f67a45]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">2 months ago</span>
                    </div>
                    <p className="text-white/80">Working with {trainer.name} has been transformative. His expertise in strength training helped me achieve goals I never thought possible. Highly recommended!</p>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <img src="/src/assets/profile1.png" alt="Client" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <h3 className="text-white font-medium">Jane Smith</h3>
                          <div className="flex text-[#f67a45]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaRegStar />
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">3 weeks ago</span>
                    </div>
                    <p className="text-white/80">Great trainer who really listens to your goals and creates personalized workouts. I've seen significant improvements in my fitness level since starting with {trainer.name}.</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <img src="/src/assets/profile1.png" alt="Client" className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <h3 className="text-white font-medium">Mike Johnson</h3>
                          <div className="flex text-[#f67a45]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">1 week ago</span>
                    </div>
                    <p className="text-white/80">The meal plans and workout routines that {trainer.name} created for me have been perfect. I'm finally seeing the results I've been wanting for years!</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar - Other Trainers */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                <h3 className="text-white text-lg font-bold mb-4">Other Trainers</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <img src="/src/assets/trainer.png" alt="Other Trainer" className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <h4 className="text-white font-medium">Sarah Johnson</h4>
                      <p className="text-gray-400 text-sm">Yoga & Flexibility</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img src="/src/assets/trainer.png" alt="Other Trainer" className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <h4 className="text-white font-medium">Mike Williams</h4>
                      <p className="text-gray-400 text-sm">HIIT & Functional Training</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <img src="/src/assets/trainer.png" alt="Other Trainer" className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <h4 className="text-white font-medium">Emily Davis</h4>
                      <p className="text-gray-400 text-sm">Nutrition & Weight Loss</p>
                    </div>
                  </div>
                </div>
              </div>
              
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

export default TrainerProfile;

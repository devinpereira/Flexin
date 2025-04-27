import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
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

  const handleNavigation = (section) => {
    setActiveSection(section);
    if (section === 'Explore') {
      navigate('/explore');
    } else if (section === 'My Trainers') {
      navigate('/trainers');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#f67a45]" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarHalf key={i} className="text-[#f67a45]" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-[#f67a45]" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
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
        <div className="flex flex-col">
          {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
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

                <div className="mt-32 border-t border-white/20 pt-6">
                  <div className="flex items-center gap-3">
                    <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                    <span className="text-white">Account</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          
          {/* Main Content - Adjusted for all device sizes */}
          <div className="w-full md:ml-[275px] lg:ml-[300px]">
            <div className="py-4">
              {/* Back Button */}
              <button 
                onClick={() => navigate('/trainers')}
                className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
              >
                <MdArrowBack size={20} />
                <span>Back to Trainers</span>
              </button>

              {/* Profile Header Section */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mb-6">
                {/* Left side - Profile content */}
                <div className="lg:col-span-3">
                  <div className="mb-4 sm:mb-8 relative">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wider">
                      <span className="text-transparent bg-clip-text" style={{ 
                        WebkitTextStroke: '2px #f67a45',
                        textStroke: '2px #f67a45' 
                      }}>
                        {trainer.name}
                      </span>
                    </h1>
                    <h2 className="text-white text-lg sm:text-xl mt-2">{trainer.title}</h2>
                  </div>

                  <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8">
                    <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">About</h2>
                    <p className="text-white/80 leading-relaxed text-sm sm:text-base">
                      {trainer.description}
                    </p>
                    
                    <div className="flex gap-4 mt-6">
                      {trainer.socialMedia.facebook && (
                        <a 
                          href={trainer.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#f67a45] transition-colors"
                        >
                          <FaFacebook size={20} />
                        </a>
                      )}
                      
                      {trainer.socialMedia.instagram && (
                        <a 
                          href={trainer.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#f67a45] transition-colors"
                        >
                          <FaInstagram size={20} />
                        </a>
                      )}
                      
                      {trainer.socialMedia.tiktok && (
                        <a 
                          href={trainer.socialMedia.tiktok} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#f67a45] transition-colors"
                        >
                          <FaTiktok size={20} />
                        </a>
                      )}
                      
                      {trainer.socialMedia.twitter && (
                        <a 
                          href={trainer.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#f67a45] transition-colors"
                        >
                          <FaTwitter size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right side - Trainer info and actions - Stacked on mobile, side by side on desktop */}
                <div className="lg:col-span-1">
                  <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden mb-4">
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
                      
                      <div className="flex items-center mb-2">
                        {renderStars(trainer.rating)}
                        <span className="text-white ml-2">{trainer.rating} ({trainer.reviewCount})</span>
                      </div>
                      
                      <div className="text-white text-xl font-bold mb-4">{trainer.price}</div>

                      <div className="w-full space-y-3">
                        <button className="w-full bg-[#f67a45] text-white py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
                          Enroll Now
                        </button>
                        
                        <button className="w-full bg-transparent border border-[#f67a45] text-white py-2 sm:py-3 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Sections Container */}
              <div className="max-w-7xl mx-auto">
                {/* Certifications */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Certifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Certification Items - responsive grid */}
                    {/* Item 1 */}
                    <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                        <img 
                          src="/src/assets/certifications/cert1.png" 
                          alt="NASM Certified" 
                          className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/medal.png';
                          }}
                        />
                      </div>
                      <h3 className="text-white font-medium text-xs sm:text-sm">NASM Certified Personal Trainer</h3>
                    </div>
                    
                    {/* Item 2 */}
                    <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                        <img 
                          src="/src/assets/certifications/cert2.png" 
                          alt="ACE Certified" 
                          className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/medal1.png';
                          }}
                        />
                      </div>
                      <h3 className="text-white font-medium text-xs sm:text-sm">ACE Fitness Nutrition Specialist</h3>
                    </div>
                    
                    {/* Item 3 */}
                    <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                        <img 
                          src="/src/assets/certifications/cert3.png" 
                          alt="Best Trainer Award" 
                          className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/medal2.png';
                          }}
                        />
                      </div>
                      <h3 className="text-white font-medium text-xs sm:text-sm">Best Trainer Award 2024</h3>
                    </div>
                    
                    {/* Item 4 */}
                    <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center">
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                        <img 
                          src="/src/assets/certifications/cert4.png" 
                          alt="Strength Specialist" 
                          className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/medal3.png';
                          }}
                        />
                      </div>
                      <h3 className="text-white font-medium text-xs sm:text-sm">CSCS Strength & Conditioning Specialist</h3>
                    </div>
                  </div>
                </div>
                
                {/* Services */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Services - Responsive layout */}
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">Personalized Training</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Custom workout plans designed specifically for your goals, fitness level, and preferences.
                      </p>
                    </div>
                    
                    {/* More service items... */}
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">Progress Monitoring</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Regular assessments and adjustments to ensure you're continuously making progress toward your goals.
                      </p>
                    </div>
                    
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">Nutrition Guidance</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Expert advice on meal planning and nutritional strategies to complement your fitness routine.
                      </p>
                    </div>
                    
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">One-on-One Attention</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Dedicated personal sessions with focused attention on form, technique, and motivation.
                      </p>
                    </div>
                    
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">Virtual Training</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Remote coaching sessions accessible from anywhere, with real-time feedback and guidance.
                      </p>
                    </div>
                    
                    <div className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                      <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">24/7 Support</h3>
                      <p className="text-white/70 text-sm sm:text-base">
                      Ongoing communication and support to answer questions and provide motivation between sessions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photos Gallery */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Photos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {/* Gallery images - responsive grid */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <div key={num} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                        <img 
                          src={`/src/assets/gallery/trainer-photo${num}.jpg`}
                          alt={`Trainer photo ${num}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/src/assets/trainer.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Packages */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Training Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Silver Package */}
                    <div className="border border-gray-700 rounded-lg p-4 sm:p-6 bg-[#121225] hover:border-[#f67a45]/50 transition-all">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold">Silver Package</h3>
                        <span className="text-xs px-2 sm:px-3 py-1 bg-white/10 text-white rounded-full">Basic</span>
                      </div>
                      
                      <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$49.99<span className="text-sm text-white/60 font-normal">/month</span></div>
                      <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Perfect for beginners looking to start their fitness journey.</p>
                      
                      <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Weekly workout plan</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Basic nutrition advice</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Email support within 48 hours</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>1 video consultation per month</span>
                        </li>
                      </ul>
                      
                      <button className="w-full bg-white/10 text-white py-2 rounded-full hover:bg-[#f67a45]/20 transition-colors text-sm">
                        Get Started
                      </button>
                    </div>
                    
                    {/* Gold Package (Featured) */}
                    <div className="border-2 border-[#f67a45] rounded-lg p-4 sm:p-6 bg-[#1A1A2F] relative">
                      <div className="absolute top-0 right-4 sm:right-6 translate-y-[-50%] bg-[#f67a45] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Popular
                      </div>
                      
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold">Gold Package</h3>
                        <span className="text-xs px-2 sm:px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded-full">Recommended</span>
                      </div>
                      
                      <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$89.99<span className="text-sm text-white/60 font-normal">/month</span></div>
                      <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Our most popular option with personalized training.</p>
                      
                      <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Customized weekly workout plan</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Detailed nutrition plan</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Priority email support within 24 hours</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>2 video consultations per month</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Real-time workout adjustments</span>
                        </li>
                      </ul>
                      
                      <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm">
                        Get Started
                      </button>
                    </div>
                    
                    {/* Ultimate Package */}
                    <div className="border border-gray-700 rounded-lg p-4 sm:p-6 bg-[#121225] hover:border-[#f67a45]/50 transition-all">
                      <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold">Ultimate Package</h3>
                        <span className="text-xs px-2 sm:px-3 py-1 bg-white/10 text-white rounded-full">Premium</span>
                      </div>
                      
                      <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">$149.99<span className="text-sm text-white/60 font-normal">/month</span></div>
                      <p className="text-white/60 mb-4 sm:mb-6 text-xs sm:text-sm">Complete fitness solution with maximum personal attention.</p>
                      
                      <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Fully personalized workout program</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Customized meal plans with recipes</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>24/7 chat support</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Weekly video consultations</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Progress tracking and analysis</span>
                        </li>
                        <li className="flex items-start text-white">
                          <span className="text-[#f67a45] mr-2 flex-shrink-0">✓</span>
                          <span>Access to exclusive workshops</span>
                        </li>
                      </ul>
                      
                      <button className="w-full bg-white/10 text-white py-2 rounded-full hover:bg-[#f67a45]/20 transition-colors text-sm">
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Feedback */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <h2 className="text-white text-xl sm:text-2xl font-bold">Customer Feedback</h2>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="w-full sm:w-auto">
                        <select className="w-full bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45]">
                          <option value="newest">Newest First</option>
                          <option value="highest">Highest Rating</option>
                          <option value="lowest">Lowest Rating</option>
                        </select>
                      </div>
                      
                      <button className="w-full sm:w-auto bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm">
                        Write Review
                      </button>
                    </div>
                  </div>
                  
                  {/* Overall Rating Summary - Stacked on mobile */}
                  <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row items-center">
                    <div className="text-center md:text-left md:mr-10 mb-4 md:mb-0">
                      <div className="text-[#f67a45] text-4xl sm:text-5xl font-bold mb-2">4.8</div>
                      <div className="flex justify-center md:justify-start mb-2">
                        <div className="flex">
                          <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                          <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                          <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                          <FaStar className="text-[#f67a45] text-sm sm:text-base" />
                          <BsStarHalf className="text-[#f67a45] text-sm sm:text-base" />
                        </div>
                      </div>
                      <div className="text-white/60 text-xs sm:text-sm">Based on 28 reviews</div>
                    </div>
                    
                    {/* Rating Distribution */}
                    <div className="w-full md:flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center mb-2">
                          <div className="text-white mr-2 w-2 text-sm">{rating}</div>
                          <div className="flex-1 bg-white/10 rounded-full h-2 sm:h-3 mr-2">
                            <div 
                              className="bg-[#f67a45] h-2 sm:h-3 rounded-full" 
                              style={{ 
                                width: rating === 5 ? '75%' : 
                                       rating === 4 ? '20%' : 
                                       rating === 3 ? '5%' : '0%' 
                              }}
                            ></div>
                          </div>
                          <div className="text-white/60 text-xs sm:text-sm w-8">
                            {rating === 5 ? '75%' : 
                             rating === 4 ? '20%' : 
                             rating === 3 ? '5%' : '0%'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {/* Reviews - Responsive layout */}
                    {[
                      {
                        name: "Alex Johnson",
                        image: "/src/assets/users/user1.jpg",
                        date: "March 1, 2025",
                        rating: 5,
                        review: "I've been training with John for 3 months and the results have been incredible. His knowledge and personalized approach make every session valuable. He knows exactly when to push me harder and when to focus on form and technique."
                      },
                      {
                        name: "Sarah Miller",
                        image: "/src/assets/users/user2.jpg",
                        date: "February 15, 2025",
                        rating: 5,
                        review: "John has helped me achieve my fitness goals faster than I expected. His meal plans are practical and easy to follow, and his workouts are challenging but achievable. I highly recommend him, especially if you've tried other trainers without success."
                      },
                      {
                        name: "Michael Chen",
                        image: "/src/assets/users/user3.jpg",
                        date: "January 28, 2025",
                        rating: 4,
                        review: "Great trainer with a solid understanding of fitness principles. John is always on time and prepared for our sessions. The only reason I'm giving 4 stars is that sometimes the communication between sessions could be better, but the training itself is excellent."
                      }
                    ].map((review, idx) => (
                      <div key={idx} className="border-b border-gray-700 pb-4 sm:pb-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={review.image}
                                alt={review.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/src/assets/profile1.png';
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm sm:text-base">{review.name}</h4>
                              <div className="flex items-center">
                                <div className="flex">
                                  {Array(5).fill(0).map((_, i) => (
                                    i < review.rating ? 
                                      <FaStar key={i} className="text-[#f67a45] text-xs sm:text-sm" /> :
                                      <FaRegStar key={i} className="text-[#f67a45] text-xs sm:text-sm" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-white/50 text-xs sm:text-sm">{review.date}</div>
                        </div>
                        <p className="text-white/80 text-sm sm:text-base">
                          {review.review}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <div className="mt-6 sm:mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                        &lt;
                      </button>
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f67a45] text-white flex items-center justify-center text-sm">
                        1
                      </button>
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                        2
                      </button>
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                        3
                      </button>
                      <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1A1A2F] text-white flex items-center justify-center hover:bg-[#f67a45]/20 text-sm">
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>

                {/* Suitable For */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Suitable For</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Client type cards - 2 columns on mobile, 4 on desktop */}
                    {[
                      {
                        title: "Beginners",
                        desc: "New to fitness with focus on fundamentals",
                        icon: path => (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                          </svg>
                        ),
                        pathData: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      },
                      {
                        title: "Weight Loss",
                        desc: "Focused on fat loss and body transformation",
                        icon: path => (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                          </svg>
                        ),
                        pathData: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      },
                      {
                        title: "Strength Gain",
                        desc: "Building muscle and improving strength",
                        icon: path => (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                          </svg>
                        ),
                        pathData: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      },
                      {
                        title: "Athletes",
                        desc: "Sport-specific training for performance",
                        icon: path => (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                          </svg>
                        ),
                        pathData: "M13 10V3L4 14h7v7l9-11h-7z"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#1A1A2F] rounded-lg p-3 sm:p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#f67a45]/20 flex items-center justify-center mb-2 sm:mb-3">
                          {item.icon(item.pathData)}
                        </div>
                        <h3 className="text-white font-medium mb-0.5 sm:mb-1 text-sm sm:text-base">{item.title}</h3>
                        <p className="text-white/60 text-xs sm:text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8" id="contact-form">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Get in Touch</h2>
                  <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-white mb-1 sm:mb-2 text-sm">Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent" 
                            placeholder="Your name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-white mb-1 sm:mb-2 text-sm">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent" 
                            placeholder="Your email address"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-white mb-1 sm:mb-2 text-sm">Subject</label>
                        <select 
                          id="subject" 
                          className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent"
                        >
                          <option value="">Select a subject</option>
                          <option value="training">Training Inquiry</option>
                          <option value="pricing">Pricing Information</option>
                          <option value="availability">Availability Check</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-white mb-1 sm:mb-2 text-sm">Message</label>
                        <textarea 
                          id="message" 
                          rows="4" 
                          className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent" 
                          placeholder="How can I help you?"
                        ></textarea>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="consent" 
                          className="w-4 h-4 text-[#f67a45] border-gray-700 rounded focus:ring-[#f67a45]" 
                        />
                        <label htmlFor="consent" className="ml-2 text-xs sm:text-sm text-white/70">
                          I consent to having this website store my submitted information so they can respond to my inquiry.
                        </label>
                      </div>
                      
                      <div>
                        <button type="submit" className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {/* FAQ Items - Responsive */}
                    {[
                      {
                        question: "How do I get started with training?",
                        answer: "Getting started is easy! Simply select a package that fits your needs and click the \"Enroll Now\" button. After enrollment, we'll schedule an initial consultation to discuss your goals, assess your current fitness level, and create a personalized training plan."
                      },
                      {
                        question: "What equipment do I need?",
                        answer: "Equipment needs vary based on your goals and training environment. For home workouts, I can design programs with minimal equipment or bodyweight exercises. If you have access to a gym, we can utilize their equipment. During our initial consultation, we'll discuss what's available to you and adapt accordingly."
                      },
                      {
                        question: "How often will we train together?",
                        answer: "Training frequency depends on your package, goals, and availability. Silver package includes weekly workout plans with monthly check-ins, Gold includes bi-weekly video consultations, and Ultimate includes weekly sessions. All packages can be customized to your specific needs and schedule."
                      },
                      {
                        question: "Can I cancel my subscription?",
                        answer: "Yes, you can cancel your subscription at any time. When you cancel, you'll continue to have access until the end of your current billing period. There are no long-term contracts or cancellation fees. Your satisfaction is our priority."
                      },
                      {
                        question: "Do you offer nutrition plans?",
                        answer: "Yes, nutrition guidance is included in all packages, with the level of detail varying by package. Silver includes basic nutrition advice, Gold includes detailed nutrition plans, and Ultimate includes customized meal plans with recipes. I believe nutrition is a critical component of any fitness journey."
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                        <button 
                          className="w-full bg-[#1A1A2F] p-3 sm:p-4 flex items-center justify-between text-left"
                          onClick={(e) => {
                            const content = e.currentTarget.nextElementSibling;
                            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
                          }}
                        >
                          <span className="text-white font-medium text-sm sm:text-base">{item.question}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out bg-[#121225]">
                          <div className="p-3 sm:p-4 text-white/80 text-sm">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-[#1A1A2F] rounded-lg p-4 sm:p-8 my-4 sm:my-8 text-center">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Ready to Transform Your Fitness Journey?</h2>
                  <p className="text-white/70 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                    Join my community of successful clients and let's work together to achieve your fitness goals.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-sm sm:text-base">
                      Enroll Now
                    </button>
                    <button 
                      onClick={() => {
                        // Scroll to contact form
                        document.getElementById('contact-form').scrollIntoView({
                          behavior: 'smooth'
                        });
                      }}
                      className="bg-transparent border border-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#f67a45]/10 transition-colors text-sm sm:text-base"
                    >
                      Contact Me
                    </button>
                  </div>
                </div>
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

export default TrainerProfile;
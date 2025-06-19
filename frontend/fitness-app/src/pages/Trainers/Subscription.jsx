import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaStar, FaRegStar, FaCheckCircle, FaBars } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { BsCalendarWeek, BsStarHalf } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const Subscription = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [selectedPackage, setSelectedPackage] = useState('silver'); // Default to currently subscribed package
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, userName: 'Alex Johnson', rating: 4.5, text: 'Great trainer! Very knowledgeable and motivating.', date: '2025-03-01' },
    { id: 2, userName: 'Sarah Miller', rating: 5, text: 'John has helped me achieve my fitness goals faster than I expected. Highly recommended!', date: '2025-02-15' }
  ]);

  // Trainer data state (now with useState to allow updates)
  const [trainer, setTrainer] = useState({
    id: trainerId,
    name: "John Smith",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning",
    rating: 4.8,
    reviewCount: 28,
    currentSubscription: "silver"
  });

  // Mock subscription packages
  const subscriptionPackages = {
    silver: {
      name: "Silver Package",
      price: "$49.99/month",
      benefits: [
        "Weekly workout plan",
        "Basic nutrition advice",
        "Email support within 48 hours",
        "1 video consultation per month"
      ]
    },
    gold: {
      name: "Gold Package",
      price: "$89.99/month",
      benefits: [
        "Customized weekly workout plan",
        "Detailed nutrition plan",
        "Priority email support within 24 hours",
        "2 video consultations per month",
        "Real-time workout adjustments"
      ]
    },
    ultimate: {
      name: "Ultimate Package",
      price: "$149.99/month",
      benefits: [
        "Fully personalized workout program",
        "Customized meal plans with recipes",
        "24/7 chat support",
        "Weekly video consultations",
        "Progress tracking and analysis",
        "Access to exclusive workshops",
        "Workout videos library"
      ]
    }
  };

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

  // Handle package change
  const handlePackageChange = (packageName) => {
    setSelectedPackage(packageName);
  };

  // Handle subscription confirmation
  const handleConfirmSubscription = () => {
    // In a real app, this would interact with a payment API
    setSuccessMessage(`You've successfully subscribed to the ${subscriptionPackages[selectedPackage].name}!`);
    setShowSuccessModal(true);

    // Update trainer data
    setTrainer(prev => ({
      ...prev,
      currentSubscription: selectedPackage
    }));
  };

  // Handle subscription cancellation
  const handleCancelSubscription = () => {
    // In a real app, this would make an API call to cancel the subscription
    setSuccessMessage('Your subscription has been cancelled successfully.');
    setShowCancelModal(false);
    setShowSuccessModal(true);

    // Update trainer data
    setTrainer(prev => ({
      ...prev,
      currentSubscription: null
    }));
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (rating === 0 || !reviewText.trim()) return;

    const newReview = {
      id: reviews.length + 1,
      userName: 'You', // In a real app, this would be the logged-in user's name
      rating: rating,
      text: reviewText,
      date: new Date().toISOString().substring(0, 10)
    };

    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setSuccessMessage('Your review has been submitted successfully!');
    setShowSuccessModal(true);
    setRating(0);
    setReviewText('');

    // Update trainer rating
    const totalRatings = trainer.reviewCount + 1;
    const newRating = ((trainer.rating * trainer.reviewCount) + rating) / totalRatings;

    setTrainer(prev => ({
      ...prev,
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: totalRatings
    }));
  };

  // Render star rating
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

  // Reset selected package when trainer subscription changes
  useEffect(() => {
    if (trainer.currentSubscription) {
      setSelectedPackage(trainer.currentSubscription);
    }
  }, [trainer.currentSubscription]);

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
                navigate('/trainers');
                setIsMobileMenuOpen(false);
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
                navigate('/explore');
                setIsMobileMenuOpen(false);
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
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'My Trainers'
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

              {/* Explore */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${activeSection === 'Explore'
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

        {/* Main Content with responsive margins */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <button
            onClick={() => navigate(`/schedule/${trainerId}`)}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Schedule</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Left side - Subscription content - Full width on mobile, 3/4 on desktop */}
            <div className="lg:col-span-3">
              {/* Current Subscription */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Current Subscription</h2>

                {trainer.currentSubscription ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                      <h3 className="text-white text-lg sm:text-xl font-bold">{subscriptionPackages[trainer.currentSubscription].name}</h3>
                      <span className="text-[#f67a45] font-bold text-base sm:text-lg">{subscriptionPackages[trainer.currentSubscription].price}</span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Benefits:</h4>
                      <ul className="space-y-2">
                        {subscriptionPackages[trainer.currentSubscription].benefits.map((benefit, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start text-white text-sm sm:text-base"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <FaCheckCircle className="text-[#f67a45] mr-3 mt-1 flex-shrink-0" />
                            <span>{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="text-red-400 hover:text-red-300 font-medium text-sm sm:text-base"
                    >
                      Cancel Subscription
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#1A1A2F] rounded-lg p-4 sm:p-6 text-center"
                  >
                    <p className="text-white mb-2 sm:mb-4 text-sm sm:text-base">You don't have an active subscription with this trainer.</p>
                    <p className="text-white/70 mb-2 sm:mb-4 text-sm sm:text-base">Choose one of the packages below to get started.</p>
                  </motion.div>
                )}
              </div>

              {/* Available Packages */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Available Packages</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
                  {/* Silver Package */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`border rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${selectedPackage === 'silver'
                        ? 'border-[#f67a45] bg-[#1A1A2F]'
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                      }`}
                    onClick={() => handlePackageChange('silver')}
                  >
                    <h3 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">Silver Package</h3>
                    <p className="text-[#f67a45] font-bold mb-3 sm:mb-4 text-sm sm:text-base">$49.99/month</p>
                    <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      {subscriptionPackages.silver.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-xs sm:text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'silver' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-1 sm:py-2 text-center rounded-full text-xs sm:text-sm">
                        {trainer.currentSubscription === 'silver' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </motion.div>

                  {/* Gold Package */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`border rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${selectedPackage === 'gold'
                        ? 'border-[#f67a45] bg-[#1A1A2F]'
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                      }`}
                    onClick={() => handlePackageChange('gold')}
                  >
                    <h3 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">Gold Package</h3>
                    <p className="text-[#f67a45] font-bold mb-3 sm:mb-4 text-sm sm:text-base">$89.99/month</p>
                    <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      {subscriptionPackages.gold.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-xs sm:text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'gold' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-1 sm:py-2 text-center rounded-full text-xs sm:text-sm">
                        {trainer.currentSubscription === 'gold' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </motion.div>

                  {/* Ultimate Package */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`border rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${selectedPackage === 'ultimate'
                        ? 'border-[#f67a45] bg-[#1A1A2F]'
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                      } ${selectedPackage !== 'ultimate' ? 'relative overflow-hidden' : ''
                      }`}
                    onClick={() => handlePackageChange('ultimate')}
                  >
                    {selectedPackage !== 'ultimate' && (
                      <div className="absolute -right-10 top-4 bg-[#f67a45] text-white text-xs px-10 py-1 rotate-45">
                        Best Value
                      </div>
                    )}
                    <h3 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">Ultimate Package</h3>
                    <p className="text-[#f67a45] font-bold mb-3 sm:mb-4 text-sm sm:text-base">$149.99/month</p>
                    <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                      {subscriptionPackages.ultimate.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-xs sm:text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'ultimate' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-1 sm:py-2 text-center rounded-full text-xs sm:text-sm">
                        {trainer.currentSubscription === 'ultimate' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmSubscription}
                    disabled={trainer.currentSubscription === selectedPackage}
                    className={`bg-[#f67a45] text-white px-6 sm:px-10 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base ${trainer.currentSubscription === selectedPackage
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#e56d3d]'
                      }`}
                  >
                    {trainer.currentSubscription === selectedPackage
                      ? 'Current Subscription'
                      : trainer.currentSubscription
                        ? 'Change Subscription'
                        : 'Subscribe Now'}
                  </motion.button>
                </div>
              </div>

              {/* Reviews and Ratings */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                  <h2 className="text-white text-xl sm:text-2xl font-bold">Reviews & Ratings</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors w-full sm:w-auto text-sm sm:text-base"
                  >
                    Write a Review
                  </motion.button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-[#1A1A2F] p-4 rounded-lg">
                  <div className="text-[#f67a45] text-3xl sm:text-4xl font-bold text-center sm:text-left">{trainer.rating}</div>
                  <div>
                    <div className="flex justify-center sm:justify-start mb-1">
                      {renderStars(trainer.rating)}
                    </div>
                    <div className="text-white/70 text-sm sm:text-base text-center sm:text-left">Based on {trainer.reviewCount} reviews</div>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4 sm:space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      className="border-b border-gray-700 pb-4 sm:pb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                        <h3 className="text-white font-medium text-sm sm:text-base">{review.userName}</h3>
                        <span className="text-white/50 text-xs sm:text-sm">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-white/80 text-sm sm:text-base">{review.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Trainer info and actions - Stacked on mobile */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4 border-2 border-[#f67a45]/30">
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

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
                  <button
                    onClick={() => navigate(`/schedule/${trainerId}`)}
                    className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <BsCalendarWeek size={14} sm:size={16} />
                    <span>Schedule</span>
                  </button>

                  <button
                    onClick={() => navigate(`/meal-plan/${trainerId}`)}
                    className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <GiMeal size={14} sm:size={16} />
                    <span>Meal Plan</span>
                  </button>

                  <button
                    onClick={() => navigate(`/chat/${trainerId}`)}
                    className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <BiChat size={14} sm:size={16} />
                    <span>Chat</span>
                  </button>

                  <button className="bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm">
                    <RiVipDiamondLine size={14} sm:size={16} />
                    <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal - Responsive */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 max-w-md w-full"
          >
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Cancel Subscription</h3>
            <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to cancel your subscription to {subscriptionPackages[trainer.currentSubscription].name}? You will lose access to all premium features at the end of your current billing period.</p>

            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3 sm:px-6 py-1.5 sm:py-2 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35] text-sm sm:text-base"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-3 sm:px-6 py-1.5 sm:py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 text-sm sm:text-base"
              >
                Cancel Subscription
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Modal - Responsive */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 max-w-md w-full"
          >
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">Write a Review</h3>

            <div className="mb-3 sm:mb-4">
              <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-xl sm:text-2xl"
                  >
                    {star <= rating ? <FaStar className="text-[#f67a45]" /> : <FaRegStar className="text-[#f67a45]" />}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-white mb-1 sm:mb-2 text-sm sm:text-base">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border border-white/30 rounded-lg text-white h-24 sm:h-32 focus:outline-none focus:ring-2 focus:ring-[#f67a45] text-sm sm:text-base"
                placeholder="Share your experience with this trainer..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-3 sm:px-6 py-1.5 sm:py-2 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35] text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-3 sm:px-6 py-1.5 sm:py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d] text-sm sm:text-base"
                disabled={rating === 0 || !reviewText.trim()}
              >
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal - Responsive */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 max-w-md w-full"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-3 sm:mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <MdCheckCircle className="text-[#f67a45] text-3xl sm:text-4xl" />
              </motion.div>

              <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2">Success!</h3>
              <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">{successMessage}</p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 sm:px-8 py-1.5 sm:py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors text-sm sm:text-base"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
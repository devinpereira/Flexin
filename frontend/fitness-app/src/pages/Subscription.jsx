import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaStar, FaRegStar, FaCheckCircle } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { BsCalendarWeek, BsStarHalf } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

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
          <button 
            onClick={() => navigate(`/schedule/${trainerId}`)}
            className="mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Schedule</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left side - Subscription content */}
            <div className="lg:col-span-3">
              {/* Current Subscription */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
                <h2 className="text-white text-2xl font-bold mb-6">Your Current Subscription</h2>
                
                {trainer.currentSubscription ? (
                  <div className="bg-[#1A1A2F] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white text-xl font-bold">{subscriptionPackages[trainer.currentSubscription].name}</h3>
                      <span className="text-[#f67a45] font-bold">{subscriptionPackages[trainer.currentSubscription].price}</span>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-white font-medium mb-2">Benefits:</h4>
                      <ul className="space-y-2">
                        {subscriptionPackages[trainer.currentSubscription].benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-white">
                            <FaCheckCircle className="text-[#f67a45] mr-3" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="text-red-400 hover:text-red-300 font-medium"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#1A1A2F] rounded-lg p-6 text-center">
                    <p className="text-white mb-4">You don't have an active subscription with this trainer.</p>
                    <p className="text-white/70 mb-4">Choose one of the packages below to get started.</p>
                  </div>
                )}
              </div>
              
              {/* Available Packages */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
                <h2 className="text-white text-2xl font-bold mb-6">Available Packages</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Silver Package */}
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPackage === 'silver' 
                        ? 'border-[#f67a45] bg-[#1A1A2F]' 
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                    }`}
                    onClick={() => handlePackageChange('silver')}
                  >
                    <h3 className="text-white text-lg font-bold mb-2">Silver Package</h3>
                    <p className="text-[#f67a45] font-bold mb-4">$49.99/month</p>
                    <ul className="space-y-2 mb-4">
                      {subscriptionPackages.silver.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-1 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'silver' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 text-center rounded-full text-sm">
                        {trainer.currentSubscription === 'silver' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </div>
                  
                  {/* Gold Package */}
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPackage === 'gold' 
                        ? 'border-[#f67a45] bg-[#1A1A2F]' 
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                    }`}
                    onClick={() => handlePackageChange('gold')}
                  >
                    <h3 className="text-white text-lg font-bold mb-2">Gold Package</h3>
                    <p className="text-[#f67a45] font-bold mb-4">$89.99/month</p>
                    <ul className="space-y-2 mb-4">
                      {subscriptionPackages.gold.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-1 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'gold' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 text-center rounded-full text-sm">
                        {trainer.currentSubscription === 'gold' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </div>
                  
                  {/* Ultimate Package */}
                  <div 
                    className={`border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedPackage === 'ultimate' 
                        ? 'border-[#f67a45] bg-[#1A1A2F]' 
                        : 'border-gray-700 bg-[#121225] hover:border-[#f67a45]/50'
                    }`}
                    onClick={() => handlePackageChange('ultimate')}
                  >
                    <h3 className="text-white text-lg font-bold mb-2">Ultimate Package</h3>
                    <p className="text-[#f67a45] font-bold mb-4">$149.99/month</p>
                    <ul className="space-y-2 mb-4">
                      {subscriptionPackages.ultimate.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-white text-sm">
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-1 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedPackage === 'ultimate' && (
                      <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-2 text-center rounded-full text-sm">
                        {trainer.currentSubscription === 'ultimate' ? 'Current Plan' : 'Selected'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleConfirmSubscription}
                    disabled={trainer.currentSubscription === selectedPackage}
                    className={`bg-[#f67a45] text-white px-10 py-3 rounded-full transition-colors font-medium ${
                      trainer.currentSubscription === selectedPackage
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#e56d3d]'
                    }`}
                  >
                    {trainer.currentSubscription === selectedPackage
                      ? 'Current Subscription'
                      : trainer.currentSubscription
                        ? 'Change Subscription'
                        : 'Subscribe Now'}
                  </button>
                </div>
              </div>
              
              {/* Reviews and Ratings */}
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-2xl font-bold">Reviews & Ratings</h2>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                  >
                    Write a Review
                  </button>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="text-[#f67a45] text-4xl font-bold mr-4">{trainer.rating}</div>
                  <div>
                    <div className="flex mb-1">
                      {renderStars(trainer.rating)}
                    </div>
                    <div className="text-white/70">Based on {trainer.reviewCount} reviews</div>
                  </div>
                </div>
                
                {/* Review List */}
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-700 pb-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-white font-medium">{review.userName}</h3>
                        <span className="text-white/50 text-sm">{review.date}</span>
                      </div>
                      <div className="flex mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-white/80">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Trainer info and actions */}
            <div className="lg:col-span-1">
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
                  <button 
                    onClick={() => navigate(`/schedule/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
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
                  
                  <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2">
                    <RiVipDiamondLine />
                    <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">Cancel Subscription</h3>
            <p className="text-white/80 mb-6">Are you sure you want to cancel your subscription to {subscriptionPackages[trainer.currentSubscription].name}? You will lose access to all premium features at the end of your current billing period.</p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35]"
              >
                Keep Subscription
              </button>
              <button 
                onClick={handleCancelSubscription}
                className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="text-2xl"
                  >
                    {star <= rating ? <FaStar className="text-[#f67a45]" /> : <FaRegStar className="text-[#f67a45]" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-2">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg text-white h-32 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                placeholder="Share your experience with this trainer..."
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-[#1e1e35]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                className="px-6 py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d]"
                disabled={rating === 0 || !reviewText.trim()}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal - replaces alerts */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f67a45]/20 p-4 rounded-full mb-4">
                <MdCheckCircle className="text-[#f67a45] text-4xl" />
              </div>
              
              <h3 className="text-white text-xl font-bold mb-2">Success!</h3>
              <p className="text-white/80 mb-6">{successMessage}</p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
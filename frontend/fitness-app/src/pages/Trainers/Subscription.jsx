import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { BsCalendarWeek, BsStarHalf } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { BiChat } from "react-icons/bi";
import { RiVipDiamondLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { getTrainerById } from "../../api/trainer";
import {
  getSubscription,
  subscribeToPackage,
  cancelSubscription,
} from "../../api/subscription";

const Subscription = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();

  // State for real data
  const [trainer, setTrainer] = useState(null);
  const [subscriptionPackages, setSubscriptionPackages] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Fetch trainer and subscription info
  useEffect(() => {
    async function fetchData() {
      try {
        // Get trainer info (including packages)
        const trainerData = await getTrainerById(trainerId);
        setTrainer(trainerData);

        // Convert packages array to object for easy access (like your old mock)
        const packagesObj = {};
        if (Array.isArray(trainerData.packages)) {
          trainerData.packages.forEach((pkg) => {
            packagesObj[pkg.name.toLowerCase()] = {
              name: pkg.name + " Package",
              price: `$${pkg.price}/month`,
              benefits: pkg.features,
            };
          });
        }
        setSubscriptionPackages(packagesObj);

        // Get current subscription
        const subData = await getSubscription(trainerId);
        setCurrentSubscription(
          subData.currentSubscription
            ? subData.currentSubscription.toLowerCase()
            : null
        );

        // Set selected package to current or default to first available
        setSelectedPackage(
          subData.currentSubscription
            ? subData.currentSubscription.toLowerCase()
            : trainerData.packages[0]?.name.toLowerCase() || null
        );

        // Optionally, set reviews if you fetch them from backend
        // setReviews(trainerData.reviews || []);
      } catch (err) {
        setSuccessMessage("Failed to load trainer or subscription details.");
        setShowSuccessModal(true);
      }
    }
    fetchData();
  }, [trainerId]);

  // Handle package change
  const handlePackageChange = (packageName) => {
    setSelectedPackage(packageName);
  };

  // Handle subscription confirmation
  const handleConfirmSubscription = async () => {
    try {
      await subscribeToPackage(trainerId, selectedPackage);
      setCurrentSubscription(selectedPackage);
      setSuccessMessage(
        `You've successfully subscribed to the ${subscriptionPackages[selectedPackage].name}!`
      );
      setShowSuccessModal(true);
    } catch {
      setSuccessMessage("Failed to subscribe. Please try again.");
      setShowSuccessModal(true);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription(trainerId);
      setCurrentSubscription(null);
      setSuccessMessage("Your subscription has been cancelled successfully.");
      setShowCancelModal(false);
      setShowSuccessModal(true);
    } catch {
      setSuccessMessage("Failed to cancel subscription. Please try again.");
      setShowCancelModal(false);
      setShowSuccessModal(true);
    }
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (rating === 0 || !reviewText.trim()) return;

    const newReview = {
      id: reviews.length + 1,
      userName: "You", // In a real app, this would be the logged-in user's name
      rating: rating,
      text: reviewText,
      date: new Date().toISOString().substring(0, 10),
    };

    setReviews([newReview, ...reviews]);
    setShowReviewModal(false);
    setSuccessMessage("Your review has been submitted successfully!");
    setShowSuccessModal(true);
    setRating(0);
    setReviewText("");

    // Update trainer rating
    const totalRatings = trainer.reviewCount + 1;
    const newRating =
      (trainer.rating * trainer.reviewCount + rating) / totalRatings;

    setTrainer((prev) => ({
      ...prev,
      rating: parseFloat(newRating.toFixed(1)),
      reviewCount: totalRatings,
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

  // Reset selected package when current subscription changes
  useEffect(() => {
    if (currentSubscription) {
      setSelectedPackage(currentSubscription);
    }
  }, [currentSubscription]);

  if (!trainer) {
    return (
      <TrainerLayout pageTitle="Subscription">
        <div className="text-white p-8">Loading...</div>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout pageTitle={`${trainer.name}'s Subscription`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Left side - Subscription content - Full width on mobile, 3/4 on desktop */}
        <div className="lg:col-span-3">
          {/* Current Subscription */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Your Current Subscription
            </h2>

            {currentSubscription ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                  <h3 className="text-white text-lg sm:text-xl font-bold">
                    {subscriptionPackages[currentSubscription]?.name}
                  </h3>
                  <span className="text-[#f67a45] font-bold text-base sm:text-lg">
                    {subscriptionPackages[currentSubscription]?.price}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Benefits:</h4>
                  <ul className="space-y-2">
                    {subscriptionPackages[currentSubscription]?.benefits.map(
                      (benefit, index) => (
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
                      )
                    )}
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
                <p className="text-white mb-2 sm:mb-4 text-sm sm:text-base">
                  You don't have an active subscription with this trainer.
                </p>
                <p className="text-white/70 mb-2 sm:mb-4 text-sm sm:text-base">
                  Choose one of the packages below to get started.
                </p>
              </motion.div>
            )}
          </div>

          {/* Available Packages */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Available Packages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              {Object.keys(subscriptionPackages).map((key) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`border rounded-lg p-4 sm:p-6 cursor-pointer transition-all ${
                    selectedPackage === key
                      ? "border-[#f67a45] bg-[#1A1A2F]"
                      : "border-gray-700 bg-[#121225] hover:border-[#f67a45]/50"
                  }`}
                  onClick={() => handlePackageChange(key)}
                >
                  <h3 className="text-white text-base sm:text-lg font-bold mb-1 sm:mb-2">
                    {subscriptionPackages[key].name}
                  </h3>
                  <p className="text-[#f67a45] font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                    {subscriptionPackages[key].price}
                  </p>
                  <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    {subscriptionPackages[key].benefits.map(
                      (benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-white text-xs sm:text-sm"
                        >
                          <FaCheckCircle className="text-[#f67a45] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                  {selectedPackage === key && (
                    <div className="w-full bg-[#f67a45]/20 text-[#f67a45] py-1 sm:py-2 text-center rounded-full text-xs sm:text-sm">
                      {currentSubscription === key
                        ? "Current Plan"
                        : "Selected"}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 flex justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirmSubscription}
                disabled={currentSubscription === selectedPackage}
                className={`bg-[#f67a45] text-white px-6 sm:px-10 py-2 sm:py-3 rounded-full transition-colors font-medium text-sm sm:text-base ${
                  currentSubscription === selectedPackage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#e56d3d]"
                }`}
              >
                {currentSubscription === selectedPackage
                  ? "Current Subscription"
                  : currentSubscription
                  ? "Change Subscription"
                  : "Subscribe Now"}
              </motion.button>
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
                    e.target.src = "/src/assets/profile1.png";
                  }}
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl font-medium">
                {trainer.name}
              </h3>
              <p className="text-gray-400 mb-2 text-sm sm:text-base">
                {trainer.specialty}
              </p>
              <a
                onClick={() => navigate(`/trainers/${trainerId}`)}
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
                <BsCalendarWeek size={14} />
                <span>Schedule</span>
              </button>

              <button
                onClick={() => navigate(`/meal-plan/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <GiMeal size={14} />
                <span>Meal Plan</span>
              </button>

              <button
                onClick={() => navigate(`/chat/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BiChat size={14} />
                <span>Chat</span>
              </button>

              <button className="bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm">
                <RiVipDiamondLine size={14} />
                <span>Subscription</span>
              </button>
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
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Cancel Subscription
            </h3>
            <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to cancel your subscription to{" "}
              {subscriptionPackages[currentSubscription]?.name}? You will lose
              access to all premium features at the end of your current billing
              period.
            </p>

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

              <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                Success!
              </h3>
              <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                {successMessage}
              </p>

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
    </TrainerLayout>
  );
};

export default Subscription;

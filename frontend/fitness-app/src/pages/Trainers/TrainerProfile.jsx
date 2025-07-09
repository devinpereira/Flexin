import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import {
  FaStar,
  FaRegStar,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaPlus,
} from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { BsCalendarWeek, BsStarHalf } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { BiChat } from "react-icons/bi";
import { RiVipDiamondLine } from "react-icons/ri";
import {
  getTrainerById,
  addTrainerFeedback,
  addTrainerFollower,
  getMyTrainers,
} from "../../api/trainer";
import { motion } from "framer-motion";

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isTrainerAdded, setIsTrainerAdded] = useState(false);

  const fromExplore = location.state?.fromExplore;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchTrainer() {
      try {
        setLoading(true);
        const data = await getTrainerById(trainerId);
        setTrainer(data);

        const myTrainers = await getMyTrainers();
        const isAdded = myTrainers.some((t) => t._id === trainerId);
        setIsTrainerAdded(isAdded);
      } catch (err) {
        setError("Failed to load trainer");
      } finally {
        setLoading(false);
      }
    }
    fetchTrainer();
  }, [trainerId]);

  const renderStars = (rating = 0) => {
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmitting(true);
    try {
      await addTrainerFeedback(trainerId, {
        comment: feedbackText,
        rating: feedbackRating,
      });
      setFeedbackText("");
      setFeedbackRating(5);
      setShowFeedbackForm(false);
      // Refresh trainer data to show new feedback
      const updated = await getTrainerById(trainerId);
      setTrainer(updated);
    } catch {
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTrainer = async () => {
    try {
      await addTrainerFollower(trainerId);
      setIsTrainerAdded(true);
    } catch (err) {
      console.error("Failed to add trainer:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!trainer) return <div>No trainer found.</div>;

  // Fallbacks for missing fields
  const social = trainer.socialMedia || {};
  const rating = trainer.rating || 0;
  const reviewCount =
    trainer.reviewCount || (trainer.feedbacks ? trainer.feedbacks.length : 0);
  const price =
    trainer.packages && trainer.packages[0]
      ? `$${trainer.packages[0].price}`
      : "N/A";
  const certificates = trainer.certificates || [];
  const services = trainer.services || [];
  const photos = trainer.photos || [];
  const feedbacks = trainer.feedbacks || [];

  return (
    <TrainerLayout pageTitle={`Trainer: ${trainer.name}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/explore")} 
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
              <span
                className="text-transparent bg-clip-text"
                style={{
                  WebkitTextStroke: "2px #f67a45",
                  textStroke: "2px #f67a45",
                }}
              >
                {trainer.name}
              </span>
            </h1>
            <h2 className="text-white text-lg sm:text-xl mt-2">
              {trainer.bio}
            </h2>
          </div>

          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">
              About
            </h2>
            <p className="text-white/80 leading-relaxed text-sm sm:text-base">
              {trainer.bio}
            </p>

            <div className="flex gap-4 mt-6">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaFacebook size={20} />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
              )}
              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f67a45] transition-colors"
                >
                  <FaTiktok size={20} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
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

        {/* Right side - Trainer info and actions */}
        <div className="lg:col-span-1">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={trainer.profilePhoto}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/profile1.png";
                  }}
                />
              </div>

              <div className="flex items-center mb-2">
                {renderStars(rating)}
                <span className="text-white ml-2">
                  {rating} ({reviewCount})
                </span>
              </div>

              <div className="text-white text-xl font-bold mb-4">{price}</div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
                {!isTrainerAdded ? (
                  // Show only Add Trainer button if not added and coming from explore
                  <button
                    onClick={handleAddTrainer}
                    className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaPlus size={14} />
                    <span>Add Trainer</span>
                  </button>
                ) : (
                  // Show all navigation options if trainer is added
                  <>
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
                    <button
                      onClick={() => navigate(`/subscription/${trainerId}`)}
                      className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <RiVipDiamondLine size={14} />
                      <span>Subscription</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {certificates.length > 0 ? (
            certificates.map((cert, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 bg-[#f67a45]/10 flex items-center justify-center">
                  <img
                    src={"/src/assets/certifications/cert1.png"}
                    alt={cert.title}
                    className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/medal.png";
                    }}
                  />
                </div>
                <h3 className="text-white font-medium text-xs sm:text-sm">
                  {cert.title} ({cert.issuer}, {cert.year})
                </h3>
              </div>
            ))
          ) : (
            <div className="text-white/60">No certifications listed.</div>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.length > 0 ? (
            services.map((service, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A2F] p-4 sm:p-6 rounded-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#f67a45]/10 rounded-bl-full"></div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">
                  {service.name}
                </h3>
                <p className="text-white/70 text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            ))
          ) : (
            <div className="text-white/60">No services listed.</div>
          )}
        </div>
      </div>

      {/* Photos Gallery */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Photos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {photos.length > 0 ? (
            photos.map((photo, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={photo}
                  alt={`Trainer photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/trainer.png";
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-white/60">No photos available.</div>
          )}
        </div>
      </div>

      {/* Packages */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 my-4 sm:my-8 w-full overflow-visible">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Training Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {trainer.packages && trainer.packages.length > 0 ? (
            trainer.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`border ${idx === 1
                    ? "border-2 border-[#f67a45] bg-[#1A1A2F]"
                    : "border-gray-700 bg-[#121225]"
                  } rounded-lg p-4 sm:p-6 hover:border-[#f67a45]/50 transition-all relative`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 right-4 sm:right-6 translate-y-[-50%] bg-[#f67a45] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Popular
                  </div>
                )}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-white text-lg sm:text-xl font-bold">
                    {pkg.name}
                  </h3>
                  <span className="text-xs px-2 sm:px-3 py-1 bg-white/10 text-white rounded-full">
                    {idx === 0
                      ? "Basic"
                      : idx === 1
                        ? "Recommended"
                        : "Premium"}
                  </span>
                </div>
                <div className="text-[#f67a45] text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  ${pkg.price}
                  <span className="text-sm text-white/60 font-normal">
                    /month
                  </span>
                </div>
                <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6 text-sm">
                  {pkg.features &&
                    pkg.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start text-white">
                        <span className="text-[#f67a45] mr-2 flex-shrink-0">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                </ul>
                <button className="w-full bg-white/10 text-white py-2 rounded-full hover:bg-[#f67a45]/20 transition-colors text-sm">
                  Get Started
                </button>
              </div>
            ))
          ) : (
            <div className="text-white/60">No packages available.</div>
          )}
        </div>
      </div>

      {/* Reviews and Ratings */}
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Reviews & Ratings
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFeedbackForm(true)}
            className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors w-full sm:w-auto text-sm sm:text-base"
          >
            Write a Review
          </motion.button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-[#1A1A2F] p-4 rounded-lg">
          <div className="text-[#f67a45] text-3xl sm:text-4xl font-bold text-center sm:text-left">
            {trainer.rating}
          </div>
          <div>
            <div className="flex justify-center sm:justify-start mb-1">
              {renderStars(trainer.rating)}
            </div>
            <div className="text-white/70 text-sm sm:text-base text-center sm:text-left">
              Based on {trainer.reviewCount} reviews
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-6">
          {(showAllReviews ? feedbacks : feedbacks.slice(0, 3)).map(
            (review, idx) => (
              <div key={idx} className="border-b border-gray-700 pb-4 sm:pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={
                          review.profilePhoto
                            ? review.profilePhoto
                            : "/src/assets/profile1.png"
                        }
                        alt={review.userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/profile1.png";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-base">
                        {review.userName}
                      </h4>
                      <div className="flex items-center">
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) =>
                              i < review.rating ? (
                                <FaStar
                                  key={i}
                                  className="text-[#f67a45] text-xs sm:text-sm"
                                />
                              ) : (
                                <FaRegStar
                                  key={i}
                                  className="text-[#f67a45] text-xs sm:text-sm"
                                />
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-white/50 text-xs sm:text-sm">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>
                <p className="text-white/80 text-sm sm:text-base">
                  {review.comment}
                </p>
              </div>
            )
          )}
          {feedbacks.length > 3 && !showAllReviews && (
            <button
              className="text-[#f67a45] hover:underline mt-2"
              onClick={() => setShowAllReviews(true)}
            >
              See more reviews
            </button>
          )}
          {feedbacks.length > 3 && showAllReviews && (
            <button
              className="text-[#f67a45] hover:underline mt-2"
              onClick={() => setShowAllReviews(false)}
            >
              Show less
            </button>
          )}
        </div>
      </div>

      {/* Feedback Form - Hidden by default */}
      {showFeedbackForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sm:p-10 w-full max-w-lg shadow-xl relative"
          >
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="absolute top-3 right-3 text-gray-700 dark:text-white text-xl hover:text-[#f67a45] transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-[#f67a45] dark:text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Leave Feedback
            </h2>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="text-gray-700 dark:text-white text-sm mb-2 block">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`${feedbackRating >= star
                          ? "text-[#f67a45]"
                          : "text-gray-400 dark:text-white/50"
                        } transition-colors flex items-center`}
                    >
                      <FaStar className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-700 dark:text-white text-sm mb-2 block">
                  Comments
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-[#1A1A2F] border border-[#f67a45]/30 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] focus:border-transparent resize-none"
                  rows="4"
                  placeholder="What did you think about the training?"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#f67a45]/90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                    />
                  </svg>
                ) : (
                  <>
                    <RiVipDiamondLine size={14} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </TrainerLayout>
  );
};

export default TrainerProfile;

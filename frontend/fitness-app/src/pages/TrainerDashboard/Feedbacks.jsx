import React, { useState, useEffect } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaStar, FaRegStar, FaTrash, FaSearch } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Admin/Notification";
import { getMyTrainerFeedbacks, removeFeedback } from "../../api/trainer";

/**
 * Feedbacks component - Displays and manages feedback received by trainers
 *
 * Features:
 * - Listing all feedback with search functionality
 * - Rating display using star icons
 * - Feedback removal with confirmation dialog
 * - Notification system for user actions
 *
 * Backend Integration:
 * - Fetches feedbacks from API endpoint (GET /api/v1/trainers/my-feedbacks)
 * - Delete feedback through API endpoint (DELETE /api/v1/trainers/feedbacks/:id)
 */
const Feedbacks = () => {
  // State management for feedbacks and UI controls
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackToRemove, setFeedbackToRemove] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });

  // Fetch feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getMyTrainerFeedbacks();
        setFeedbacks(data || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError("Failed to load feedbacks. Please try again.");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  /**
   * Filters feedbacks based on search term
   * Searches through both userName and comment fields
   */
  const filteredFeedbacks = feedbacks.filter(
    (f) =>
      f.userName.toLowerCase().includes(search.toLowerCase()) ||
      f.comment.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Initiates the feedback removal process
   * Shows a confirmation dialog before actually removing the feedback
   *
   * @param {Object} feedback - The feedback object to be removed
   */
  const handleRemoveFeedback = (feedback) => {
    setFeedbackToRemove(feedback);
    setShowConfirm(true);
  };

  /**
   * Confirms and executes feedback removal
   * Makes an API call to remove the feedback from the database
   * API endpoint: DELETE /api/v1/trainers/feedbacks/:id
   */
  const confirmRemoveFeedback = async () => {
    try {
      // Call API to remove feedback
      await removeFeedback(feedbackToRemove._id);

      // Update local state - filter out the removed feedback
      setFeedbacks((prev) =>
        prev.filter((f) => f._id !== feedbackToRemove._id)
      );
      setShowConfirm(false);

      // Show success notification
      setNotification({
        isVisible: true,
        type: "success",
        message: `Removed feedback from ${feedbackToRemove.userName}`,
        autoClose: true,
        duration: 3000,
      });
      setFeedbackToRemove(null);
    } catch (err) {
      console.error("Error removing feedback:", err);
      setShowConfirm(false);

      // Show error notification
      setNotification({
        isVisible: true,
        type: "error",
        message: "Failed to remove feedback. Please try again.",
        autoClose: true,
        duration: 3000,
      });
      setFeedbackToRemove(null);
    }
  };

  /**
   * Renders a star rating component based on the rating value
   *
   * @param {number} rating - Rating value from 0-5
   * @returns {JSX.Element} - Star rating UI
   */
  const renderStars = (rating) => {
    return (
      <span className="flex">
        {[...Array(5)].map((_, i) =>
          i < rating ? (
            <FaStar key={i} className="text-[#f67a45] text-xs mr-0.5" />
          ) : (
            <FaRegStar key={i} className="text-[#f67a45] text-xs mr-0.5" />
          )
        )}
      </span>
    );
  };

  return (
    <TrainerDashboardLayout activeSection="Feedbacks">
      <h1 className="text-white text-2xl font-bold mb-6">Feedbacks</h1>

      {/* Search functionality for filtering feedbacks */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search feedbacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121225] border border-[#f67a45]/30 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#f67a45]"
            aria-label="Search feedbacks"
          />
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f67a45]"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-white">Loading feedbacks...</div>
          </div>
        </div>
      ) : error ? (
        /* Error state */
        <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400">{error}</div>
          </div>
        </div>
      ) : (
        /* Feedback listing with conditional rendering for empty state */
        <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
          <h2 className="text-white text-lg font-semibold mb-4">
            All Feedbacks
          </h2>
          {filteredFeedbacks.length === 0 ? (
            <p className="text-white/70">
              {search
                ? "No feedbacks found matching your search."
                : "No feedbacks received yet."}
            </p>
          ) : (
            <div className="divide-y divide-[#232342]">
              {filteredFeedbacks.map((f) => (
                <div key={f._id} className="flex items-start gap-4 py-4">
                  {/* User avatar with fallback handling */}
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={f.profilePhoto || "/src/assets/profile1.png"}
                      alt={f.userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/profile1.png";
                      }}
                    />
                  </div>

                  {/* Feedback content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">
                        {f.userName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {f.createdAt
                          ? new Date(f.createdAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(f.rating)}
                      <span className="text-white/70 text-xs ml-2">
                        {f.rating}/5
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{f.comment}</p>
                  </div>

                  {/* Remove feedback button */}
                  <button
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-500/30 transition-colors text-sm ml-2"
                    title="Remove Feedback"
                    onClick={() => handleRemoveFeedback(f)}
                    aria-label={`Remove feedback from ${f.userName}`}
                  >
                    <FaTrash aria-hidden="true" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation dialog for feedback removal */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRemoveFeedback}
        title="Remove Feedback"
        message={
          feedbackToRemove
            ? `Are you sure you want to remove feedback from ${feedbackToRemove.userName}? This action cannot be undone.`
            : ""
        }
        type="danger"
      />

      {/* Notification system for user feedback */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification((n) => ({ ...n, isVisible: false }))}
        autoClose={notification.autoClose}
        duration={notification.duration}
      />
    </TrainerDashboardLayout>
  );
};

export default Feedbacks;

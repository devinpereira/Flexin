import React, { useState } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaStar, FaRegStar, FaTrash, FaSearch } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Admin/Notification";

/**
 * Mock feedback data for development
 * In production, this would be fetched from the backend API
 * Expected response format matches this structure
 */
const mockFeedbacks = [
	{
		id: 1,
		userName: "Alex Johnson",
		userAvatar: "/src/assets/profile1.png",
		rating: 5,
		comment: "Great trainer! Helped me achieve my goals.",
		createdAt: "2024-06-01T10:30:00Z",
	},
	{
		id: 2,
		userName: "Sarah Miller",
		userAvatar: "/src/assets/profile1.png",
		rating: 4,
		comment: "Very supportive and knowledgeable.",
		createdAt: "2024-05-28T14:15:00Z",
	},
	{
		id: 3,
		userName: "Michael Lee",
		userAvatar: "/src/assets/profile1.png",
		rating: 5,
		comment: "Amazing experience, highly recommend!",
		createdAt: "2024-05-20T09:00:00Z",
	},
	{
		id: 4,
		userName: "Emily Davis",
		userAvatar: "/src/assets/profile1.png",
		rating: 3,
		comment: "Good, but response time could be faster.",
		createdAt: "2024-05-15T17:45:00Z",
	},
];

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
 * - Expected to fetch feedbacks from API endpoint (GET /api/trainer/feedbacks)
 * - Delete feedback through API endpoint (DELETE /api/trainer/feedbacks/:id)
 */
const Feedbacks = () => {
	// State management for feedbacks and UI controls
	const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
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
	 * In production, this would make an API call to remove the feedback
	 * API endpoint: DELETE /api/trainer/feedbacks/:id
	 */
	const confirmRemoveFeedback = () => {
		// Filter out the feedback to be removed
		setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackToRemove.id));
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
					<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f67a45]" aria-hidden="true" />
				</div>
			</div>
			
			{/* Feedback listing with conditional rendering for empty state */}
			<div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
				<h2 className="text-white text-lg font-semibold mb-4">All Feedbacks</h2>
				{filteredFeedbacks.length === 0 ? (
					<p className="text-white/70">No feedbacks found.</p>
				) : (
					<div className="divide-y divide-[#232342]">
						{filteredFeedbacks.map((f) => (
							<div key={f.id} className="flex items-start gap-4 py-4">
								{/* User avatar with fallback handling */}
								<div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
									<img
										src={f.userAvatar}
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
				onClose={() =>
					setNotification((n) => ({ ...n, isVisible: false }))
				}
				autoClose={notification.autoClose}
				duration={notification.duration}
			/>
		</TrainerDashboardLayout>
	);
};

export default Feedbacks;

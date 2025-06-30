import React, { useState } from "react";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaStar, FaRegStar, FaTrash, FaSearch } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Admin/Notification";

// Mock feedback data
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

const Feedbacks = () => {
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

	// Filter feedbacks by search
	const filteredFeedbacks = feedbacks.filter(
		(f) =>
			f.userName.toLowerCase().includes(search.toLowerCase()) ||
			f.comment.toLowerCase().includes(search.toLowerCase())
	);

	// Remove feedback logic
	const handleRemoveFeedback = (feedback) => {
		setFeedbackToRemove(feedback);
		setShowConfirm(true);
	};

	const confirmRemoveFeedback = () => {
		setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackToRemove.id));
		setShowConfirm(false);
		setNotification({
			isVisible: true,
			type: "success",
			message: `Removed feedback from ${feedbackToRemove.userName}`,
			autoClose: true,
			duration: 3000,
		});
		setFeedbackToRemove(null);
	};

	// Render star rating
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
			{/* Search Bar */}
			<div className="mb-6">
				<div className="relative">
					<input
						type="text"
						placeholder="Search feedbacks..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full bg-[#121225] border border-[#f67a45]/30 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#f67a45]"
					/>
					<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f67a45]" />
				</div>
			</div>
			{/* Feedback List */}
			<div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
				<h2 className="text-white text-lg font-semibold mb-4">All Feedbacks</h2>
				{filteredFeedbacks.length === 0 ? (
					<p className="text-white/70">No feedbacks found.</p>
				) : (
					<div className="divide-y divide-[#232342]">
						{filteredFeedbacks.map((f) => (
							<div key={f.id} className="flex items-start gap-4 py-4">
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
								<button
									className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-500/30 transition-colors text-sm ml-2"
									title="Remove Feedback"
									onClick={() => handleRemoveFeedback(f)}
								>
									<FaTrash />
									Remove
								</button>
							</div>
						))}
					</div>
				)}
			</div>
			{/* Remove Feedback Confirm Dialog */}
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
			{/* Notification */}
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

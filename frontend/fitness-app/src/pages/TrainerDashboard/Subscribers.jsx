import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaUserFriends, FaEnvelopeOpenText, FaSearch, FaEnvelope, FaEye, FaTrash } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Admin/Notification";

const mockSubscribers = [
  {
    id: "u1",
    name: "Alex Johnson",
    avatar: "/src/assets/profile1.png",
    userType: "Beginner",
    unreadMessages: 2,
  },
  {
    id: "u2",
    name: "Sarah Miller",
    avatar: "/src/assets/profile1.png",
    userType: "Intermediate",
    unreadMessages: 0,
  },
  {
    id: "u3",
    name: "Michael Lee",
    avatar: "/src/assets/profile1.png",
    userType: "Advanced",
    unreadMessages: 1,
  },
  {
    id: "u4",
    name: "Emily Davis",
    avatar: "/src/assets/profile1.png",
    userType: "Beginner",
    unreadMessages: 0,
  },
];

const Subscribers = () => {
  const [search, setSearch] = useState("");
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [showConfirm, setShowConfirm] = useState(false);
  const [subscriberToRemove, setSubscriberToRemove] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });
  const navigate = useNavigate();

  // Filter subscribers by search
  const filteredSubscribers = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.userType.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers for buttons
  const handleMessage = (user) => {
    navigate(`/trainer/messages?user=${user.id}`);
  };
  const handleViewDetails = (user) => {
    navigate(`/trainer/subscriber-profile/${user.id}`);
  };

  // Remove subscription logic
  const handleRemoveSubscription = (user) => {
    setSubscriberToRemove(user);
    setShowConfirm(true);
  };

  const confirmRemoveSubscription = () => {
    setSubscribers((prev) => prev.filter((s) => s.id !== subscriberToRemove.id));
    setShowConfirm(false);
    setNotification({
      isVisible: true,
      type: "success",
      message: `Removed subscription for ${subscriberToRemove.name}`,
      autoClose: true,
      duration: 3000,
    });
    setSubscriberToRemove(null);
  };

  return (
    <TrainerDashboardLayout activeSection="Subscribers">
      <h1 className="text-white text-2xl font-bold mb-6">Subscribers</h1>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div
          className="bg-[#18182f] ring-2 ring-[#f67a45] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/trainer/subscribers")}
        >
          <div className="bg-[#f67a45]/20 p-4 rounded-full">
            <FaUserFriends className="text-[#f67a45] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">
              Total Subscribers
            </h2>
            <p className="text-[#f67a45] text-3xl font-bold">
              {subscribers.length}
            </p>
          </div>
        </div>
        <div
          className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4 cursor-pointer hover:bg-[#18182f]/60 transition-all"
          onClick={() => navigate("/trainer/requests")}
        >
          <div className="bg-[#f59e0b]/20 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-[#f59e0b] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">Requests</h2>
            <p className="text-[#f59e0b] text-3xl font-bold">1</p>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search subscribers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121225] border border-[#f67a45]/30 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#f67a45]"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f67a45]" />
        </div>
      </div>
      {/* Subscribers List */}
      <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
        <h2 className="text-white text-lg font-semibold mb-4">
          Subscribers List
        </h2>
        {filteredSubscribers.length === 0 ? (
          <p className="text-white/70">No subscribers found.</p>
        ) : (
          <div className="divide-y divide-[#232342]">
            {filteredSubscribers.map((s) => (
              <div key={s.id} className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/profile1.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">
                      {s.name}
                    </span>
                    {s.unreadMessages > 0 && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-[#f67a45] inline-block"></span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{s.userType}</p>
                </div>
                <button
                  className="bg-[#f67a45]/20 text-[#f67a45] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#f67a45]/30 transition-colors text-sm"
                  title="Message"
                  onClick={() => handleMessage(s)}
                >
                  <FaEnvelope />
                  Message
                  {s.unreadMessages > 0 && (
                    <span className="ml-1 bg-[#f67a45] text-white text-xs px-2 py-0.5 rounded-full">
                      {s.unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  className="bg-[#1A1A2F] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#232342] transition-colors text-sm ml-2"
                  title="View Details"
                  onClick={() => handleViewDetails(s)}
                >
                  <FaEye />
                  View Details
                </button>
                <button
                  className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-500/30 transition-colors text-sm ml-2"
                  title="Remove Subscription"
                  onClick={() => handleRemoveSubscription(s)}
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Remove Subscription Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRemoveSubscription}
        title="Remove Subscription"
        message={
          subscriberToRemove
            ? `Are you sure you want to remove subscription for ${subscriberToRemove.name}? This action cannot be undone.`
            : ""
        }
        type="danger"
      />
      {/* Notification */}
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

export default Subscribers;
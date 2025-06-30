import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaEnvelopeOpenText, FaUserFriends, FaSearch, FaEye, FaCheck, FaTimes } from "react-icons/fa";
import ConfirmDialog from "../../components/ConfirmDialog";
import Notification from "../../components/Admin/Notification";
import Modal from "../../components/Modal";

const mockRequests = [
  {
    id: "r1",
    name: "David Brown",
    avatar: "/src/assets/profile1.png",
    userType: "Beginner",
    message: "Hi, I'd like to join your program!",
  },
  {
    id: "r2",
    name: "Jessica Lee",
    avatar: "/src/assets/profile1.png",
    userType: "Intermediate",
    message: "Looking for a new meal plan.",
  },
];

const mockSubscribers = [
  { id: "u1" },
  { id: "u2" },
  { id: "u3" },
  { id: "u4" },
];

const Requests = () => {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(mockRequests);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState("accept");
  const [requestToHandle, setRequestToHandle] = useState(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const navigate = useNavigate();

  // Filter requests by search
  const filteredRequests = requests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.userType.toLowerCase().includes(search.toLowerCase())
  );

  // Accept/Decline logic
  const handleAcceptRequest = (user) => {
    setRequestToHandle(user);
    setConfirmType("accept");
    setShowConfirm(true);
  };
  const handleDeclineRequest = (user) => {
    setRequestToHandle(user);
    setConfirmType("decline");
    setShowConfirm(true);
  };

  const confirmRequestAction = () => {
    if (confirmType === "accept") {
      setRequests((prev) => prev.filter((r) => r.id !== requestToHandle.id));
      setNotification({
        isVisible: true,
        type: "success",
        message: `Accepted request from ${requestToHandle.name}`,
        autoClose: true,
        duration: 3000,
      });
    } else {
      setRequests((prev) => prev.filter((r) => r.id !== requestToHandle.id));
      setNotification({
        isVisible: true,
        type: "info",
        message: `Declined request from ${requestToHandle.name}`,
        autoClose: true,
        duration: 3000,
      });
    }
    setShowConfirm(false);
    setRequestToHandle(null);
  };

  // View details logic (opens modal)
  const handleViewDetails = (user) => {
    setViewRequest(user);
    setViewModalOpen(true);
  };

  return (
    <TrainerDashboardLayout activeSection="Subscribers">
      <h1 className="text-white text-2xl font-bold mb-6">Requests</h1>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div
          className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4 cursor-pointer hover:bg-[#18182f]/60 transition-all"
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
              {mockSubscribers.length}
            </p>
          </div>
        </div>
        <div
          className="bg-[#18182f] ring-2 ring-[#f67a45] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/trainer/requests")}
        >
          <div className="bg-[#f59e0b]/20 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-[#f59e0b] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">Requests</h2>
            <p className="text-[#f59e0b] text-3xl font-bold">{requests.length}</p>
          </div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121225] border border-[#f67a45]/30 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#f67a45]"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f67a45]" />
        </div>
      </div>
      {/* Requests List */}
      <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
        <h2 className="text-white text-lg font-semibold mb-4">Requests</h2>
        {filteredRequests.length === 0 ? (
          <p className="text-white/70">No requests found.</p>
        ) : (
          <div className="divide-y divide-[#232342]">
            {filteredRequests.map((r) => (
              <div key={r.id} className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/profile1.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium truncate">{r.name}</span>
                  <p className="text-gray-400 text-sm">{r.userType}</p>
                  {r.message && (
                    <p className="text-white/60 text-xs mt-1 italic">"{r.message}"</p>
                  )}
                </div>
                <button
                  className="bg-[#1A1A2F] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#232342] transition-colors text-sm"
                  title="View Details"
                  onClick={() => handleViewDetails(r)}
                >
                  <FaEye />
                  View
                </button>
                <button
                  className="bg-[#10b981]/20 text-[#10b981] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#10b981]/30 transition-colors text-sm ml-2"
                  title="Accept"
                  onClick={() => handleAcceptRequest(r)}
                >
                  <FaCheck />
                  Accept
                </button>
                <button
                  className="bg-[#f67a45]/20 text-[#f67a45] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#f67a45]/30 transition-colors text-sm ml-2"
                  title="Decline"
                  onClick={() => handleDeclineRequest(r)}
                >
                  <FaTimes />
                  Decline
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* View Request Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Request Details"
        size="sm"
      >
        {viewRequest && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#f67a45]/40">
                <img
                  src={viewRequest.avatar}
                  alt={viewRequest.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = "/src/assets/profile1.png"; }}
                />
              </div>
              <div>
                <div className="text-white font-bold text-lg">{viewRequest.name}</div>
                <div className="text-gray-400 text-sm">{viewRequest.userType}</div>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-white/70 font-medium">Message:</span>
              <div className="text-white mt-1">{viewRequest.message || <span className="text-gray-400">No message provided.</span>}</div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#f67a45] text-white px-4 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRequestAction}
        title={confirmType === "accept" ? "Accept Request" : "Decline Request"}
        message={
          requestToHandle
            ? confirmType === "accept"
              ? `Are you sure you want to accept the request from ${requestToHandle.name}?`
              : `Are you sure you want to decline the request from ${requestToHandle.name}?`
            : ""
        }
        type={confirmType === "accept" ? "success" : "danger"}
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

export default Requests;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import { FaUserFriends, FaDollarSign, FaEnvelopeOpenText, FaEnvelope } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data for cards
  const [stats] = useState({
    subscribers: 24,
    earnings: 1240, // This month's earnings
    requests: 3,
  });

  // Mock recent messages data
  const [messages] = useState([
    {
      id: 1,
      userId: "101",
      userName: "Alex Johnson",
      userAvatar: "/src/assets/profile1.png",
      text: "Hi coach, can we reschedule our session?",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      userId: "102",
      userName: "Sarah Miller",
      userAvatar: "/src/assets/profile1.png",
      text: "Thank you for the new workout plan!",
      time: "10 min ago",
      unread: false,
    },
    {
      id: 3,
      userId: "103",
      userName: "Michael Lee",
      userAvatar: "/src/assets/profile1.png",
      text: "I have a question about my meal plan.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 4,
      userId: "104",
      userName: "Emily Davis",
      userAvatar: "/src/assets/profile1.png",
      text: "Great session today!",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 5,
      userId: "105",
      userName: "David Brown",
      userAvatar: "/src/assets/profile1.png",
      text: "Can you send me the warmup routine?",
      time: "Yesterday",
      unread: true,
    },
  ]);

  // Calculate unread messages count
  const unreadCount = messages.filter((msg) => msg.unread).length;

  // Handle click on a message
  const handleMessageClick = (userId) => {
    navigate(`/trainer/messages?user=${userId}`);
  };

  return (
    <TrainerDashboardLayout activeSection="Dashboard">
      <h1 className="text-white text-2xl font-bold mb-6">Welcome, Nipuna Lakruwan</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#f67a45]/20 p-4 rounded-full">
            <FaUserFriends className="text-[#f67a45] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">Subscribers</h2>
            <p className="text-[#f67a45] text-3xl font-bold">{stats.subscribers}</p>
          </div>
        </div>
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#10b981]/20 p-4 rounded-full">
            <FaDollarSign className="text-[#10b981] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">This Month's Earnings</h2>
            <p className="text-[#10b981] text-3xl font-bold">${stats.earnings}</p>
          </div>
        </div>
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#f59e0b]/20 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-[#f59e0b] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">Requests</h2>
            <p className="text-[#f59e0b] text-3xl font-bold">{stats.requests}</p>
          </div>
        </div>
      </div>
      {/* Recent Messages */}
      <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Recent Messages</h2>
          <span className="text-sm text-[#f67a45]">
            {unreadCount} unread
          </span>
        </div>
        <div className="divide-y divide-[#232342]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-center gap-4 py-3 cursor-pointer hover:bg-[#1A1A2F] rounded-lg px-2 transition-colors ${msg.unread ? "bg-[#f67a45]/10" : ""}`}
              onClick={() => handleMessageClick(msg.userId)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={msg.userAvatar}
                  alt={msg.userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/profile1.png";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{msg.userName}</span>
                  {msg.unread && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-[#f67a45] inline-block"></span>
                  )}
                </div>
                <p className="text-gray-400 text-sm truncate">{msg.text}</p>
              </div>
              <div className="text-xs text-gray-500">{msg.time}</div>
              {msg.unread && (
                <FaEnvelope className="text-[#f67a45] ml-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </TrainerDashboardLayout>
  );
};

export default Dashboard;

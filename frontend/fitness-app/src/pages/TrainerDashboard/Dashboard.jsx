import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrainerDashboardLayout from "../../layouts/TrainerDashboardLayout";
import {
  FaUserFriends,
  FaDollarSign,
  FaEnvelopeOpenText,
  FaEnvelope,
} from "react-icons/fa";
import { getMyTrainerProfile } from "../../api/trainer";
// You may need to implement these API functions:
// import { getDashboardStats, getRecentMessages } from "../../api/dashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [stats, setStats] = useState({
    subscribers: 0,
    dueAmount: 0,
    requests: 0,
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch trainer profile
        const profile = await getMyTrainerProfile();
        setTrainer(profile);

        if (profile) {
          // Fetch dashboard stats
          const [overviewRes, dueAmountRes] = await Promise.all([
            fetch(
              `/api/v1/reports/overview?period=all&trainerId=${profile._id}`,
              { headers }
            ),
            fetch(`/api/v1/subscription/${profile._id}/total-revenue`, {
              headers,
            }),
          ]);

          if (!overviewRes.ok || !dueAmountRes.ok) {
            throw new Error("Failed to fetch dashboard stats");
          }

          const overviewData = await overviewRes.json();
          const dueAmountData = await dueAmountRes.json();

          setStats({
            subscribers: overviewData.data?.indicators?.subscriptions || 0,
            dueAmount: dueAmountData.success ? dueAmountData.total : 0,
            requests: 0, // Keep mock data for requests for now
          });
        }

        // Fetch recent messages (replace with your actual API call)
        // For now, fallback to empty:
        setMessages([]);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const unreadCount = messages.filter((msg) => msg.unread).length;

  const handleMessageClick = (userId) => {
    navigate(`/trainer/messages?user=${userId}`);
  };

  if (loading) {
    return (
      <TrainerDashboardLayout activeSection="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  if (error) {
    return (
      <TrainerDashboardLayout activeSection="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-lg">Error: {error}</div>
        </div>
      </TrainerDashboardLayout>
    );
  }

  return (
    <TrainerDashboardLayout activeSection="Dashboard">
      <h1 className="text-white text-2xl font-bold mb-6">
        Welcome, {trainer?.name || "Trainer"}
      </h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#f67a45]/20 p-4 rounded-full">
            <FaUserFriends className="text-[#f67a45] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">
              Subscribers
            </h2>
            <p className="text-[#f67a45] text-3xl font-bold">
              {stats.subscribers}
            </p>
          </div>
        </div>
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#10b981]/20 p-4 rounded-full">
            <FaDollarSign className="text-[#10b981] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">
              Due Amount
            </h2>
            <p className="text-[#10b981] text-3xl font-bold">
              ${stats.dueAmount}
            </p>
          </div>
        </div>
        <div className="bg-[#121225] rounded-lg p-6 border border-[#f67a45]/30 flex items-center gap-4">
          <div className="bg-[#f59e0b]/20 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-[#f59e0b] text-2xl" />
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold mb-1">Requests</h2>
            <p className="text-[#f59e0b] text-3xl font-bold">
              {stats.requests}
            </p>
          </div>
        </div>
      </div>
      {/* Recent Messages */}
      <div className="bg-[#121225] rounded-lg border border-[#f67a45]/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Recent Messages</h2>
          <span className="text-sm text-[#f67a45]">{unreadCount} unread</span>
        </div>
        <div className="divide-y divide-[#232342]">
          {messages.length === 0 ? (
            <div className="text-gray-400 py-4 text-center">
              No recent messages.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-center gap-4 py-3 cursor-pointer hover:bg-[#1A1A2F] rounded-lg px-2 transition-colors ${
                  msg.unread ? "bg-[#f67a45]/10" : ""
                }`}
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
                    <span className="text-white font-medium truncate">
                      {msg.userName}
                    </span>
                    {msg.unread && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-[#f67a45] inline-block"></span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm truncate">{msg.text}</p>
                </div>
                <div className="text-xs text-gray-500">{msg.time}</div>
                {msg.unread && <FaEnvelope className="text-[#f67a45] ml-2" />}
              </div>
            ))
          )}
        </div>
      </div>
    </TrainerDashboardLayout>
  );
};

export default Dashboard;

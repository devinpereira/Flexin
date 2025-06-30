import React, { useState, useEffect } from "react";
import {
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaSearch,
  FaFilter,
  FaUserMinus,
  FaCircle,
  FaComment,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import CommunityLayout from "../../layouts/CommunityLayout";

const CommunityFriends = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Tabs configuration
  const tabs = [
    { id: "followers", label: "Followers" },
    { id: "following", label: "Following" },
    { id: "requests", label: "Requests" },
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const [followersData, followingData, suggestionsData, followRequests] =
          await Promise.all([
            axiosInstance.get(`${API_PATHS.FOLLOW.GET_MY_FOLLOWERS}`),
            axiosInstance.get(`${API_PATHS.FOLLOW.GET_FOLLOWING}`),
            axiosInstance.get(`${API_PATHS.FOLLOW.GET_SUGGESTIONS}`),
            axiosInstance.get(`${API_PATHS.FOLLOW.GET_FOLLOW_REQUESTS}`),
          ]);

        setFollowers(followersData.data);
        setFollowing(followingData.data);
        setSuggestions(suggestionsData.data);
        setFriendRequests(followRequests.data);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
      setIsLoading(false);
    };

    fetchFriends();
  }, []);

  const handleFollow = async (id) => {
    try {
      const res = await axiosInstance.post(
        `${API_PATHS.FOLLOW.SEND_FOLLOW_REQUEST(id)}`);
      console.log("Follow request sent successfully", res.data);
    
      // Update suggestions to remove the followed user
      setSuggestions((prev) => prev.filter((user) => user.id !== id));
    
      // Add to following
      const userToAdd = suggestions.find((user) => user.id === id);
      if (userToAdd) {
        setFollowing((prev) => [...prev, { ...userToAdd }]);
      }

    } catch (error) {
      console.error("Error sending follow request", error);
    }
  };


  const handleUnfollow = async (id) => {
    try {
      const response = await axiosInstance.delete(
      `${API_PATHS.FOLLOW.UNFOLLOW_USER(id)}`
      );
      setFollowing(following.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error sending follow request", error);
    }
  };

  const handleAcceptRequest = async (request) => {
    try {
      await axiosInstance.post(`${API_PATHS.FOLLOW.APPROVE_FOLLOW_REQUEST(request._id)}`);

      setFriendRequests(friendRequests.filter((r) => r._id !== request._id));
      setFollowers([...followers, request]);
    } catch (error) {
      console.error("Error sending follow request", error);
    }
  };

  const handleDeclineRequest = async (request) => {
        try {
      const response = await axiosInstance.post(`${API_PATHS.FOLLOW.REJECT_FOLLOW_REQUEST(request._id)}`);

      setFriendRequests(friendRequests.filter((r) => r._id !== request._id));
    } catch (error) {
      console.error("Error sending follow request", error);
    }
  }

  return (
    <CommunityLayout>
      <div className="space-y-6">
        <h2 className="text-white text-2xl font-bold mb-4">Friends</h2>

        {/* Search and Tabs */}
        <div className="bg-[#121225] rounded-xl p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "text-[#f67a45] border-b-2 border-[#f67a45]"
                    : "text-white hover:text-[#f67a45]"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

{/* Friends List or Requests */}
<div className="space-y-4">
  {activeTab === "requests" && (
    <>
      <h3 className="text-white text-lg font-medium">
        Friend Requests ({friendRequests.length})
      </h3>
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <div
            key={request._id}
            className="bg-[#121225] rounded-xl p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <img
                src={request.followerId.profileImageUrl || "/default.jpg"}
                alt={request.followerId.fullName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default.jpg";
                }}
              />
              <div>
                <h4 className="text-white font-medium">{request.followerId.fullName}</h4>
                <p className="text-gray-400 text-xs">
                  {request.mutualFriends} mutual friends
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-[#f67a45] text-white px-3 py-1 rounded-full text-sm"
                onClick={() => handleAcceptRequest(request)}
              >
                Accept
              </button>
              <button
                className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm"
                onClick={() => handleDeclineRequest(request)}
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-[#121225] rounded-xl p-6 text-center">
          <p className="text-gray-400">No pending friend requests</p>
        </div>
      )}
    </>
  )}

  {(activeTab === "followers" || activeTab === "following") && (
    <>
      <h3 className="text-white text-lg font-medium">
        {activeTab === "followers" ? `Followers (${followers.length})` : `Following (${following.length})`}
      </h3>
      {(activeTab === "followers" ? followers : following).length > 0 ? (
        (activeTab === "followers" ? followers : following)
          .filter((friend) =>
            searchTerm
              ? friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                friend.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
              : true
          )
          .map((friend) => (
            <div
              key={friend._id}
              className="bg-[#121225] rounded-xl p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={friend.profileImageUrl || "/default.jpg"}
                    alt={friend.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.jpg";
                    }}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 ${
                      friend.isOnline ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={10} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium">{friend.fullName}</h4>
                  <p className="text-gray-400 text-xs truncate">
                    {friend.isOnline ? "Online" : friend.lastSeen}
                    {friend.status && ` • ${friend.status}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                  <FaComment size={14} />
                </button>
                {activeTab === "following" && (
                  <button
                    className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-red-500/20 hover:text-red-500"
                    onClick={() => handleUnfollow(friend._id)}
                  >
                    <FaUserMinus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
      ) : (
        <div className="bg-[#121225] rounded-xl p-6 text-center">
          <p className="text-gray-400">
            {searchTerm
              ? `No ${activeTab} found matching "${searchTerm}"`
              : `No ${activeTab} found`}
          </p>
        </div>
      )}
    </>
  )}
</div>


        {/* People You May Know section */}
        <div className="mt-8">
          <h3 className="text-white text-lg font-medium mb-4">
            People You May Know
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-[#121225] rounded-xl p-4 flex flex-col items-center text-center"
              >
                <img
                  src={suggestion.profileImage || "/default.jpg"}
                  alt={suggestion.name}
                  className="w-16 h-16 rounded-full object-cover mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default.jpg";
                  }}
                />
                <h4 className="text-white font-medium">{suggestion.name}</h4>
                <p className="text-gray-400 text-xs mb-3">
                  {suggestion.mutualFriends
                    ? `${suggestion.mutualFriends} mutual friends`
                    : "Suggested for you"}
                </p>
                <button
                  className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-1"
                  onClick={() => handleFollow(suggestion.id)}
                >
                  <FaUserPlus size={12} />
                  <span>Add Friend</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityFriends;

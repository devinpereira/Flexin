import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaSearch, FaFilter, FaUserMinus, FaCircle, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import CommunityLayout from '../../layouts/CommunityLayout';

const CommunityFriends = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All Friends' },
    { id: 'online', label: 'Online' },
    { id: 'requests', label: 'Requests' }
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const [followersData, followingData, suggestionsData] = await Promise.all([
          axiosInstance.get(`${API_PATHS.FOLLOW.GET_MY_FOLLOWERS}`),
          axiosInstance.get(`${API_PATHS.FOLLOW.GET_FOLLOWING}`),
          axiosInstance.get(`${API_PATHS.FOLLOW.GET_SUGGESTIONS}`)
        ]);

        setFollowers(followersData.data);
        setFollowing(followingData.data);
        setSuggestions(suggestionsData.data);

        // For demo purposes, create some mock friend requests
        setFriendRequests([
          { id: 101, name: 'Alex Johnson', image: '/src/assets/profile1.png', mutualFriends: 3 },
          { id: 102, name: 'Sam Peterson', image: '/src/assets/profile1.png', mutualFriends: 1 }
        ]);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
      setIsLoading(false);
    };

    fetchFriends();
  }, []);

  const handleFollow = (id) => {
    // Update suggestions
    setSuggestions(
      suggestions.filter(user => user.id !== id)
    );

    // Add to following
    const userToAdd = suggestions.find(user => user.id === id);
    if (userToAdd) {
      setFollowing([...following, { ...userToAdd }]);
    }
  };

  const handleUnfollow = (id) => {
    setFollowing(
      following.filter(user => user.id !== id)
    );
  };

  const handleAcceptRequest = (request) => {
    // Remove from requests and add to friends
    setFriendRequests(friendRequests.filter(r => r.id !== request.id));
    setFollowers([...followers, request]);
  };

  const getFilteredFriends = () => {
    // Combine followers and following for "all" tab
    let friendsToShow = activeTab === 'online'
      ? following.filter(friend => friend.isOnline)
      : following;

    // Filter by search term if present
    if (searchTerm) {
      return friendsToShow.filter(friend =>
        friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return friendsToShow;
  };

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
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]'
                : 'text-white hover:text-[#f67a45]'
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Friends List or Requests */}
      {activeTab === 'requests' ? (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-medium">Friend Requests ({friendRequests.length})</h3>

          {friendRequests.length > 0 ? (
            friendRequests.map(request => (
              <div key={request.id} className="bg-[#121225] rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={request.image}
                    alt={request.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/profile1.png";
                    }}
                  />
                  <div>
                    <h4 className="text-white font-medium">{request.name}</h4>
                    <p className="text-gray-400 text-xs">{request.mutualFriends} mutual friends</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="bg-[#f67a45] text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => handleAcceptRequest(request)}
                  >
                    Accept
                  </button>
                  <button className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm">
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
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredFriends().length > 0 ? (
            getFilteredFriends().map(friend => (
              <div key={friend.id} className="bg-[#121225] rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/src/assets/profile1.png";
                      }}
                    />
                    <div className={`absolute -bottom-1 -right-1 ${friend.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                      <FaCircle size={10} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium">{friend.name}</h4>
                    <p className="text-gray-400 text-xs truncate">
                      {friend.isOnline ? 'Online' : friend.lastSeen}
                      {friend.status && ` • ${friend.status}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-[#f67a45]/20 hover:text-[#f67a45]">
                    <FaComment size={14} />
                  </button>
                  <button
                    className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-red-500/20 hover:text-red-500"
                    onClick={() => handleUnfollow(friend.id)}
                  >
                    <FaUserMinus size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#121225] rounded-xl p-6 text-center">
              <p className="text-gray-400">
                {searchTerm
                  ? `No friends found matching "${searchTerm}"`
                  : activeTab === 'online'
                    ? 'No friends are currently online'
                    : 'No friends found'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* People You May Know section */}
      <div className="mt-8">
        <h3 className="text-white text-lg font-medium mb-4">People You May Know</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: 201, name: 'Jordan Lee', image: '/src/assets/profile1.png', mutualFriends: 5 },
            { id: 202, name: 'Taylor Smith', image: '/src/assets/profile1.png', mutualFriends: 3 },
            { id: 203, name: 'Riley Zhang', image: '/src/assets/profile1.png', mutualFriends: 2 }
          ].map(suggestion => (
            <div key={suggestion.id} className="bg-[#121225] rounded-xl p-4 flex flex-col items-center text-center">
              <img
                src={suggestion.image}
                alt={suggestion.name}
                className="w-16 h-16 rounded-full object-cover mb-3"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/profile1.png";
                }}
              />
              <h4 className="text-white font-medium">{suggestion.name}</h4>
              <p className="text-gray-400 text-xs mb-3">{suggestion.mutualFriends} mutual friends</p>
              <button className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm hover:bg-[#f67a45]/20 hover:text-[#f67a45] flex items-center gap-1">
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

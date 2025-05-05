import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaSearch, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_PATHS, BASE_URL } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

const FriendsManagement = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
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
      setFollowing([...following, {...userToAdd}]);
    }
  };
  
  const handleUnfollow = (id) => {
    setFollowing(
      following.filter(user => user.id !== id)
    );
  };
  
  const filteredContent = () => {
    const query = searchQuery.toLowerCase();
    
    switch (activeTab) {
      case 'followers':
        return followers.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.username.toLowerCase().includes(query)
        );
      case 'following':
        return following.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.username.toLowerCase().includes(query)
        );
      case 'suggestions':
        return suggestions.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.username.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };
  
  const content = filteredContent();
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex">
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'following' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('following')}
            >
              Following ({following.length})
            </button>
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'followers' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('followers')}
            >
              Followers ({followers.length})
            </button>
            <button 
              className={`flex-1 py-4 text-center ${activeTab === 'suggestions' 
                ? 'text-[#f67a45] border-b-2 border-[#f67a45]' 
                : 'text-gray-400'}`}
              onClick={() => setActiveTab('suggestions')}
            >
              Suggestions
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
            </div>
          ) : content.length > 0 ? (
            <div className="space-y-4">
              {content.map(user => (
                <motion.div 
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-[#1A1A2F] rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img 
                        src={`${BASE_URL}/${user.profileImage}` || '/src/assets/profile1.png'}
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{user.name}</h4>
                      <p className="text-gray-400 text-sm">{user.username}</p>
                      {activeTab === 'suggestions' && user.mutualFriends > 0 && (
                        <p className="text-xs text-gray-400">{user.mutualFriends} mutual friends</p>
                      )}
                    </div>
                  </div>
                  
                  {activeTab === 'followers' && (
                    <button 
                      className={`px-4 py-2 rounded-full ${user.isFollowing 
                        ? 'bg-[#1A1A2F] border border-gray-600 text-white hover:bg-[#1A1A2F]/70' 
                        : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'}`}
                      onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                    >
                      {user.isFollowing ? 'Following' : 'Follow Back'}
                    </button>
                  )}
                  
                  {activeTab === 'following' && (
                    <button 
                      className="px-4 py-2 rounded-full bg-[#1A1A2F] border border-gray-600 text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-400"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Unfollow
                    </button>
                  )}
                  
                  {activeTab === 'suggestions' && (
                    <button 
                      className="px-4 py-2 rounded-full bg-[#f67a45] text-white hover:bg-[#e56d3d] flex items-center gap-2"
                      onClick={() => handleFollow(user.id)}
                    >
                      <FaUserPlus size={14} />
                      <span>Follow</span>
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">
                {activeTab === 'followers' 
                  ? "You don't have any followers yet." 
                  : activeTab === 'following' 
                    ? "You aren't following anyone yet."
                    : "No suggestions available."}
              </p>
              
              {activeTab === 'following' && (
                <button className="mt-4 bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors">
                  Find People to Follow
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsManagement;
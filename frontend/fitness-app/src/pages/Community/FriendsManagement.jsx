import React, { useState } from 'react';
import { FaUserPlus, FaUserMinus, FaComment, FaCircle, FaSearch } from 'react-icons/fa';

const FriendsManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock friends data (in a real app, this would come from an API)
  const [friends, setFriends] = useState([
    { id: 1, name: 'Sarah Johnson', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '', status: 'Good workout today! 💪' },
    { id: 2, name: 'Mike Peterson', image: '/src/assets/profile1.png', isOnline: false, lastSeen: '2h ago', status: 'Training for the marathon' },
    { id: 3, name: 'Jen Wilson', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '', status: 'Yoga session completed' },
    { id: 4, name: 'Tom Bradley', image: '/src/assets/profile1.png', isOnline: false, lastSeen: '1d ago', status: 'Rest day today' },
    { id: 5, name: 'Emma Clark', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '', status: 'New PR on deadlifts!' }
  ]);
  
  const tabs = [
    { id: 'all', label: 'All Friends' },
    { id: 'online', label: 'Online' },
    { id: 'requests', label: 'Requests' }
  ];
  
  // Mock friend requests data
  const friendRequests = [
    { id: 101, name: 'Alex Morgan', image: '/src/assets/profile1.png', mutualFriends: 3 },
    { id: 102, name: 'Chris Davis', image: '/src/assets/profile1.png', mutualFriends: 1 }
  ];
  
  // Filter friends based on active tab and search term
  const getFilteredFriends = () => {
    let filtered = friends;
    
    if (activeTab === 'online') {
      filtered = filtered.filter(friend => friend.isOnline);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Remove a friend
  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };
  
  // Accept a friend request
  const handleAcceptRequest = (request) => {
    // In a real app, you would call an API here
    setFriends([...friends, {
      id: request.id,
      name: request.name,
      image: request.image,
      isOnline: false,
      lastSeen: 'Just now',
      status: ''
    }]);
    
    // Remove from requests
    // This would be handled by the API in a real app
  };

  return (
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
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
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
                    onClick={() => handleRemoveFriend(friend.id)}
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
      
      {/* Suggestions */}
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
  );
};

export default FriendsManagement;

import React, { useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const FriendsSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock friends data
  const friendsList = [
    { id: 1, name: 'Sarah Johnson', image: '/src/assets/trainers/trainer2.png', online: true },
    { id: 2, name: 'Mike Chen', image: '/src/assets/trainers/trainer3.png', online: true },
    { id: 3, name: 'Alex Rivera', image: '/src/assets/trainers/trainer5.png', online: false },
    { id: 4, name: 'Lisa Wong', image: '/src/assets/trainers/trainer6.png', online: false },
    { id: 5, name: 'David Kim', image: '/src/assets/trainers/trainer7.png', online: true },
  ];
  
  // Filter friends based on search query
  const filteredFriends = friendsList.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hidden lg:block w-[300px]">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-24">
        <h3 className="text-white text-lg font-medium mb-4">Friends</h3>
        
        {/* Friends Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        {/* Friends List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {filteredFriends.map(friend => (
            <div key={friend.id} className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={friend.image} 
                    alt={friend.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/profile1.png';
                    }}
                  />
                </div>
                <span className={`absolute bottom-0 right-1 w-3 h-3 ${friend.online ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-[#121225]`}></span>
              </div>
              <span className="text-white">{friend.name}</span>
            </div>
          ))}
        </div>
        
        {/* See All Friends Button */}
        <button className="w-full mt-4 bg-[#1A1A2F] border border-gray-700 text-white py-2 rounded-lg hover:bg-[#f67a45]/10 hover:border-[#f67a45]/30 transition-colors">
          See All Friends
        </button>
        
        {/* Find New Friends */}
        <button className="w-full mt-3 bg-[#f67a45] text-white py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2">
          <FaUserPlus size={16} />
          <span>Add New Friends</span>
        </button>
      </div>
    </div>
  );
};

export default FriendsSidebar;
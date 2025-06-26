import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';

const FriendsSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axiosInstance.get(`${API_PATHS.FOLLOW.GET_FRIENDS}`);
        if (res.data.success) {
          setFriendsList(res.data.friends);
        }
      } catch (err) {
        console.error('Failed to load friends:', err);
      }
    };

    fetchFriends();
  }, []);
  
  // Filter friends based on search query
  const filteredFriends = friendsList.filter(friend => 
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hidden lg:block w-[300px]">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 sticky top-25">
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
            <div key={friend._id} className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={friend.profileImageUrl ? `${BASE_URL}/${friend.profileImageUrl}` : '/src/assets/profile1.png'}
                    alt={friend.fullName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/profile1.png';
                    }}
                  />
                </div>
                {/* <span className={`absolute bottom-0 right-1 w-3 h-3 ${friend.online ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-[#121225]`}></span> */}
              </div>
              <span className="text-white">{friend.fullName}</span>
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
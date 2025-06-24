import React, { useState } from 'react';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

const SearchPanel = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data (in a real app, this would come from an API search)
  const allUsers = [
    { id: 1, name: 'Sarah Johnson', username: 'sarahj', image: '/src/assets/profile1.png', bio: 'Fitness enthusiast | Marathon runner' },
    { id: 2, name: 'Mike Peterson', username: 'mikep', image: '/src/assets/profile1.png', bio: 'Weightlifting | Nutrition coach' },
    { id: 3, name: 'Jen Wilson', username: 'jenw', image: '/src/assets/profile1.png', bio: 'Yoga instructor | Mindfulness practitioner' },
    { id: 4, name: 'Tom Bradley', username: 'tomb', image: '/src/assets/profile1.png', bio: 'CrossFit athlete | Personal trainer' },
    { id: 5, name: 'Emma Clark', username: 'emmac', image: '/src/assets/profile1.png', bio: 'Runner | Plant-based diet advocate' }
  ];
  
  // Filter users based on search term
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-white text-2xl font-bold mb-4">Search People</h2>
      
      {/* Search Input */}
      <div className="bg-[#121225] rounded-xl p-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, username, or interests..."
            className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Results List */}
      <div className="space-y-4">
        {searchTerm ? (
          filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="bg-[#121225] rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => onSelectUser(user)}>
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/profile1.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{user.name}</h4>
                    <p className="text-gray-400 text-sm truncate">@{user.username}</p>
                  </div>
                </div>
                <button className="ml-4 bg-[#f67a45]/20 text-[#f67a45] p-2 rounded-full hover:bg-[#f67a45]/30 transition-colors">
                  <FaUserPlus />
                </button>
              </div>
            ))
          ) : (
            <div className="bg-[#121225] rounded-xl p-6 text-center">
              <p className="text-gray-400">No users found matching "{searchTerm}"</p>
            </div>
          )
        ) : (
          <div className="bg-[#121225] rounded-xl p-6 text-center">
            <p className="text-gray-400">Start typing to search for users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

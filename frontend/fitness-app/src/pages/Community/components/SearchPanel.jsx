import React, { useState, useEffect } from 'react';
import { FaSearch, FaUserPlus, FaEllipsisH } from 'react-icons/fa';

const SearchPanel = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Sample user data
  const users = [
    {
      id: 1,
      name: 'Nipuna Lakruwan',
      username: '@nipuna',
      profileImage: '/src/assets/profile1.png',
      bio: 'Fitness enthusiast | Software Engineer | Love hiking and outdoor activities',
      posts: 42,
      followers: 1024,
      following: 350,
      isFollowing: false,
    },
    {
      id: 2,
      name: 'Sewmina Fernando',
      username: '@sewmina',
      profileImage: '/src/assets/trainers/trainer2.png',
      bio: 'Personal Trainer | Nutrition Specialist | Helping you achieve your fitness goals',
      posts: 87,
      followers: 3245,
      following: 420,
      isFollowing: true,
    },
    {
      id: 3,
      name: 'Devin Perera',
      username: '@devin',
      profileImage: '/src/assets/trainers/trainer3.png',
      bio: 'CrossFit Coach | Marathon Runner | Believe in pushing your limits',
      posts: 65,
      followers: 2100,
      following: 180,
      isFollowing: false,
    },
    {
      id: 4,
      name: 'Malaka Perera',
      username: '@malaka',
      profileImage: '/src/assets/trainers/trainer5.png',
      bio: 'Bodybuilding Champion | Fitness Model | Sharing my journey to inspire others',
      posts: 102,
      followers: 5678,
      following: 235,
      isFollowing: true,
    },
    {
      id: 5,
      name: 'Pasindu Deshan',
      username: '@pasindu',
      profileImage: '/src/assets/trainers/trainer7.png',
      bio: 'Yoga Instructor | Meditation Guide | Finding balance in life',
      posts: 54,
      followers: 2890,
      following: 310,
      isFollowing: false,
    },
  ];

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const results = users.filter(user => {
        const fullNameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const usernameMatch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
        return fullNameMatch || usernameMatch;
      });
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
        <h3 className="text-white text-xl font-bold mb-6">Search Users</h3>
        
        {/* Search Input */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {/* Search Results */}
        <div>
          {isSearching ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
            </div>
          ) : searchQuery.trim() !== '' && searchResults.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/70">No users found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map(user => (
                <div 
                  key={user.id}
                  className="bg-[#1A1A2F] p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#242440] transition duration-200"
                  onClick={() => onSelectUser(user)}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img 
                        src={user.profileImage} 
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
                    </div>
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-full ${user.isFollowing 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle follow/unfollow logic
                    }}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
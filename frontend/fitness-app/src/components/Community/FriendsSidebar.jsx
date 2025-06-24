import React from 'react';
import { FaCircle } from 'react-icons/fa';

const FriendsSidebar = () => {
  // Mock friends data (in real app, this would come from props or API)
  const friends = [
    { id: 1, name: 'Sarah Johnson', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '' },
    { id: 2, name: 'Mike Peterson', image: '/src/assets/profile1.png', isOnline: false, lastSeen: '2h ago' },
    { id: 3, name: 'Jen Wilson', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '' },
    { id: 4, name: 'Tom Bradley', image: '/src/assets/profile1.png', isOnline: false, lastSeen: '1d ago' },
    { id: 5, name: 'Emma Clark', image: '/src/assets/profile1.png', isOnline: true, lastSeen: '' }
  ];

  return (
    <div className="bg-[#121225] rounded-xl p-6 w-[260px]">
      <h3 className="text-white font-semibold mb-4">Friends</h3>
      
      <div className="space-y-4">
        {friends.map(friend => (
          <div key={friend.id} className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={friend.image} 
                alt={friend.name} 
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/profile1.png';
                }}
              />
              <div className={`absolute -bottom-1 -right-1 ${friend.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                <FaCircle size={10} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{friend.name}</p>
              <p className="text-gray-400 text-xs">
                {friend.isOnline ? 'Online' : friend.lastSeen}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 text-[#f67a45] text-sm hover:underline w-full text-center">
        View All Friends
      </button>
    </div>
  );
};

export default FriendsSidebar;

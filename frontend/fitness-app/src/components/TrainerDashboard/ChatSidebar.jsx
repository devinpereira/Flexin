import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const ChatSidebar = ({ subscribers, onlineUsers, unreadCounts }) => {
  const navigate = useNavigate();
  const { subscriberId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);

  useEffect(() => {
    if (subscribers) {
      setFilteredSubscribers(
        subscribers.filter(sub =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subscribers]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();

    // Same day
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // This week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    if (messageDate >= weekStart) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }

    // Older
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden h-[70vh] flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search subscribers..."
            className="w-full bg-[#1A1A2F] rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-[#f67a45]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Subscribers List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/trainer/messages/${sub.id}`)}
              className={`p-3 border-b border-gray-700 flex items-center cursor-pointer hover:bg-[#1A1A2F] transition-colors ${subscriberId === sub.id ? 'bg-[#1A1A2F]' : ''
                }`}
            >
              <div className="relative">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/profile1.png';
                  }}
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${onlineUsers.includes(sub.id) ? 'bg-green-500' : 'bg-gray-500'
                  } border-2 border-[#121225]`}></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-white font-medium">{sub.name}</h3>
                  <span className="text-xs text-gray-400">{formatTime(sub.lastMessage?.time)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-sm truncate max-w-[180px]">
                    {sub.lastMessage?.text || "No messages yet"}
                  </p>
                  {unreadCounts[sub.id] > 0 && (
                    <span className="bg-[#f67a45] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {unreadCounts[sub.id]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">No subscribers found</div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

import React from 'react';
import { FaHeart, FaComment, FaUserPlus, FaCheck, FaTimes } from 'react-icons/fa';

const NotificationsPanel = () => {
  // Mock notifications data (in a real app, this would come from an API)
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      type: 'like',
      user: { name: 'Sarah Johnson', image: '/src/assets/profile1.png' },
      content: 'liked your post',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: { name: 'Mike Peterson', image: '/src/assets/profile1.png' },
      content: 'commented on your post: "Great progress! Keep it up!"',
      time: '5 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'Jen Wilson', image: '/src/assets/profile1.png' },
      content: 'started following you',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'follow_request',
      user: { name: 'Tom Bradley', image: '/src/assets/profile1.png' },
      content: 'wants to follow you',
      time: '2 days ago',
      read: true,
      pending: true
    }
  ]);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Handle follow request response
  const handleFollowRequest = (id, accept) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, pending: false, accepted: accept } 
          : notification
      )
    );
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-pink-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'follow':
      case 'follow_request':
        return <FaUserPlus className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-bold">Notifications</h2>
        <button 
          className="text-[#f67a45] text-sm hover:underline"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      
      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-[#121225] rounded-xl p-4 flex items-start gap-3 ${
                !notification.read ? 'border-l-4 border-[#f67a45]' : ''
              }`}
            >
              <div className="p-2 rounded-full bg-[#1A1A2F] flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <img 
                    src={notification.user.image} 
                    alt={notification.user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/src/assets/profile1.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white">
                      <span className="font-medium">{notification.user.name}</span> {notification.content}
                    </p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                </div>
                
                {notification.type === 'follow_request' && notification.pending && (
                  <div className="flex gap-2 mt-2">
                    <button 
                      className="bg-[#f67a45] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      onClick={() => handleFollowRequest(notification.id, true)}
                    >
                      <FaCheck size={12} />
                      Accept
                    </button>
                    <button 
                      className="bg-[#1A1A2F] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      onClick={() => handleFollowRequest(notification.id, false)}
                    >
                      <FaTimes size={12} />
                      Decline
                    </button>
                  </div>
                )}
                
                {notification.type === 'follow_request' && !notification.pending && (
                  <p className="text-sm mt-1">
                    {notification.accepted 
                      ? <span className="text-green-500">Request accepted</span> 
                      : <span className="text-gray-400">Request declined</span>}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#121225] rounded-xl p-6 text-center">
            <p className="text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;

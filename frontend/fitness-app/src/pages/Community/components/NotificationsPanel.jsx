import React, { useState, useEffect } from 'react';
import { FaBell, FaUserPlus, FaHeart, FaComment } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching notifications
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for notifications
        const mockNotifications = [
          {
            id: 1,
            type: 'like',
            user: {
              name: 'Sewmina Fernando',
              username: '@sewmina',
              profileImage: '/src/assets/trainers/trainer2.png'
            },
            content: 'liked your post',
            postImage: '/src/assets/posts/workout.png',
            time: '5 minutes ago',
            read: false
          },
          {
            id: 2,
            type: 'comment',
            user: {
              name: 'Devin Perera',
              username: '@devin',
              profileImage: '/src/assets/trainers/trainer3.png'
            },
            content: 'commented on your post: "Great progress! Keep it up!"',
            postImage: '/src/assets/posts/workout1.png',
            time: '2 hours ago',
            read: false
          },
          {
            id: 3,
            type: 'follow',
            user: {
              name: 'Malaka Perera',
              username: '@malaka',
              profileImage: '/src/assets/trainers/trainer5.png'
            },
            content: 'started following you',
            time: '1 day ago',
            read: true
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };
  
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <FaHeart className="text-red-500" />;
      case 'comment': return <FaComment className="text-blue-400" />;
      case 'follow': return <FaUserPlus className="text-green-400" />;
      default: return <FaBell className="text-[#f67a45]" />;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-xl font-bold">Notifications</h3>
          {notifications.some(n => !n.read) && (
            <button 
              className="text-sm text-[#f67a45] hover:underline"
              onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
            >
              Mark all as read
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <motion.div 
                key={notification.id}
                className={`p-4 rounded-lg flex items-start ${notification.read ? 'bg-[#1A1A2F]' : 'bg-[#1A1A2F]/80 border-l-4 border-[#f67a45]'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="mr-4 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={notification.user.profileImage} 
                        alt={notification.user.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/profile1.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-medium">{notification.user.name}</span> {notification.content}
                      </p>
                      <p className="text-gray-400 text-sm">{notification.time}</p>
                    </div>
                  </div>
                  
                  {notification.postImage && (
                    <div className="mt-3 ml-12">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={notification.postImage} 
                          alt="Post" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {!notification.read && (
                  <div className="w-3 h-3 rounded-full bg-[#f67a45] flex-shrink-0 mt-1"></div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-block p-4 rounded-full bg-[#1A1A2F] mb-4">
              <FaBell size={24} className="text-[#f67a45]" />
            </div>
            <p className="text-white font-medium">No notifications yet</p>
            <p className="text-gray-400 mt-2">When you get notifications, they'll show up here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
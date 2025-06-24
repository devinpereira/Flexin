import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../../components/Community/CommunityLayout';
import Navigation from '../../components/Navigation';
import Sidebar from './components/Sidebar';
import PostFeed from './components/PostFeed';
import FriendsSidebar from './components/FriendsSidebar';
import SearchPanel from './components/SearchPanel';
import UserProfile from './components/UserProfile';
import NotificationsPanel from './components/NotificationsPanel';
import Profile from './components/Profile';
import FriendsManagement from './components/FriendsManagement';
import { motion } from 'framer-motion';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import { BASE_URL } from '../../utils/apiPaths';

const Community = () => {
  useUserAuth();
  const { user: contextUser, loading } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState('Home');
  const [selectedUser, setSelectedUser] = useState(null);
  const [user, setUser] = useState(contextUser);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setUser(contextUser);
  }, [contextUser]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedUser(null);
  };
  
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  
  const handleBackToSearch = () => {
    setSelectedUser(null);
  };

  // if (loading) {
  //   return <div className="text-white text-center mt-20">Loading user...</div>;
  // }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto flex relative">
        {/* Left Sidebar - Fixed width, full height */}
        <div className="fixed top-16 left-0 bottom-0 w-[240px] z-10 overflow-hidden">
          <div className="h-full">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              name={user?.fullName}
              username={`@${user?.username}`}
              profileImage={user?.profileImageUrl ? `${BASE_URL}/${user?.profileImageUrl}` : "src/assets/profile1.png"}
            />
          </div>
        </div>
        
        {/* Main Content - Add left margin to avoid overlap with sidebar */}
        <motion.div 
          className="flex-grow ml-[240px] px-4 pt-6 pb-10 max-w-[calc(100%-540px)]"
          key={activeSection + (selectedUser ? selectedUser.id : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'Home' && <PostFeed profileImage={user?.profileImageUrl ? `${BASE_URL}/${user?.profileImageUrl}` : "src/assets/profile1.png"} />}
          
          {activeSection === 'Search' && !selectedUser && (
            <SearchPanel onSelectUser={handleSelectUser} />
          )}
          
          {activeSection === 'Search' && selectedUser && (
            <UserProfile user={selectedUser} onBack={handleBackToSearch} />
          )}
          
          {activeSection === 'Notifications' && <NotificationsPanel />}
          
          {activeSection === 'Create' && <PostFeed profileImage={user?.profileImageUrl ? `${BASE_URL}/${user?.profileImageUrl}` : "src/assets/profile1.png"} />}
          
          {activeSection === 'Friends' && <FriendsManagement />}
          
          {activeSection === 'Profile' && <Profile />}
        </motion.div>
        
        {/* Right Sidebar - Fixed width */}
        <div className="fixed top-30 right-23 bottom-0 px-4 pt-6 overflow-y-auto">
          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
};

export default Community;
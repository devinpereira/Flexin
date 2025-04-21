import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useUserAuth } from "../../hooks/useUserAuth";

const Community = () => {
  useUserAuth();
  const [activeSection, setActiveSection] = useState('Home');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedUser(null); // Clear selected user when changing sections
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleBackToSearch = () => {
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto pt-8 px-4 flex">
        {/* Left Sidebar */}
        <div className="w-[275px] flex-shrink-0">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
          />
        </div>
        
        {/* Main Content */}
        <motion.div 
          className="flex-grow mx-4 pb-10"
          key={activeSection + (selectedUser ? selectedUser.id : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'Home' && <PostFeed />}
          
          {activeSection === 'Search' && !selectedUser && (
            <SearchPanel onSelectUser={handleSelectUser} />
          )}
          
          {activeSection === 'Search' && selectedUser && (
            <UserProfile user={selectedUser} onBack={handleBackToSearch} />
          )}
          
          {activeSection === 'Notifications' && <NotificationsPanel />}
          
          {activeSection === 'Create' && <PostFeed />}
          
          {activeSection === 'Friends' && <FriendsManagement />}
          
          {activeSection === 'Profile' && <Profile />}
        </motion.div>
        
        {/* Right Sidebar - Friends */}
        <div className="w-[300px] flex-shrink-0">
          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
};

export default Community;
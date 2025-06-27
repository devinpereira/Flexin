import React, { useContext, useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/Community/Sidebar';
import FriendsSidebar from '../../components/Community/FriendsSidebar';
import { motion } from 'framer-motion';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import { BASE_URL } from '../../utils/apiPaths';

// Import section components
import Home from './sections/Home';
import Search from './sections/Search';
import Notifications from './sections/Notifications';
import Friends from './sections/Friends';
import Profile from './sections/Profile';
import UserProfile from '../../components/Community/UserProfile.jsx';

const Community = () => {
  useUserAuth();

  const { user, loading } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState('Search');

  // Used for viewing other user profiles via search
  const [selectedUser, setSelectedUser] = useState(null);

  // Handler for navigating between sections
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedUser(null);
  };

  // Handler for selecting a user from search results
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Handler for returning to search from user profile view
  const handleBackToSearch = () => {
    setSelectedUser(null);
  };

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
          {/* Conditionally render content based on active section */}
          {activeSection === 'Home' && (
            <Home
              profileImage={user?.profileImageUrl ? `${BASE_URL}/${user?.profileImageUrl}` : "src/assets/profile1.png"}
            />
          )}

          {activeSection === 'Search' && !selectedUser && (
            <Search onSelectUser={handleSelectUser} />
          )}

          {activeSection === 'Search' && selectedUser && (
            <UserProfile user={selectedUser} onBack={handleBackToSearch} />
          )}

          {activeSection === 'Notifications' && <Notifications />}

          {activeSection === 'Create' && (
            <Home
              profileImage={user?.profileImageUrl ? `${BASE_URL}/${user?.profileImageUrl}` : "src/assets/profile1.png"}
              createMode={true}
            />
          )}

          {activeSection === 'Friends' && <Friends />}

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
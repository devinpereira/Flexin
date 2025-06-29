import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import Sidebar from './Sidebar';
import FriendsSidebar from './FriendsSidebar';
import { motion } from 'framer-motion';

const CommunityLayout = ({ children, activeSection, onSectionChange, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto flex relative">
        {/* Left Sidebar - Fixed position for desktop */}
        <div className="fixed top-16 left-0 bottom-0 w-[240px] z-10 overflow-hidden">
          <div className="h-full">
            <Sidebar 
              activeSection={activeSection} 
              onSectionChange={onSectionChange}
              name={user?.fullName}
              username={`@${user?.username}`}
              profileImage={user?.profileImageUrl}
            />
          </div>
        </div>
        
        {/* Main Content - Animation from framer-motion */}
        <motion.div 
          className="flex-grow ml-[240px] px-4 pt-6 pb-10 max-w-[calc(100%-540px)]"
          key={activeSection + (location.pathname)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
        
        {/* Right Sidebar - Fixed position for desktop */}
        <div className="fixed top-30 right-23 bottom-0 px-4 pt-6 overflow-y-auto">
          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;

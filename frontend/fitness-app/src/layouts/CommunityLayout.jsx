import React, { useContext, useState, useEffect, Children } from "react";
import Navigation from "../components/Navigation";
import Sidebar from "../components/Community/Sidebar";
import FriendsSidebar from "../components/Community/FriendsSidebar";
import { motion } from "framer-motion";
import { useUserAuth } from "../hooks/useUserAuth";
import { UserContext } from "../context/UserContext";
import { BASE_URL } from "../utils/apiPaths";

const CommunityLayout = ({ children, activeSection }) => {
  useUserAuth();

  const { user, loading } = useContext(UserContext);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        background: "linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)",
      }}
    >
      <Navigation />

      <div className="container mx-auto flex relative">
        {/* Left Sidebar - Fixed width, full height */}
        <div className="fixed top-16 left-0 bottom-0 w-[240px] z-10 overflow-hidden">
          <div className="h-full">
            <Sidebar
              activeSection={activeSection}
              name={user?.fullName}
              username={`@${user?.username}`}
              profileImage={
                user?.profileImageUrl
                  ? `${BASE_URL}/${user?.profileImageUrl}`
                  : "src/assets/profile1.png"
              }
            />
          </div>
        </div>

        {/* Main Content - Add left margin to avoid overlap with sidebar */}
        <motion.div
          className="flex-grow ml-[240px] px-4 pt-6 pb-10 max-w-[calc(100%-540px)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>

        {/* Right Sidebar - Fixed width */}
        <div className="fixed top-30 right-23 bottom-0 px-4 pt-6 overflow-y-auto">
          <FriendsSidebar />
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;

import React, { useContext } from 'react';
import {
  FaHome,
  FaSearch,
  FaBell,
  FaPlus,
  FaUserFriends,
  FaUser
} from 'react-icons/fa';

/**
 * Sidebar - Navigation component for the Community module
 * 
 * This component provides a fixed sidebar navigation with user profile display
 * and navigation between different community sections.
 * 
 * Features:
 * - User profile display
 * - Navigation links with icons
 * - Active section highlighting
 * - Click handlers for section navigation
 * - Fixed position for persistent access
 * 
 * @param {string} activeSection - The currently active section ID
 * @param {Function} onSectionChange - Handler for section changes
 * @param {string} name - User's display name
 * @param {string} username - User's username
 * @param {string} profileImage - URL for the user's profile image
 */
const Sidebar = ({ activeSection, onSectionChange, name, username, profileImage }) => {
  // Navigation menu definition
  const menuItems = [
    { id: 'Home', label: 'Home', icon: <FaHome size={20} /> },
    { id: 'Search', label: 'Search', icon: <FaSearch size={20} /> },
    { id: 'Notifications', label: 'Notifications', icon: <FaBell size={20} /> },
    { id: 'Create', label: 'Create', icon: <FaPlus size={20} /> },
    { id: 'Friends', label: 'Friends', icon: <FaUserFriends size={20} /> },
    { id: 'Profile', label: 'Profile', icon: <FaUser size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-50 z-10 h-screen">
      <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full flex flex-col">
        {/* User Profile Section */}
        <div className="flex flex-col items-center mb-8 pt-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-white text-xl font-medium">{name || "Loading..."}</h3>
          <p className="text-gray-400">{username || "@loading"}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 w-full ${activeSection === item.id
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
              onClick={() => onSectionChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
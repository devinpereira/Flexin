import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaSearch,
  FaBell,
  FaPlus,
  FaUserFriends,
  FaUser
} from 'react-icons/fa';

const Sidebar = ({ name, username, profileImage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu definitions
  const menuItems = [
    { id: 'Home', label: 'Home', icon: <FaHome size={20} />, path: '/community/home' },
    { id: 'Search', label: 'Search', icon: <FaSearch size={20} />, path: '/community/search' },
    { id: 'Notifications', label: 'Notifications', icon: <FaBell size={20} />, path: '/community/notifications' },
    { id: 'Create', label: 'Create', icon: <FaPlus size={20} />, path: '/community/create' },
    { id: 'Friends', label: 'Friends', icon: <FaUserFriends size={20} />, path: '/community/friends' },
    { id: 'Profile', label: 'Profile', icon: <FaUser size={20} />, path: '/community/profile' },
  ];

  // Get current path
  const currentPath = location.pathname;

  return (
    <div className="fixed left-0 top-50 z-10 h-screen">
      <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full flex flex-col">
        {/* User Profile */}
        <div className="flex flex-col items-center mb-8 pt-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
            <img src={profileImage} alt={name} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-white text-xl font-medium">{name || "Loading..."}</h3>
          <p className="text-gray-400">{username || "@loading"}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map(item => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 w-full ${isActive
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
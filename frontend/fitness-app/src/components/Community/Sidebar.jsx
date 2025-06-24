import React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { FaSearch, FaUserFriends } from 'react-icons/fa';
import { IoMdNotifications } from 'react-icons/io';
import { RiAddCircleFill } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';

const Sidebar = ({ activeSection, onSectionChange, name, username, profileImage }) => {
  const menuItems = [
    { id: 'Home', icon: <AiFillHome size={24} /> },
    { id: 'Search', icon: <FaSearch size={24} /> },
    { id: 'Notifications', icon: <IoMdNotifications size={24} /> },
    { id: 'Create', icon: <RiAddCircleFill size={24} /> },
    { id: 'Friends', icon: <FaUserFriends size={24} /> },
    { id: 'Profile', icon: <CgProfile size={24} /> }
  ];

  return (
    <div className="bg-[#121225] h-full rounded-tr-xl py-8 px-6">
      {/* User Profile Card */}
      <div className="flex flex-col items-center mb-10">
        <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
        <h3 className="text-white font-medium text-lg">{name || "User Name"}</h3>
        <p className="text-gray-400 text-sm">{username || "@username"}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-4">
        {menuItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-[#f67a45] text-white font-medium'
                : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
            }`}
            onClick={(e) => {
              e.preventDefault();
              onSectionChange(item.id);
            }}
          >
            {item.icon}
            <span>{item.id}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

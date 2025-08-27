import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaEnvelope,
  FaChartBar,
  FaUser,
  FaCommentDots,
  FaCog,
} from "react-icons/fa";

const menuItems = [
  {
    id: "Dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt size={20} />,
    path: "/trainer/dashboard",
  },
  {
    id: "Subscribers",
    label: "Subscribers",
    icon: <FaUsers size={20} />,
    path: "/trainer/subscribers",
  },
  {
    id: "Messages",
    label: "Messages",
    icon: <FaEnvelope size={20} />,
    path: "/trainer/messages",
  },
  {
    id: "Analytics",
    label: "Analytics",
    icon: <FaChartBar size={20} />,
    path: "/trainer/analytics",
  },
  {
    id: "Profile",
    label: "Profile",
    icon: <FaUser size={20} />,
    path: "/trainer/profile",
  },
  {
    id: "Feedbacks",
    label: "Feedbacks",
    icon: <FaCommentDots size={20} />,
    path: "/trainer/feedbacks",
  },
  {
    id: "Settings",
    label: "Settings",
    icon: <FaCog size={20} />,
    path: "/trainer/settings",
  },
];

const Sidebar = ({ activeSection, name, trainer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileImg = trainer?.profilePicture || "/src/assets/profile1.png";

  return (
    <nav className="bg-[#03020d] rounded-tr-[30px] w-[240px] p-6 h-full flex flex-col mt-25">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-8 pt-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <img
            src={trainer?.profilePhoto || "/src/assets/profile1.png"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-white text-xl font-medium">{trainer?.name}</h3>
        <p className="text-gray-400">Trainer</p>
      </div>
      <div className="border-t border-gray-700 mb-6"></div>
      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 w-full ${
                isActive || activeSection === item.id
                  ? "bg-[#f67a45] text-white font-medium"
                  : "text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]"
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
  );
};

export default Sidebar;

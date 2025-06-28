import React from 'react';
import { FaPen, FaCamera, FaSignOutAlt } from 'react-icons/fa';

const SettingsModal = ({ onClose, onEditProfile, onLogout }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A1A2F] rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-xl font-bold mb-4">Settings</h3>
        <div className="space-y-3">
          <button
            onClick={onEditProfile}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-white flex items-center gap-2"
          >
            <FaPen /> Edit Profile
          </button>
          <button
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-white flex items-center gap-2"
          >
            <FaCamera /> Change Profile Picture
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#242440] text-red-400 flex items-center gap-2"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

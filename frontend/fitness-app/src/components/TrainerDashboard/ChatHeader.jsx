import React, { useState } from 'react';
import { FaPhoneAlt, FaEllipsisV } from 'react-icons/fa';

const ChatHeader = ({ subscriber, onShowAppointmentModal }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-[#1A1A2F] p-3 sm:p-4 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center">
        <div className="relative">
          <img
            src={subscriber?.image || "/src/assets/profile1.png"}
            alt={subscriber?.name || "Subscriber"}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/src/assets/profile1.png';
            }}
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            subscriber?.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'
          } border-2 border-[#1A1A2F]`}></div>
        </div>
        <div className="ml-3">
          <h3 className="text-white font-medium">{subscriber?.name}</h3>
          <p className="text-gray-400 text-xs flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
              subscriber?.isTyping ? 'bg-green-500 animate-pulse' : 'hidden'
            }`}></span>
            {subscriber?.isTyping ? 'Typing...' : subscriber?.status}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="bg-[#f67a45]/20 text-[#f67a45] p-2 rounded-full hover:bg-[#f67a45]/30"
          onClick={onShowAppointmentModal}
        >
          <FaPhoneAlt size={16} />
        </button>
        <div className="relative">
          <button
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-[#f67a45]/20"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaEllipsisV size={16} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-[#121225] border border-gray-700 rounded-lg shadow-lg z-10 w-48">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-[#1A1A2F] text-white cursor-pointer text-sm">
                  Clear conversation
                </li>
                <li className="px-4 py-2 hover:bg-[#1A1A2F] text-white cursor-pointer text-sm">
                  Block subscriber
                </li>
                <li className="px-4 py-2 hover:bg-[#1A1A2F] text-white cursor-pointer text-sm">
                  Export chat
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

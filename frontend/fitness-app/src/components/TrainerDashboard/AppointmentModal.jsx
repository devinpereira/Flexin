import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const AppointmentModal = ({ subscriber, onClose, onSchedule }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121225] rounded-xl max-w-md w-full p-4 sm:p-6 border border-gray-700 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-bold">Schedule a Call</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <MdClose size={20} />
          </button>
        </div>

        <p className="text-white/70 mb-4">
          Set up a video call with {subscriber?.name} to discuss their fitness goals in detail.
        </p>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#f67a45]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Select Time</label>
          <input
            type="time"
            className="w-full px-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#f67a45]"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (date && time) {
                onSchedule({ date, time });
              }
            }}
            className={`px-4 py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d] transition-colors ${!date || !time ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={!date || !time}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;

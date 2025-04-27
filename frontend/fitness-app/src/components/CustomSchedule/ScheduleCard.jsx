import React from 'react';
import { FaCalendarAlt, FaClock, FaDumbbell } from 'react-icons/fa';

const ScheduleCard = ({ schedule, onClick }) => {
  // Calculate total exercises across all days
  const totalExercises = Object.values(schedule.exercises || {}).reduce(
    (sum, exercises) => sum + exercises.length,
    0
  );
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <div
      onClick={onClick}
      className="bg-[#1A1A2F] rounded-lg p-5 cursor-pointer hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 relative overflow-hidden border border-[#f67a45]/10"
    >
      {/* Indicator for workout days */}
      <div className="absolute top-0 right-0 flex">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
          const isActive = schedule.days.some(scheduleDay => 
            scheduleDay.toLowerCase().startsWith(day.toLowerCase())
          );
          return (
            <div
              key={day}
              className={`w-1.5 h-6 ${
                isActive ? 'bg-[#f67a45]' : 'bg-gray-700'
              }`}
            ></div>
          );
        })}
      </div>

      {/* Card content */}
      <h3 className="text-white text-lg font-bold mb-3">{schedule.name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-white/70">
          <FaCalendarAlt className="mr-2 text-[#f67a45]" size={14} />
          <p className="text-sm">Created: {formatDate(schedule.createdAt)}</p>
        </div>
        <div className="flex items-center text-white/70">
          <FaDumbbell className="mr-2 text-[#f67a45]" size={14} />
          <p className="text-sm">{totalExercises} exercises • {schedule.days.length} days</p>
        </div>
        <div className="flex items-center text-white/70">
          <FaClock className="mr-2 text-[#f67a45]" size={14} />
          <p className="text-sm">Est. time: {Math.max(30, totalExercises * 3)} mins</p>
        </div>
      </div>
      
      {/* Days pill badges */}
      <div className="flex flex-wrap gap-1">
        {schedule.days.map((day) => (
          <span
            key={day}
            className="bg-[#121225] text-xs text-white/80 px-2 py-1 rounded-full"
          >
            {day.slice(0, 3)}
          </span>
        ))}
      </div>
      
      {/* Preview prompt */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A2F] to-transparent py-4 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-[#f67a45] text-sm">Click to view or edit</span>
      </div>
    </div>
  );
};

export default ScheduleCard;
import React from 'react';

const DaysSelector = ({ selectedDays, onChange }) => {
  // All days of the week
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Toggle day selection
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {weekdays.map(day => (
        <button
          key={day}
          type="button"
          onClick={() => toggleDay(day)}
          className={`px-4 py-3 rounded-lg text-center transition-colors ${selectedDays.includes(day)
              ? 'bg-[#f67a45] text-white'
              : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
            }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaysSelector;

import React from 'react';
import { FaCalendarAlt, FaDumbbell, FaEllipsisV } from 'react-icons/fa';

const ScheduleCard = ({ schedule, onClick, onDelete }) => {
  const { id, name, days, exercises } = schedule;
  
  // Calculate total exercises across all days
  const totalExercises = Object.values(exercises || {}).reduce((total, dayExercises) => {
    return total + (dayExercises?.length || 0);
  }, 0);
  
  // Get a list of unique exercise names for preview
  const allExercisesList = [];
  Object.values(exercises || {}).forEach(dayExercises => {
    if (dayExercises) {
      dayExercises.forEach(exercise => {
        if (!allExercisesList.includes(exercise.name)) {
          allExercisesList.push(exercise.name);
        }
      });
    }
  });
  
  // Take just the first 3 for preview
  const previewExercises = allExercisesList.slice(0, 3);
  const hasMoreExercises = allExercisesList.length > 3;
  
  // Handle menu options
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    
    if (confirm("Are you sure you want to delete this schedule?")) {
      onDelete(id);
    }
  };
  
  return (
    <div 
      className="bg-[#1A1A2F] rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 border border-transparent hover:border-[#f67a45]/30"
      onClick={onClick}
    >
      {/* Card Header with gradient overlay */}
      <div className="h-24 bg-gradient-to-r from-[#f67a45]/20 to-[#1A1A2F] p-5 relative">
        <div className="flex justify-between items-start">
          <h3 className="text-white font-bold text-lg truncate pr-8">{name}</h3>
          
          {/* Menu Dropdown */}
          <div className="relative z-10">
            <button 
              className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
              onClick={handleMenuToggle}
            >
              <FaEllipsisV />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-[#121225] border border-[#f67a45]/20 rounded-md shadow-lg py-1 min-w-[150px]">
                <button 
                  className="w-full text-left px-4 py-2 text-white hover:bg-[#f67a45]/10 text-sm"
                  onClick={handleDelete}
                >
                  Delete Schedule
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm mt-2 text-white/70">
          <FaCalendarAlt className="mr-1" />
          <span className="mr-4">{days?.length || 0} days</span>
          <FaDumbbell className="mr-1" />
          <span>{totalExercises} exercises</span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        <h4 className="text-white/70 text-sm mb-2">Included exercises:</h4>
        
        <div className="space-y-2">
          {previewExercises.length > 0 ? (
            <>
              {previewExercises.map((exercise, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#f67a45] mr-2"></div>
                  <span className="text-white text-sm truncate">{exercise}</span>
                </div>
              ))}
              
              {hasMoreExercises && (
                <div className="text-white/50 text-sm italic">
                  +{allExercisesList.length - 3} more exercises
                </div>
              )}
            </>
          ) : (
            <div className="text-white/50 text-sm italic">No exercises added yet</div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-5 pt-0 flex justify-end">
        <button 
          className="text-[#f67a45] text-sm hover:underline"
          onClick={onClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ScheduleCard;
import React, { useState } from 'react';
import { FaEllipsisV, FaEye, FaTrash } from 'react-icons/fa';

const DayExercises = ({ exercises, day, onUpdate, onDelete }) => {
  const [viewingExercise, setViewingExercise] = useState(null);
  
  // Handle menu visibility for each exercise
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const toggleMenu = (exerciseId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === exerciseId ? null : exerciseId);
  };
  
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle updating sets and reps
  const handleSetsChange = (exerciseId, newSets) => {
    onUpdate(day, exerciseId, { sets: newSets });
  };
  
  const handleRepsChange = (exerciseId, newReps) => {
    onUpdate(day, exerciseId, { reps: newReps });
  };
  
  // Handle view exercise details
  const handleViewExercise = (exercise) => {
    setViewingExercise(exercise);
  };

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <div 
          key={exercise.id} 
          className="bg-white rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              {/* Exercise Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={exercise.image} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/exercises/default.jpg';
                  }}
                />
              </div>
              
              {/* Exercise Details */}
              <div className="flex-1">
                <h4 className="font-bold text-[#121225]">{exercise.name}</h4>
                <div className="text-gray-500">{exercise.category}</div>
              </div>
            </div>
            
            {/* Sets and Reps Controls */}
            <div className="flex items-center gap-4">
              {/* Sets dropdown */}
              <div className="flex items-center">
                <label htmlFor={`sets-${exercise.id}`} className="text-[#121225] mr-2 whitespace-nowrap">
                  Sets:
                </label>
                <select 
                  id={`sets-${exercise.id}`}
                  value={exercise.sets}
                  onChange={(e) => handleSetsChange(exercise.id, e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-[#121225] rounded-md px-2 py-1 focus:ring-2 focus:ring-[#f67a45]"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              {/* Reps dropdown */}
              <div className="flex items-center">
                <label htmlFor={`reps-${exercise.id}`} className="text-[#121225] mr-2 whitespace-nowrap">
                  Reps:
                </label>
                <select 
                  id={`reps-${exercise.id}`}
                  value={exercise.reps}
                  onChange={(e) => handleRepsChange(exercise.id, e.target.value)}
                  className="bg-gray-100 border border-gray-300 text-[#121225] rounded-md px-2 py-1 focus:ring-2 focus:ring-[#f67a45]"
                >
                  {[5, 8, 10, 12, 15, 20, 25, 30].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                {/* View Exercise Button */}
                <button
                  onClick={() => handleViewExercise(exercise)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-200"
                  title="View Exercise"
                >
                  <FaEye />
                </button>
                
                {/* Menu Button */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(exercise.id, e)}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-200"
                  >
                    <FaEllipsisV />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openMenuId === exercise.id && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[150px] z-10">
                      <button 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => onDelete(day, exercise.id)}
                      >
                        <FaTrash className="text-red-500" size={14} />
                        <span>Remove Exercise</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Exercise Detail Modal */}
      {viewingExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-[#1A1A2F] p-4">
              <h3 className="text-white text-xl font-bold">Exercise Details</h3>
              <button 
                onClick={() => setViewingExercise(null)}
                className="text-white/70 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              {/* Exercise Image */}
              <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                <img
                  src={viewingExercise.image}
                  alt={viewingExercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/exercises/default.jpg';
                  }}
                />
              </div>
              
              {/* Exercise Info */}
              <div className="bg-[#1A1A2F] rounded-lg p-6">
                <h4 className="text-white text-lg font-bold mb-2">{viewingExercise.name}</h4>
                <div className="flex items-center mb-4">
                  <div className="px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-sm">
                    {viewingExercise.category}
                  </div>
                  <div className="ml-2 px-3 py-1 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-sm">
                    {viewingExercise.sets} sets × {viewingExercise.reps} reps
                  </div>
                </div>
                <h5 className="text-white font-medium mb-2">How to perform:</h5>
                <p className="text-white/70 leading-relaxed">
                  {viewingExercise.description}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-[#1A1A2F] p-4 flex justify-end">
              <button 
                onClick={() => setViewingExercise(null)}
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Set default props
DayExercises.defaultProps = {
  exercises: []
};

export default DayExercises;
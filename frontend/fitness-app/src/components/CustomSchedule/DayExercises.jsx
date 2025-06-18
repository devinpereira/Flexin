import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const DayExercises = ({ exercises, day, onUpdate, onDelete }) => {
  const [editingExercise, setEditingExercise] = useState(null);

  // Handle edit button click
  const handleEditClick = (exercise) => {
    setEditingExercise({ ...exercise });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingExercise(null);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (editingExercise) {
      onUpdate(day, editingExercise.id, {
        name: editingExercise.name,
        sets: parseInt(editingExercise.sets),
        reps: parseInt(editingExercise.reps)
      });
      setEditingExercise(null);
    }
  };

  // Handle input change in edit mode
  const handleInputChange = (field, value) => {
    setEditingExercise(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          className={`bg-[#1A1A2F] rounded-lg p-3 sm:p-4 ${editingExercise?.id === exercise.id ? 'border-2 border-[#f67a45]' : ''
            }`}
        >
          {editingExercise?.id === exercise.id ? (
            // Edit Mode - Responsive layout
            <div>
              <div className="mb-3">
                <label className="block text-white/70 text-xs sm:text-sm mb-1">Exercise Name</label>
                <input
                  type="text"
                  value={editingExercise.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                <div>
                  <label className="block text-white/70 text-xs sm:text-sm mb-1">Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={editingExercise.sets}
                    onChange={(e) => handleInputChange('sets', e.target.value)}
                    className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-xs sm:text-sm mb-1">Reps</label>
                  <input
                    type="number"
                    min="1"
                    value={editingExercise.reps}
                    onChange={(e) => handleInputChange('reps', e.target.value)}
                    className="w-full bg-[#121225] border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 text-white text-sm rounded-md hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 sm:px-4 sm:py-1.5 bg-[#f67a45] text-white text-sm rounded-md hover:bg-[#e56d3d]"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // View Mode - Responsive layout
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center flex-1 mb-3 sm:mb-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
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

                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm sm:text-base">{exercise.name}</h4>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                    <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                      {exercise.sets} sets
                    </span>
                    <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                      {exercise.reps} reps
                    </span>
                    {exercise.category && (
                      <span className="bg-[#f67a45]/20 text-[#f67a45] text-xs px-2 py-0.5 rounded-full">
                        {exercise.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <div className="flex flex-row sm:flex-col">
                  {index > 0 && (
                    <button
                      onClick={() => onUpdate(day, exercise.id, { order: index - 1 })}
                      className="text-white/70 hover:text-white p-1"
                      title="Move Up"
                    >
                      <FaArrowUp size={12} />
                    </button>
                  )}
                  {index < exercises.length - 1 && (
                    <button
                      onClick={() => onUpdate(day, exercise.id, { order: index + 1 })}
                      className="text-white/70 hover:text-white p-1"
                      title="Move Down"
                    >
                      <FaArrowDown size={12} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleEditClick(exercise)}
                  className="text-white/70 hover:text-white p-1"
                  title="Edit"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => onDelete(day, exercise.id)}
                  className="text-white/70 hover:text-red-500 p-1"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {exercises.length === 0 && (
        <div className="text-white/50 text-center py-8 sm:py-10 italic">
          No exercises added yet for {day}
        </div>
      )}
    </div>
  );
};

export default DayExercises;
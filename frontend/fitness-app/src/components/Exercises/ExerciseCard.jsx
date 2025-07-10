import React from 'react';
import { FaEye, FaRegStar, FaStar } from 'react-icons/fa';

const ExerciseCard = ({ exercise, onViewDetails }) => {
  // Helper function to display difficulty stars
  const renderDifficultyStars = (difficulty) => {
    let stars = 0;
    switch(difficulty) {
      case 'Beginner':
        stars = 1;
        break;
      case 'Intermediate':
        stars = 2;
        break;
      case 'Advanced':
        stars = 3;
        break;
      default:
        stars = 1;
    }
    
    return (
      <div className="flex items-center">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-xs">
            {i < stars ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-500" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#121225] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Exercise Image */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={exercise.image} 
          alt={exercise.name} 
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
        />
        <div className="absolute bottom-0 left-0 bg-[#f67a45] text-white px-3 py-1 rounded-tr-lg capitalize text-sm">
          {exercise.bodyPart}
        </div>
      </div>
      
      {/* Exercise Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-medium text-lg">{exercise.name}</h3>
          {renderDifficultyStars(exercise.difficulty)}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-400 text-sm capitalize">
            {exercise.equipment}
          </span>
          
          <button
            onClick={() => onViewDetails(exercise)}
            className="bg-[#1A1A2F] hover:bg-[#f67a45]/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            <FaEye size={14} />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
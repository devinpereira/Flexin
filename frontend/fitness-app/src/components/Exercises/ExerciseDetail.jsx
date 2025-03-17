import React from 'react';
import { FaTimes, FaDumbbell, FaCheck } from 'react-icons/fa';

const ExerciseDetail = ({ exercise, onClose }) => {
  if (!exercise) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A1F] rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors z-10"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            <div className="relative h-72 md:h-full">
              <img 
                src={exercise.image} 
                alt={exercise.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h2 className="text-white text-2xl font-bold">{exercise.name}</h2>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="bg-[#f67a45] px-2 py-0.5 rounded text-sm capitalize">
                    {exercise.bodyPart}
                  </span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-sm capitalize">
                    {exercise.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Details */}
          <div className="md:w-1/2 p-6">
            <div className="space-y-6">
              {/* Instructions */}
              <div>
                <h3 className="text-white text-lg font-medium mb-3">How to Perform</h3>
                <ol className="list-decimal pl-5 space-y-2 text-white/80">
                  {exercise.instructions.split('. ').filter(step => step.trim()).map((step, index) => (
                    <li key={index} className="pl-1">{step.trim()}.</li>
                  ))}
                </ol>
              </div>
              
              {/* Equipment */}
              <div>
                <h3 className="text-white text-lg font-medium mb-2 flex items-center gap-2">
                  <FaDumbbell className="text-[#f67a45]" /> 
                  Equipment
                </h3>
                <p className="text-white/80 capitalize">{exercise.equipment}</p>
              </div>
              
              {/* Muscles */}
              <div>
                <h3 className="text-white text-lg font-medium mb-2 flex items-center gap-2">
                  <FaMuscle className="text-[#f67a45]" /> 
                  Muscles Targeted
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscles.map((muscle, index) => (
                    <span 
                      key={index} 
                      className="bg-[#1A1A2F] text-white/80 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Benefits */}
              <div>
                <h3 className="text-white text-lg font-medium mb-2 flex items-center gap-2">
                  <FaCheck className="text-[#f67a45]" /> 
                  Benefits
                </h3>
                <p className="text-white/80">{exercise.benefits}</p>
              </div>
              
              {/* Tips */}
              <div>
                <h3 className="text-white text-lg font-medium mb-2">Tips for Proper Form</h3>
                <ul className="space-y-1 text-white/80">
                  {generateTips(exercise).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#f67a45] mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Add to Workout button */}
              <button className="w-full bg-[#f67a45] hover:bg-[#e56d3d] text-white py-3 rounded-lg transition-colors font-medium">
                Add to Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate tips based on exercise type
const generateTips = (exercise) => {
  // In a real app, these would be stored in the database with each exercise
  // Here we'll generate some generic tips based on body part
  const generalTips = [
    "Maintain proper breathing throughout the movement.",
    "Focus on control rather than speed.",
    "Keep your core engaged for stability."
  ];
  
  let specificTips = [];
  
  switch(exercise.bodyPart) {
    case 'arms':
      specificTips = [
        "Avoid swinging or using momentum to lift the weight.",
        "Keep your elbows close to your body for most arm exercises."
      ];
      break;
    case 'chest':
      specificTips = [
        "Keep shoulders back and down, away from your ears.",
        "Focus on squeezing your chest at the top of the movement."
      ];
      break;
    case 'back':
      specificTips = [
        "Pull with your back muscles, not your arms.",
        "Keep your shoulders down away from your ears."
      ];
      break;
    case 'legs':
      specificTips = [
        "Keep your knees aligned with your toes.",
        "Push through your heels for better muscle activation."
      ];
      break;
    case 'core':
      specificTips = [
        "Avoid straining your neck during core exercises.",
        "Focus on controlled movements rather than quantity."
      ];
      break;
    default:
      specificTips = [
        "Maintain proper alignment throughout the exercise.",
        "Start with lighter weights to perfect your form."
      ];
  }
  
  return [...specificTips, ...generalTips];
};

export default ExerciseDetail;
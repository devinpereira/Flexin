import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import ExerciseCard from '../../components/Exercises/ExerciseCard';
import ExerciseDetail from '../../components/Exercises/ExerciseDetail';
import {
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const Exercises = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Body part categories
  const bodyParts = [
    'all',
    'arms',
    'back',
    'chest',
    'core',
    'full body',
    'legs',
    'shoulders',
    'cardio',
    'glutes',
    'other'
  ];

  // Load exercises (would normally come from API)
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      // This would be replaced with a real API call
      const sampleExercises = [
        {
          id: 1,
          name: 'Bicep Curl',
          bodyPart: 'arms',
          image: 'https://via.placeholder.com/300x200?text=Bicep+Curl',
          instructions: 'Hold dumbbells with palms facing forward. Curl weights towards shoulders while keeping elbows at sides. Lower back down with control.',
          difficulty: 'beginner',
          equipment: 'dumbbells',
          muscles: ['biceps', 'forearms'],
          benefits: 'Builds bicep strength and improves arm definition'
        },
        {
          id: 2,
          name: 'Push-up',
          bodyPart: 'chest',
          image: 'https://via.placeholder.com/300x200?text=Push-up',
          instructions: 'Start in plank position with hands slightly wider than shoulders. Lower body until chest nearly touches floor. Push back up to starting position.',
          difficulty: 'beginner',
          equipment: 'bodyweight',
          muscles: ['chest', 'shoulders', 'triceps'],
          benefits: 'Strengthens chest, shoulders, triceps, and core'
        },
        {
          id: 3,
          name: 'Squat',
          bodyPart: 'legs',
          image: 'https://via.placeholder.com/300x200?text=Squat',
          instructions: 'Stand with feet shoulder-width apart. Bend knees and lower hips as if sitting in a chair. Keep chest up and back straight. Return to standing position.',
          difficulty: 'beginner',
          equipment: 'bodyweight',
          muscles: ['quadriceps', 'hamstrings', 'glutes'],
          benefits: 'Builds lower body strength and improves mobility'
        },
        {
          id: 4,
          name: 'Pull-up',
          bodyPart: 'back',
          image: 'https://via.placeholder.com/300x200?text=Pull-up',
          instructions: 'Grip pull-up bar with palms facing away. Hang with arms extended. Pull body up until chin is over bar. Lower back down with control.',
          difficulty: 'intermediate',
          equipment: 'pull-up bar',
          muscles: ['latissimus dorsi', 'biceps', 'rhomboids'],
          benefits: 'Builds upper back and arm strength'
        },
        {
          id: 5,
          name: 'Plank',
          bodyPart: 'core',
          image: 'https://via.placeholder.com/300x200?text=Plank',
          instructions: 'Start in push-up position but with weight on forearms. Keep body in straight line from head to heels. Hold position.',
          difficulty: 'beginner',
          equipment: 'bodyweight',
          muscles: ['abdominals', 'lower back'],
          benefits: 'Strengthens core and improves posture'
        },
        {
          id: 6,
          name: 'Burpee',
          bodyPart: 'full body',
          image: 'https://via.placeholder.com/300x200?text=Burpee',
          instructions: 'Begin standing. Drop into squat position and place hands on floor. Kick feet back to plank position. Do a push-up. Jump feet back to squat position. Jump up with arms extended overhead.',
          difficulty: 'advanced',
          equipment: 'bodyweight',
          muscles: ['quadriceps', 'chest', 'shoulders', 'triceps', 'abdominals'],
          benefits: 'Full body strength and cardiovascular conditioning'
        },
        {
          id: 7,
          name: 'Russian Twist',
          bodyPart: 'core',
          image: 'https://via.placeholder.com/300x200?text=Russian+Twist',
          instructions: 'Sit on floor with knees bent and feet lifted. Lean back slightly. Twist torso side to side, touching hands to floor beside hips.',
          difficulty: 'intermediate',
          equipment: 'bodyweight',
          muscles: ['obliques', 'abdominals'],
          benefits: 'Strengthens obliques and improves rotational core strength'
        },
        {
          id: 8,
          name: 'Shoulder Press',
          bodyPart: 'shoulders',
          image: 'https://via.placeholder.com/300x200?text=Shoulder+Press',
          instructions: 'Sit or stand holding dumbbells at shoulder level. Press weights overhead until arms are extended. Lower back to shoulder level.',
          difficulty: 'intermediate',
          equipment: 'dumbbells',
          muscles: ['deltoids', 'triceps'],
          benefits: 'Builds shoulder strength and stability'
        },
        {
          id: 9,
          name: 'Glute Bridge',
          bodyPart: 'glutes',
          image: 'https://via.placeholder.com/300x200?text=Glute+Bridge',
          instructions: 'Lie on back with knees bent and feet flat on floor. Lift hips until body forms straight line from shoulders to knees. Lower back down.',
          difficulty: 'beginner',
          equipment: 'bodyweight',
          muscles: ['glutes', 'hamstrings', 'lower back'],
          benefits: 'Strengthens glutes and improves hip stability'
        },
        {
          id: 10,
          name: 'Deadlift',
          bodyPart: 'back',
          image: 'https://via.placeholder.com/300x200?text=Deadlift',
          instructions: 'Stand with feet hip-width apart. Bend at hips and knees to grasp barbell. Keep back straight. Stand up by extending hips and knees. Lower bar back to ground.',
          difficulty: 'intermediate',
          equipment: 'barbell',
          muscles: ['lower back', 'hamstrings', 'glutes', 'traps'],
          benefits: 'Builds overall posterior chain strength'
        }
      ];

      setExercises(sampleExercises);
      setFilteredExercises(sampleExercises);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter exercises when search query or selected body part changes
  useEffect(() => {
    if (exercises.length === 0) return;

    let filtered = [...exercises];

    // Filter by body part
    if (selectedBodyPart !== 'all') {
      filtered = filtered.filter(exercise => exercise.bodyPart === selectedBodyPart);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscles.some(muscle => muscle.toLowerCase().includes(query)) ||
        exercise.bodyPart.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
  }, [selectedBodyPart, searchQuery, exercises]);

  // Handle body part selection
  const handleBodyPartSelect = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <CalculatorLayout pageTitle="Exercise Library">
      {/* Search and Filter Section - Responsive */}
      <div className="bg-[#121225] rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises, muscles, equipment..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>

          {/* Filter Button - For mobile */}
          <div className="md:hidden w-full">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full bg-[#1A1A2F] border border-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <FaFilter />
              <span>Filter ({selectedBodyPart !== 'all' ? '1' : '0'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Body Part Filter Buttons - Horizontal scroll on mobile, normal on desktop */}
      <div className="mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2 px-1">
          {bodyParts.map(bodyPart => (
            <button
              key={bodyPart}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full capitalize text-xs sm:text-sm whitespace-nowrap ${selectedBodyPart === bodyPart
                  ? 'bg-[#f67a45] text-white'
                  : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
                }`}
              onClick={() => setSelectedBodyPart(bodyPart)}
            >
              {bodyPart}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Exercise Cards - Responsive grid layout */}
      <div className="pb-12">
        {loading ? (
          // Loading skeleton - Responsive grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-[#121225] rounded-lg overflow-hidden animate-pulse">
                <div className="bg-gray-700 h-36 sm:h-48 w-full"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-5 sm:h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onViewDetails={(exercise) => setSelectedExercise(exercise)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#121225] rounded-lg p-6 sm:p-8 text-center">
            <div className="text-white/60 mb-4">No exercises found</div>
            <p className="text-white/40 text-sm sm:text-base">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>

      {/* Mobile Filter Panel - Slide up when open */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 bg-[#121225] rounded-t-3xl p-5 transition-transform duration-300 transform">
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

            <h3 className="text-white text-lg font-bold mb-4">Filter Exercises</h3>

            <div className="mb-6">
              <label className="block text-white mb-2">Body Part</label>
              <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pb-2">
                {bodyParts.map(bodyPart => (
                  <button
                    key={bodyPart}
                    className={`px-3 py-2 rounded-lg capitalize text-sm ${selectedBodyPart === bodyPart
                        ? 'bg-[#f67a45] text-white'
                        : 'bg-[#1A1A2F] text-white'
                      }`}
                    onClick={() => {
                      handleBodyPartSelect(bodyPart);
                      setIsMobileFilterOpen(false);
                    }}
                  >
                    {bodyPart}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="bg-[#f67a45] text-white px-6 py-2 rounded-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </CalculatorLayout>
  );
};

export default Exercises;
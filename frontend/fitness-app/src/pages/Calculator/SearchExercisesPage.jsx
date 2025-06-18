import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import ExerciseCard from '../../components/Exercises/ExerciseCard';
import ExerciseDetail from '../../components/Exercises/ExerciseDetail';

import { FaSearch, FaFilter, FaTimes, FaArrowLeft } from 'react-icons/fa';

const SearchExercisesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [searchQuery, setSearchQuery] = useState(queryParams.get('q') || '');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [returnTo, setReturnTo] = useState(queryParams.get('returnTo') || '/exercise');

  // Mock data for filters
  const muscleGroups = [
    'chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'glutes', 'calves'
  ];

  const equipmentTypes = [
    'bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance bands', 'machine', 'cable', 'medicine ball'
  ];

  // Load exercises
  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      // This would be replaced with a real API call
      const sampleExercises = [
        {
          id: 1,
          name: 'Bench Press',
          muscles: ['chest', 'triceps', 'shoulders'],
          equipment: 'barbell',
          image: 'https://via.placeholder.com/300x200?text=Bench+Press',
          instructions: 'Lie on a bench, lower the barbell to your chest, then push it back up to the starting position.',
          difficulty: 'intermediate'
        },
        {
          id: 2,
          name: 'Push-up',
          muscles: ['chest', 'triceps', 'shoulders', 'core'],
          equipment: 'bodyweight',
          image: 'https://via.placeholder.com/300x200?text=Push-up',
          instructions: 'Start in plank position with hands slightly wider than shoulders. Lower body until chest nearly touches floor. Push back up to starting position.',
          difficulty: 'beginner'
        },
        {
          id: 3,
          name: 'Dumbbell Row',
          muscles: ['back', 'biceps'],
          equipment: 'dumbbells',
          image: 'https://via.placeholder.com/300x200?text=Dumbbell+Row',
          instructions: 'Place one hand and knee on bench. Hold dumbbell in other hand. Pull dumbbell toward hip, keeping elbow close to body. Lower back down with control.',
          difficulty: 'beginner'
        },
        {
          id: 4,
          name: 'Squat',
          muscles: ['legs', 'glutes', 'core'],
          equipment: 'bodyweight',
          image: 'https://via.placeholder.com/300x200?text=Squat',
          instructions: 'Stand with feet shoulder-width apart. Bend knees and lower hips as if sitting in a chair. Keep chest up and back straight. Return to standing position.',
          difficulty: 'beginner'
        },
        {
          id: 5,
          name: 'Deadlift',
          muscles: ['back', 'legs', 'glutes'],
          equipment: 'barbell',
          image: 'https://via.placeholder.com/300x200?text=Deadlift',
          instructions: 'Stand with feet hip-width apart. Bend at hips and knees to grasp barbell. Keep back straight. Stand up by extending hips and knees. Lower bar back to ground.',
          difficulty: 'intermediate'
        },
        {
          id: 6,
          name: 'Shoulder Press',
          muscles: ['shoulders', 'triceps'],
          equipment: 'dumbbells',
          image: 'https://via.placeholder.com/300x200?text=Shoulder+Press',
          instructions: 'Sit or stand holding dumbbells at shoulder level. Press weights overhead until arms are extended. Lower back to shoulder level.',
          difficulty: 'intermediate'
        },
        {
          id: 7,
          name: 'Plank',
          muscles: ['core', 'shoulders'],
          equipment: 'bodyweight',
          image: 'https://via.placeholder.com/300x200?text=Plank',
          instructions: 'Start in push-up position but with weight on forearms. Keep body in straight line from head to heels. Hold position.',
          difficulty: 'beginner'
        },
        {
          id: 8,
          name: 'Bicep Curl',
          muscles: ['arms'],
          equipment: 'dumbbells',
          image: 'https://via.placeholder.com/300x200?text=Bicep+Curl',
          instructions: 'Hold dumbbells with palms facing forward. Curl weights towards shoulders while keeping elbows at sides. Lower back down with control.',
          difficulty: 'beginner'
        }
      ];

      setExercises(sampleExercises);
      setFilteredExercises(sampleExercises);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter exercises when search query or filters change
  useEffect(() => {
    if (exercises.length === 0) return;

    let filtered = [...exercises];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.muscles.some(muscle => muscle.toLowerCase().includes(query)) ||
        exercise.equipment.toLowerCase().includes(query)
      );
    }

    // Filter by selected muscles
    if (selectedMuscles.length > 0) {
      filtered = filtered.filter(exercise =>
        selectedMuscles.some(muscle => exercise.muscles.includes(muscle))
      );
    }

    // Filter by selected equipment
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter(exercise =>
        selectedEquipment.includes(exercise.equipment)
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedMuscles, selectedEquipment, exercises]);

  // Handle muscle selection
  const handleMuscleSelect = (muscle) => {
    setSelectedMuscles(prev =>
      prev.includes(muscle)
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  // Handle equipment selection
  const handleEquipmentSelect = (equipment) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedMuscles([]);
    setSelectedEquipment([]);
    setSearchQuery('');
  };

  return (
    <CalculatorLayout pageTitle="Search Exercises">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-[#f67a45] text-sm hover:text-[#e56d3d]"
              >
                Clear All
              </button>
            </div>

            {/* Muscle Group Filter */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Muscle Group</h4>
              <div className="space-y-2">
                {muscleGroups.map(muscle => (
                  <div key={muscle} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`muscle-${muscle}`}
                      checked={selectedMuscles.includes(muscle)}
                      onChange={() => handleMuscleSelect(muscle)}
                      className="w-4 h-4 accent-[#f67a45]"
                    />
                    <label
                      htmlFor={`muscle-${muscle}`}
                      className="ml-2 text-white capitalize cursor-pointer"
                    >
                      {muscle}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Filter */}
            <div>
              <h4 className="text-white font-medium mb-3">Equipment</h4>
              <div className="space-y-2">
                {equipmentTypes.map(equipment => (
                  <div key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`equipment-${equipment}`}
                      checked={selectedEquipment.includes(equipment)}
                      onChange={() => handleEquipmentSelect(equipment)}
                      className="w-4 h-4 accent-[#f67a45]"
                    />
                    <label
                      htmlFor={`equipment-${equipment}`}
                      className="ml-2 text-white capitalize cursor-pointer"
                    >
                      {equipment}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search and Filter Bar */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(returnTo)}
                className="text-white/70 hover:text-white p-2"
              >
                <FaArrowLeft />
              </button>

              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercises, muscles, equipment..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                />
                {searchQuery && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    onClick={() => setSearchQuery('')}
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>

              {/* Filter Button - Mobile only */}
              <button
                className="md:hidden bg-[#1A1A2F] text-white p-2 rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FaFilter />
                <span className="sr-only">Filters</span>
                {(selectedMuscles.length > 0 || selectedEquipment.length > 0) && (
                  <span className="bg-[#f67a45] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {selectedMuscles.length + selectedEquipment.length}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters */}
            {(selectedMuscles.length > 0 || selectedEquipment.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedMuscles.map(muscle => (
                  <div key={muscle} className="bg-[#1A1A2F] text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="capitalize">{muscle}</span>
                    <button
                      onClick={() => handleMuscleSelect(muscle)}
                      className="text-white/70 hover:text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                {selectedEquipment.map(equipment => (
                  <div key={equipment} className="bg-[#1A1A2F] text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="capitalize">{equipment}</span>
                    <button
                      onClick={() => handleEquipmentSelect(equipment)}
                      className="text-white/70 hover:text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-[#f67a45] text-sm hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">
              {loading
                ? 'Loading exercises...'
                : `Results (${filteredExercises.length})`
              }
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-[#1A1A2F] rounded-lg overflow-hidden animate-pulse">
                    <div className="bg-gray-700 h-40 w-full"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredExercises.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map(exercise => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onViewDetails={(exercise) => setSelectedExercise(exercise)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#1A1A2F] p-6 rounded-lg text-center">
                <p className="text-white/60 mb-2">No exercises found</p>
                <p className="text-white/40 text-sm">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-[#121225] rounded-t-xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Muscle Group Filter */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Muscle Group</h4>
              <div className="grid grid-cols-2 gap-2">
                {muscleGroups.map(muscle => (
                  <div key={muscle} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-muscle-${muscle}`}
                      checked={selectedMuscles.includes(muscle)}
                      onChange={() => handleMuscleSelect(muscle)}
                      className="w-4 h-4 accent-[#f67a45]"
                    />
                    <label
                      htmlFor={`mobile-muscle-${muscle}`}
                      className="ml-2 text-white capitalize cursor-pointer"
                    >
                      {muscle}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Filter */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Equipment</h4>
              <div className="grid grid-cols-2 gap-2">
                {equipmentTypes.map(equipment => (
                  <div key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-equipment-${equipment}`}
                      checked={selectedEquipment.includes(equipment)}
                      onChange={() => handleEquipmentSelect(equipment)}
                      className="w-4 h-4 accent-[#f67a45]"
                    />
                    <label
                      htmlFor={`mobile-equipment-${equipment}`}
                      className="ml-2 text-white capitalize cursor-pointer"
                    >
                      {equipment}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 bg-white/10 text-white py-2 rounded-lg"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 bg-[#f67a45] text-white py-2 rounded-lg"
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

export default SearchExercisesPage;
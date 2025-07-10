import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import ExerciseCard from '../../components/Exercises/ExerciseCard';
import ExerciseDetail from '../../components/Exercises/ExerciseDetail';
import {
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

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
    'Arms',
    'Back',
    'Chest',
    'Core',
    'full body',
    'Legs',
    'Shoulders',
    'Cardio',
    'Glutes',
    'Other'
  ];

  // Load exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_PATHS.EXERCISE.GET_EXERCISES);
        const data = await response.data;

        setExercises(data.exercises || []);
        setFilteredExercises(data.exercises || []);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
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
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(query)) ||
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
            {filteredExercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
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
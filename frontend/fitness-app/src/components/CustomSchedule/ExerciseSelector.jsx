import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';

const ExerciseSelector = ({ onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Categories for exercises
  const categories = [
    'all',
    'Chest',
    'Back',
    'Arms',
    'Shoulders',
    'Legs',
    'Core',
    'Cardio',
    'Full body'
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

  // Filter exercises based on search query and category
  useEffect(() => {
    if (exercises.length === 0) return;

    let filtered = [...exercises];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.bodyPart === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedCategory, exercises]);

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter Section */}
      <div className="mb-4">
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full capitalize ${selectedCategory === category
                  ? 'bg-[#f67a45] text-white'
                  : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-[#1A1A2F] rounded-lg p-3 animate-pulse">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-700 rounded-lg mr-3 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredExercises.map((exercise, index) => (
              <div
                key={index}
                className="bg-[#1A1A2F] rounded-lg p-3 cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                onClick={() => onSelectExercise(exercise)}
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/exercise-default1.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{exercise.name}</h4>
                    <span className="text-[#f67a45] text-xs capitalize">{exercise.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">No exercises found</p>
            <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseSelector;

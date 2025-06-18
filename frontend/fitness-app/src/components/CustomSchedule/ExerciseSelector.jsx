import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const ExerciseSelector = ({ onSelectExercise }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock categories for exercises
  const categories = [
    'all',
    'chest',
    'back',
    'arms',
    'shoulders',
    'legs',
    'core',
    'cardio',
    'full body'
  ];

  // Load exercises data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockExercises = [
        {
          id: 1,
          name: 'Push-up',
          category: 'chest',
          image: '/src/assets/exercises/pushup.jpg',
          description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
          instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.'
        },
        {
          id: 2,
          name: 'Pull-up',
          category: 'back',
          image: '/src/assets/exercises/pullup.jpg',
          description: 'An upper body exercise that targets the back, biceps, and shoulders.',
          instructions: 'Hang from a bar with palms facing away from you. Pull your body up until your chin is over the bar, then lower back down.'
        },
        {
          id: 3,
          name: 'Squat',
          category: 'legs',
          image: '/src/assets/exercises/squat.jpg',
          description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.',
          instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping knees behind toes. Return to standing position.'
        },
        {
          id: 4,
          name: 'Plank',
          category: 'core',
          image: '/src/assets/exercises/plank.jpg',
          description: 'A core strengthening exercise that also engages the shoulders and back.',
          instructions: 'Start in a push-up position but with weight on forearms. Keep body in a straight line from head to heels. Hold position.'
        },
        {
          id: 5,
          name: 'Burpee',
          category: 'full body',
          image: '/src/assets/exercises/burpee.jpg',
          description: 'A full-body exercise that builds strength and endurance.',
          instructions: 'Begin standing. Drop into squat position and place hands on floor. Kick feet back to plank position. Do a push-up. Jump feet back to squat position. Jump up with arms extended overhead.'
        },
        {
          id: 6,
          name: 'Bicycle Crunch',
          category: 'core',
          image: '/src/assets/exercises/bicycle.jpg',
          description: 'An abdominal exercise that targets the obliques and rectus abdominis.',
          instructions: 'Lie on your back with hands behind head. Bring knees to chest and lift shoulders off ground. Extend left leg while rotating upper body right, bringing left elbow toward right knee. Alternate sides.'
        },
        {
          id: 7,
          name: 'Dumbbell Curl',
          category: 'arms',
          image: '/src/assets/exercises/curl.jpg',
          description: 'An isolation exercise that targets the biceps.',
          instructions: 'Stand with a dumbbell in each hand, arms at sides, palms facing forward. Keeping elbows close to torso, curl weights toward shoulders. Slowly lower back down.'
        },
        {
          id: 8,
          name: 'Shoulder Press',
          category: 'shoulders',
          image: '/src/assets/exercises/shoulderpress.jpg',
          description: 'An upper body exercise that primarily targets the deltoids.',
          instructions: 'Sit or stand with a dumbbell in each hand at shoulder height. Press weights overhead until arms are extended. Lower back to starting position.'
        },
        {
          id: 9,
          name: 'Running',
          category: 'cardio',
          image: '/src/assets/exercises/running.jpg',
          description: 'A cardiovascular exercise that improves endurance and burns calories.',
          instructions: 'Maintain an upright posture with a slight forward lean. Land midfoot with each step. Keep arms bent at about 90 degrees and swing them forward and back, not across your body.'
        },
        {
          id: 10,
          name: 'Lunges',
          category: 'legs',
          image: '/src/assets/exercises/lunge.jpg',
          description: 'A lower body exercise that targets the quadriceps, hamstrings, and glutes.',
          instructions: 'Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at about 90 degrees. Push back up to starting position and repeat with other leg.'
        }
      ];

      setExercises(mockExercises);
      setFilteredExercises(mockExercises);
      setLoading(false);
    }, 800);
  }, []);

  // Filter exercises based on search query and category
  useEffect(() => {
    if (exercises.length === 0) return;

    let filtered = [...exercises];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
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
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
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
                        e.target.src = '/src/assets/exercises/default.jpg';
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ExerciseCard from '../components/Exercises/ExerciseCard';
import ExerciseDetail from '../components/Exercises/ExerciseDetail';
import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaSearch,
  FaFilter,
  FaBars
} from 'react-icons/fa';

const Exercises = () => {
  const navigate = useNavigate();
  const [activeSection] = useState('Exercises');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleViewExerciseDetails = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseExerciseDetails = () => {
    setSelectedExercise(null);
  };

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

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        setIsMobileFilterOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaBars size={24} />
        </button>
      </div>
      
      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Training'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/dashboard');
              }}
            >
              <FaDumbbell size={20} />
              <span>Training</span>
            </a>
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Custom Schedules'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/custom-schedules');
              }}
            >
              <FaCalendarAlt size={20} />
              <span>Custom Schedules</span>
            </a>
            
            {/* Add remaining navigation items */}
            
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Panel - Slide up when open */}
      <div className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
        isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`absolute bottom-0 left-0 right-0 bg-[#121225] rounded-t-3xl p-5 transition-transform duration-300 transform ${
          isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
          
          <h3 className="text-white text-lg font-bold mb-4">Filter Exercises</h3>
          
          <div className="mb-6">
            <label className="block text-white mb-2">Body Part</label>
            <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto pb-2">
              {bodyParts.map(bodyPart => (
                <button
                  key={bodyPart}
                  className={`px-3 py-2 rounded-lg capitalize text-sm ${
                    selectedBodyPart === bodyPart
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
      
      <div className="container mx-auto pt-4 sm:pt-8 px-4">
        {/* Left Navigation - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              {/* Training */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Training'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/dashboard');
                }}
              >
                <FaDumbbell size={20} />
                <span>Training</span>
              </a>
              
              {/* Custom Schedules */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Custom Schedules'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/custom-schedules');
                }}
              >
                <FaCalendarAlt size={20} />
                <span>Custom Schedules</span>
              </a>
              
              {/* Calculators */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Calculators'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/calculators');
                }}
              >
                <FaCalculator size={20} />
                <span>Calculators</span>
              </a>
              
              {/* Exercises */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Exercises'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <FaRunning size={20} />
                <span>Exercises</span>
              </a>
              
              {/* Reports */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Reports'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/reports');
                }}
              >
                <FaChartBar size={20} />
                <span>Reports</span>
              </a>

              <div className="mt-32 border-t border-white/20 pt-6">
                <div className="flex items-center gap-3">
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span className="text-white">Account</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content with responsive margins */}
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          {/* Page Header - Responsive */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl font-bold">Exercise Library</h2>
            <p className="text-white/70 text-sm sm:text-base">Browse exercises by body part or search for specific movements</p>
          </div>

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
                  onChange={handleSearchChange}
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
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full capitalize text-xs sm:text-sm whitespace-nowrap ${
                    selectedBodyPart === bodyPart
                      ? 'bg-[#f67a45] text-white'
                      : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
                  }`}
                  onClick={() => handleBodyPartSelect(bodyPart)}
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
                    onViewDetails={handleViewExerciseDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#121225] rounded-lg p-6 sm:p-8 text-center">
                <div className="text-white/60 mb-4">No exercises found</div>
                <p className="text-white/40 text-sm sm:text-base">Try adjusting your filters or search query</p>
              </div>
            )}
            
            {/* Add extra bottom padding to account for the floating button on mobile */}
            <div className="h-16 md:h-0"></div>
          </div>

          {/* Exercise Detail Modal is handled by the ExerciseDetail component */}
        </div>
      </div>
    </div>
  );
};

export default Exercises;
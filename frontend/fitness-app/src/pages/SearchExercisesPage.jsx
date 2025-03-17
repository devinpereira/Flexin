import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { 
  FaDumbbell, 
  FaCalendarAlt, 
  FaCalculator, 
  FaRunning, 
  FaChartBar,
  FaArrowLeft,
  FaSearch,
  FaPlus,
  FaCheck,
  FaEye
} from 'react-icons/fa';

const SearchExercisesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { day } = location.state || {};
  
  const [activeSection] = useState('Custom Schedules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [viewingExercise, setViewingExercise] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  
  // Mock exercise data
  const allExercises = [
    { id: 1, name: "Barbell Bench Press", category: "Chest", sets: 3, reps: 10, image: "/src/assets/exercises/bench-press.jpg", description: "Lie on a flat bench with your feet flat on the floor. Grip the barbell with hands slightly wider than shoulder-width apart. Lower the barbell to your chest, then press it back up until your arms are fully extended." },
    { id: 2, name: "Pull-ups", category: "Back", sets: 3, reps: 8, image: "/src/assets/exercises/pull-ups.jpg", description: "Hang from a pull-up bar with hands slightly wider than shoulder-width apart. Pull yourself up until your chin is over the bar, then lower yourself with control back to the starting position." },
    { id: 3, name: "Barbell Squat", category: "Legs", sets: 3, reps: 12, image: "/src/assets/exercises/squat.jpg", description: "Stand with feet shoulder-width apart and a barbell across your upper back. Bend your knees and lower your hips until your thighs are parallel to the ground, then push back up to the starting position." },
    { id: 4, name: "Standing Dumbbell Curl", category: "Arms", sets: 3, reps: 12, image: "/src/assets/exercises/dumbbell-curl.jpg", description: "Stand holding a dumbbell in each hand at your sides. Keeping your upper arms stationary, curl the weights up to shoulder level while contracting your biceps." },
    { id: 5, name: "Dumbbell Lateral Raise", category: "Shoulders", sets: 3, reps: 15, image: "/src/assets/exercises/lateral-raise.jpg", description: "Stand with dumbbells by your sides. With a slight bend in the elbows, raise the weights out to the sides until your arms are parallel to the floor." },
    { id: 6, name: "Plank", category: "Core", sets: 3, reps: 30, image: "/src/assets/exercises/plank.jpg", description: "Get into a push-up position, but rest on your forearms. Keep your body in a straight line from head to heels, engaging your core muscles." },
    { id: 7, name: "Russian Twist", category: "Core", sets: 3, reps: 20, image: "/src/assets/exercises/russian-twist.jpg", description: "Sit on the floor with knees bent and feet slightly elevated. Lean back slightly and twist your torso from side to side." },
    { id: 8, name: "Romanian Deadlift", category: "Legs", sets: 3, reps: 10, image: "/src/assets/exercises/romanian-deadlift.jpg", description: "Hold a barbell in front of your thighs with an overhand grip. Keep your back straight and knees slightly bent. Hinge at the hips to lower the barbell towards the ground, then return to the starting position." },
    { id: 9, name: "Incline Dumbbell Press", category: "Chest", sets: 3, reps: 12, image: "/src/assets/exercises/incline-press.jpg", description: "Set an adjustable bench to a 30-45 degree incline. Sit down with a dumbbell in each hand. Press the weights upward until your arms are extended, then lower them back to chest level." },
    { id: 10, name: "Lat Pulldown", category: "Back", sets: 3, reps: 12, image: "/src/assets/exercises/lat-pulldown.jpg", description: "Sit at a lat pulldown machine with a wide bar attached. Grasp the bar with hands wider than shoulder width. Pull the bar down to chest level, then slowly release it back up." },
    { id: 11, name: "Leg Press", category: "Legs", sets: 3, reps: 15, image: "/src/assets/exercises/leg-press.jpg", description: "Sit in a leg press machine with your feet hip-width apart on the platform. Release the safety bars and lower the platform by bending your knees, then push it back up by extending your legs." },
    { id: 12, name: "Tricep Dips", category: "Arms", sets: 3, reps: 12, image: "/src/assets/exercises/tricep-dips.jpg", description: "Using parallel bars or a dip station, support your weight with arms extended. Lower your body by bending your elbows until they reach a 90-degree angle, then push back up to the starting position." }
  ];

  // Get unique categories
  const categories = ['All', ...new Set(allExercises.map(exercise => exercise.category))];

  // Filter exercises based on search query and category
  const filteredExercises = allExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Display alert message
  const displayAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Toggle exercise selection
  const toggleExerciseSelection = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  // Handle adding selected exercises to schedule
  const handleAddSelectedExercises = () => {
    if (selectedExercises.length === 0) {
      displayAlert('Please select at least one exercise', 'warning');
      return;
    }
    
    const exercisesToAdd = allExercises
      .filter(exercise => selectedExercises.includes(exercise.id))
      .map(exercise => ({
        ...exercise,
        id: Date.now() + Math.random().toString(36).substr(2, 9) // Generate unique ID
      }));
      
    // Get existing exercises from localStorage
    try {
      const savedSchedules = localStorage.getItem('currentScheduleInProgress');
      if (savedSchedules) {
        const scheduleData = JSON.parse(savedSchedules);
        const updatedExercises = {
          ...scheduleData.exercises,
          [day]: [...(scheduleData.exercises[day] || []), ...exercisesToAdd]
        };
        
        localStorage.setItem('currentScheduleInProgress', JSON.stringify({
          ...scheduleData,
          exercises: updatedExercises
        }));
      } else {
        // Create new schedule data
        const initialSchedule = {
          name: 'New Workout Schedule',
          exercises: {
            [day]: exercisesToAdd
          }
        };
        
        localStorage.setItem('currentScheduleInProgress', JSON.stringify(initialSchedule));
      }
      
      displayAlert(`${exercisesToAdd.length} exercises added to ${day}`, 'success');
      
      // Navigate back to schedule editor
      setTimeout(() => {
        navigate('/add-schedule');
      }, 1000);
    } catch (error) {
      displayAlert('Error adding exercises', 'error');
      console.error('Error saving exercises:', error);
    }
  };

  // Handle going back
  const handleBack = () => {
    navigate('/add-schedule');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto pt-8 px-4 flex">
        {/* Left Navigation */}
        <div className="fixed left-0 top-50 z-10 h-screen">
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
                  navigate('/calculators');
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
                  navigate('/exercises');
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
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-[#f67a45]/20"
              >
                <FaArrowLeft />
              </button>
              
              <h2 className="text-white text-2xl font-bold">Add Exercises to {day}</h2>
            </div>
            
            <button 
              onClick={handleAddSelectedExercises}
              disabled={selectedExercises.length === 0}
              className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                selectedExercises.length > 0 
                  ? 'bg-[#f67a45] text-white hover:bg-[#e56d3d]' 
                  : 'bg-[#1A1A2F] text-white/50 cursor-not-allowed'
              } transition-colors`}
            >
              <FaPlus size={14} />
              Add Selected {selectedExercises.length > 0 ? `(${selectedExercises.length})` : ''}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              </div>
              <div className="w-full md:w-48">
                <select 
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1A1A2F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
            <h3 className="text-white text-xl font-bold mb-4">Available Exercises</h3>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {filteredExercises.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className={`bg-white rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                    selectedExercises.includes(exercise.id) 
                      ? 'border-2 border-[#f67a45]' 
                      : 'hover:bg-white/95'
                  }`}
                  onClick={() => toggleExerciseSelection(exercise.id)}
                >
                  <div className="flex items-center">
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
                    <div>
                      <h3 className="font-bold text-[#121225]">{exercise.name}</h3>
                      <p className="text-gray-600">{exercise.category}</p>
                      <p className="text-gray-500 text-sm">{exercise.sets} sets × {exercise.reps} reps</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingExercise(exercise);
                      }}
                      className="bg-[#1A1A2F] text-white p-2 rounded-full hover:bg-[#f67a45]"
                    >
                      <FaEye size={14} />
                    </button>
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        selectedExercises.includes(exercise.id) 
                          ? 'bg-[#f67a45] border-[#f67a45]' 
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {selectedExercises.includes(exercise.id) && 
                        <FaCheck size={12} className="text-white" />
                      }
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredExercises.length === 0 && (
                <div className="bg-[#1A1A2F] rounded-lg p-8 text-center">
                  <p className="text-white/70">No exercises found. Try a different search term or category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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
            <div className="bg-[#1A1A2F] p-4 flex justify-end gap-3">
              <button 
                onClick={() => setViewingExercise(null)}
                className="bg-white/10 text-white px-6 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!selectedExercises.includes(viewingExercise.id)) {
                    toggleExerciseSelection(viewingExercise.id);
                  }
                  setViewingExercise(null);
                }}
                className={`px-6 py-2 rounded-full ${
                  selectedExercises.includes(viewingExercise.id) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#f67a45] text-white hover:bg-[#e56d3d]'
                } transition-colors`}
              >
                {selectedExercises.includes(viewingExercise.id) 
                  ? 'Selected' 
                  : 'Add to Selection'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-lg px-6 py-4 flex items-center ${
            alertType === 'success' ? 'bg-green-600' :
            alertType === 'error' ? 'bg-red-600' :
            alertType === 'warning' ? 'bg-yellow-600' :
            'bg-blue-600'
          }`}>
            <div className={`mr-4 rounded-full p-1 ${
              alertType === 'success' ? 'bg-green-500' :
              alertType === 'error' ? 'bg-red-500' :
              alertType === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}>
              {alertType === 'success' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {alertType === 'error' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {alertType === 'warning' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              )}
              {alertType === 'info' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
            </div>
            <p className="text-white font-medium">{alertMessage}</p>
            <button 
              className="ml-6 text-white/80 hover:text-white"
              onClick={() => setShowAlert(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchExercisesPage;
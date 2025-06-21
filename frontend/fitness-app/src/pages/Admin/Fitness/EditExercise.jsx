import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { FaEdit, FaSave, FaTrash, FaArrowLeft, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const EditExercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    equipment: '',
    difficulty: 'beginner',
    description: '',
    instructions: '',
    muscleGroups: [],
    duration: 0,
    calories: 0,
    videoUrl: '',
    imageUrl: ''
  });

  // Available options for dropdowns
  const categories = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Core', 'HIIT', 'Recovery'];
  const equipments = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Pull-up Bar', 'Bench', 'Yoga Mat', 'Treadmill', 'Exercise Ball', 'Other'];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const muscleGroupsList = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Forearms', 'Full Body'];

  // Mock data for exercises using useMemo to prevent unnecessary re-renders
  const exercises = useMemo(() => [
    {
      id: 1,
      name: 'Push-ups',
      category: 'Strength',
      equipment: 'None',
      difficulty: 'intermediate',
      description: 'A classic exercise that targets the chest, shoulders, and triceps.',
      instructions: '1. Start in a plank position with your hands shoulder-width apart.\n2. Lower your body until your chest nearly touches the floor.\n3. Push yourself back up to the starting position.\n4. Repeat for desired number of repetitions.',
      muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
      duration: 60,
      calories: 100,
      videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      imageUrl: '/src/assets/exercises/pushup.jpg'
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Strength',
      equipment: 'None',
      difficulty: 'beginner',
      description: 'A compound exercise that targets the lower body muscles including quads, glutes, and hamstrings.',
      instructions: '1. Stand with feet shoulder-width apart.\n2. Lower your body as if sitting in a chair.\n3. Keep your back straight and knees over your toes.\n4. Return to starting position.\n5. Repeat for desired repetitions.',
      muscleGroups: ['Quads', 'Hamstrings', 'Glutes'],
      duration: 45,
      calories: 120,
      videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
      imageUrl: '/src/assets/exercises/squat.jpg'
    },
    {
      id: 3,
      name: 'Plank',
      category: 'Core',
      equipment: 'None',
      difficulty: 'beginner',
      description: 'An isometric core exercise that strengthens your abs, back, and shoulders.',
      instructions: '1. Start in a forearm plank position.\n2. Ensure your elbows are directly beneath your shoulders.\n3. Keep your body in a straight line from head to heels.\n4. Hold for desired duration.',
      muscleGroups: ['Abs', 'Shoulders'],
      duration: 30,
      calories: 50,
      videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
      imageUrl: '/src/assets/exercises/plank.jpg'
    },
    {
      id: 4,
      name: 'Pull-ups',
      category: 'Strength',
      equipment: 'Pull-up Bar',
      difficulty: 'advanced',
      description: 'An upper-body compound exercise that targets your back, biceps and shoulders.',
      instructions: '1. Hang from a pull-up bar with palms facing away.\n2. Pull yourself up until your chin is over the bar.\n3. Lower yourself back to the starting position with control.\n4. Repeat for desired repetitions.',
      muscleGroups: ['Back', 'Biceps', 'Shoulders'],
      duration: 40,
      calories: 80,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      imageUrl: '/src/assets/exercises/pullup.jpg'
    },
    {
      id: 5,
      name: 'Deadlift',
      category: 'Strength',
      equipment: 'Barbell',
      difficulty: 'intermediate',
      description: 'A compound exercise that targets multiple muscle groups including the back, glutes, and hamstrings.',
      instructions: '1. Stand with feet hip-width apart, barbell over midfoot.\n2. Bend at hips and knees to lower and grip the bar.\n3. Keeping back straight, stand up while holding the bar.\n4. Return to starting position by hinging at the hips.\n5. Repeat for desired repetitions.',
      muscleGroups: ['Back', 'Glutes', 'Hamstrings', 'Quads'],
      duration: 60,
      calories: 150,
      videoUrl: 'https://www.youtube.com/watch?v=ytGaGIn3SjE',
      imageUrl: '/src/assets/exercises/deadlift.jpg'
    }
  ], []);

  // Check for exercise ID in query params when component loads
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const exerciseId = params.get('id');

    if (exerciseId) {
      const exercise = exercises.find(ex => ex.id === parseInt(exerciseId));
      if (exercise) {
        handleSelectExercise(exercise);
      } else {
        showError('Exercise not found');
      }
    }
  }, [location.search, exercises, showError]);

  // Filter exercises based on search query
  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting an exercise for editing
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name,
      category: exercise.category,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      description: exercise.description,
      instructions: exercise.instructions,
      muscleGroups: [...exercise.muscleGroups],
      duration: exercise.duration,
      calories: exercise.calories,
      videoUrl: exercise.videoUrl,
      imageUrl: exercise.imageUrl
    });
    setIsEditing(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0
    });
  };

  const handleMuscleGroupChange = (muscleGroup) => {
    if (formData.muscleGroups.includes(muscleGroup)) {
      setFormData({
        ...formData,
        muscleGroups: formData.muscleGroups.filter(mg => mg !== muscleGroup)
      });
    } else {
      setFormData({
        ...formData,
        muscleGroups: [...formData.muscleGroups, muscleGroup]
      });
    }
  };

  // Handle saving edited exercise
  const handleSaveChanges = () => {
    // Validate form data
    if (!formData.name || !formData.category || !formData.equipment) {
      showError('Please fill in all required fields');
      return;
    }

    // In a real app, you would call an API to update the exercise
    showSuccess(`Exercise "${formData.name}" has been updated successfully`);

    // Redirect back to the fitness page after short delay
    setTimeout(() => {
      navigate('/admin/fitness');
    }, 1500);
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the exercise "${selectedExercise.name}"? This action cannot be undone.`,
      type: 'danger',
      onConfirm: handleDeleteExercise
    });
  };

  // Handle deleting an exercise
  const handleDeleteExercise = () => {
    // In a real app, you would call an API to delete the exercise
    showSuccess(`Exercise "${selectedExercise.name}" has been deleted successfully`);

    // Redirect back to the fitness page after short delay
    setTimeout(() => {
      navigate('/admin/fitness');
    }, 1500);
  };

  // Handle canceling edit and returning to selection
  const handleCancelEdit = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      name: selectedExercise.name,
      category: selectedExercise.category,
      equipment: selectedExercise.equipment,
      difficulty: selectedExercise.difficulty,
      description: selectedExercise.description,
      instructions: selectedExercise.instructions,
      muscleGroups: [...selectedExercise.muscleGroups],
      duration: selectedExercise.duration,
      calories: selectedExercise.calories,
      videoUrl: selectedExercise.videoUrl,
      imageUrl: selectedExercise.imageUrl
    })) {
      setConfirmDialog({
        isOpen: true,
        title: 'Discard Changes',
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        type: 'warning',
        onConfirm: () => {
          setIsEditing(false);
          setSelectedExercise(null);
        }
      });
    } else {
      setIsEditing(false);
      setSelectedExercise(null);
    }
  };

  return (
    <AdminLayout pageTitle="Edit Exercise">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/fitness')}
          className="inline-flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Exercises</span>
        </button>
      </div>

      {!isEditing ? (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <h3 className="text-white text-xl font-bold mb-6">Select Exercise to Edit</h3>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1A1A2F] text-white border border-gray-700 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                placeholder="Search exercises by name, category, or equipment..."
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.length > 0 ? (
              filteredExercises.map(exercise => (
                <div key={exercise.id} className="bg-[#1A1A2F] border border-gray-800 rounded-lg overflow-hidden shadow-md">
                  <div className="h-32 bg-gradient-to-r from-[#1A1A2F] to-[#2D2D44] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#f67a45]/20 flex items-center justify-center text-[#f67a45]">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.12 3.707a1 1 0 111.414 1.414L15.828 6.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707-1.697 1.697a1 1 0 11-1.414-1.414l1.697-1.697-.707-.707A1 1 0 0112 5h.01zM12 10a1 1 0 01.707.293l.707.707 1.697-1.697a1 1 0 111.414 1.414l-1.697 1.697.707.707a1 1 0 01-1.414 1.414l-.707-.707-.707.707a1 1 0 01-1.414-1.414l.707-.707-1.697-1.697a1 1 0 011.414-1.414l1.697 1.697z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white text-lg font-medium">{exercise.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${exercise.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : exercise.difficulty === 'intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                        {exercise.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-xs">
                        {exercise.category}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {exercise.equipment}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectExercise(exercise)}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit size={16} />
                      <span>Edit Exercise</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-[#1A1A2F] p-8 rounded-lg text-center">
                <p className="text-white/70 mb-2">No exercises found</p>
                <p className="text-white/50 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-white text-xl font-bold mb-2 md:mb-0">Editing: {selectedExercise.name}</h3>
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaArrowLeft size={14} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleDeleteConfirmation}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTrash size={14} />
                <span>Delete</span>
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-[#f67a45] hover:bg-[#e56d3d] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <FaSave size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-[#1A1A2F] p-6 rounded-lg">
                <h4 className="text-white text-lg font-medium mb-4 border-b border-gray-700 pb-2">Basic Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Exercise Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      placeholder="Enter exercise name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Equipment <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      required
                    >
                      <option value="" disabled>Select Equipment</option>
                      {equipments.map((equipment, index) => (
                        <option key={index} value={equipment}>{equipment}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Difficulty Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      required
                    >
                      {difficulties.map((difficulty, index) => (
                        <option key={index} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="Provide a brief description of this exercise"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows="5"
                    className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="Provide step-by-step instructions"
                  ></textarea>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-[#1A1A2F] p-6 rounded-lg">
                <h4 className="text-white text-lg font-medium mb-4 border-b border-gray-700 pb-2">Additional Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleNumberChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Calories Burned
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={formData.calories}
                      onChange={handleNumberChange}
                      className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="e.g. https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Muscle Groups
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {muscleGroupsList.map((muscle, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`muscle-${index}`}
                          checked={formData.muscleGroups.includes(muscle)}
                          onChange={() => handleMuscleGroupChange(muscle)}
                          className="w-4 h-4 mr-2 accent-[#f67a45]"
                        />
                        <label htmlFor={`muscle-${index}`} className="text-white text-sm">
                          {muscle}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="bg-[#1A1A2F] p-6 rounded-lg sticky top-24">
                <h4 className="text-white text-lg font-medium mb-4 border-b border-gray-700 pb-2">Preview</h4>

                {/* Exercise Preview Card */}
                <div className="bg-[#121225] border border-gray-800 rounded-lg overflow-hidden mb-6">
                  <div className="aspect-video bg-gray-800 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-[#f67a45]/20 flex items-center justify-center text-[#f67a45]">
                        <FaExclamationTriangle size={24} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-white font-medium">{formData.name || "Exercise Name"}</h5>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${formData.difficulty === 'beginner'
                          ? 'bg-green-500/20 text-green-400'
                          : formData.difficulty === 'intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                        {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-xs">
                        {formData.category || "Category"}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {formData.equipment || "Equipment"}
                      </span>
                    </div>

                    <div className="text-white/70 text-sm mb-3 line-clamp-3">
                      {formData.description || "Exercise description will appear here"}
                    </div>

                    <div className="flex justify-between text-xs text-white/50 mt-2">
                      <span>{formData.duration} sec</span>
                      <span>{formData.calories} cal</span>
                    </div>
                  </div>
                </div>

                {/* Input for image url */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="bg-[#121225] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type || 'warning'}
      />
    </AdminLayout>
  );
};

export default EditExercise;
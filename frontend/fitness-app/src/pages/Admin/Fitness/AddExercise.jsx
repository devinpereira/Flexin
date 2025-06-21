import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { useNotification } from '../../../hooks/useNotification';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { FaSave, FaArrowLeft, FaCamera, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const AddExercise = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    duration: 30,
    calories: 0,
    videoUrl: '',
    imageFile: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});

  // Available options for dropdowns
  const categories = ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Core', 'HIIT', 'Recovery'];
  const equipments = ['None', 'Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Pull-up Bar', 'Bench', 'Yoga Mat', 'Treadmill', 'Exercise Ball', 'Other'];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const muscleGroupsList = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Abs', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Forearms', 'Full Body'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user makes a change
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        showError('Please select an image file');
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.equipment) {
      newErrors.equipment = 'Equipment is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (formData.muscleGroups.length === 0) {
      newErrors.muscleGroups = 'Select at least one muscle group';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelForm = () => {
    // Check if form has been filled out
    const isFormFilled =
      formData.name !== '' ||
      formData.category !== '' ||
      formData.equipment !== '' ||
      formData.description !== '' ||
      formData.instructions !== '' ||
      formData.muscleGroups.length > 0 ||
      formData.videoUrl !== '' ||
      formData.imageFile !== null;

    if (isFormFilled) {
      setConfirmDialog({
        isOpen: true,
        title: 'Discard Changes',
        message: 'Are you sure you want to discard your changes and go back?',
        type: 'warning',
        onConfirm: () => navigate('/admin/fitness')
      });
    } else {
      navigate('/admin/fitness');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fill in all required fields');

      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstErrorField)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // await axiosInstance.post('/api/exercises', formData);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(`Exercise "${formData.name}" added successfully!`);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/fitness');
      }, 1500);

    } catch (err) {
      showError('Failed to add exercise. Please try again.');
      console.error('Error adding exercise:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pageTitle="Add New Exercise">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleCancelForm}
          className="inline-flex items-center gap-2 text-white hover:text-[#f67a45] transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Exercises</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-[#f67a45] hover:bg-[#e56d3d]'} text-white rounded-lg transition-colors flex items-center gap-2`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaSave size={14} />
              <span>Save Exercise</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
              <h3 className="text-white text-xl font-medium mb-4 border-b border-gray-700 pb-2">Basic Information</h3>

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
                    className={`bg-[#1A1A2F] text-white border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                    placeholder="Enter exercise name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`bg-[#1A1A2F] text-white border ${errors.category ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Equipment <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className={`bg-[#1A1A2F] text-white border ${errors.equipment ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                  >
                    <option value="" disabled>Select Equipment</option>
                    {equipments.map((equipment, index) => (
                      <option key={index} value={equipment}>{equipment}</option>
                    ))}
                  </select>
                  {errors.equipment && <p className="text-red-500 text-xs mt-1">{errors.equipment}</p>}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
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
                <label className="block text-white text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`bg-[#1A1A2F] text-white border ${errors.description ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                  placeholder="Provide a brief description of this exercise"
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Instructions <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="5"
                  className={`bg-[#1A1A2F] text-white border ${errors.instructions ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]`}
                  placeholder="Provide step-by-step instructions"
                ></textarea>
                <p className="text-white/50 text-xs mt-1">Use numbered steps (1., 2., etc.) for clarity</p>
                {errors.instructions && <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
              <h3 className="text-white text-xl font-medium mb-4 border-b border-gray-700 pb-2">Additional Details</h3>

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
                    className="bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    min="0"
                  />
                  <p className="text-white/50 text-xs mt-1">Typical time to complete one rep</p>
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
                    className="bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    min="0"
                  />
                  <p className="text-white/50 text-xs mt-1">Estimated calories per minute</p>
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
                  className="bg-[#1A1A2F] text-white border border-gray-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  placeholder="e.g. https://youtube.com/watch?v=..."
                />
                <p className="text-white/50 text-xs mt-1">YouTube, Vimeo, or other video platform links</p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Muscle Groups <span className="text-red-500">*</span>
                </label>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 ${errors.muscleGroups ? 'border border-red-500 rounded-lg p-2' : ''}`}>
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
                {errors.muscleGroups && <p className="text-red-500 text-xs mt-1">{errors.muscleGroups}</p>}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#121225] border border-[#f67a45]/30 p-6 rounded-lg sticky top-24">
              <h3 className="text-white text-xl font-medium mb-4 border-b border-gray-700 pb-2">Preview</h3>

              {/* Image Upload/Preview */}
              <div className="mb-6">
                <div className="aspect-video bg-[#1A1A2F] border border-dashed border-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {formData.imagePreview ? (
                    <>
                      <img
                        src={formData.imagePreview}
                        alt="Exercise preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageFile: null, imagePreview: null })}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
                      <FaCamera size={32} className="text-gray-400 mb-2" />
                      <span className="text-white/70 text-sm mb-1">Click to upload image</span>
                      <span className="text-white/50 text-xs">(Max: 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Exercise Preview Card */}
              <div className="bg-[#1A1A2F] border border-gray-800 rounded-lg overflow-hidden mb-6">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-white font-medium">{formData.name || "Exercise Name"}</h5>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs ${formData.difficulty === 'beginner'
                        ? 'bg-green-500/20 text-green-400'
                        : formData.difficulty === 'intermediate'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : formData.difficulty === 'advanced'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-purple-500/20 text-purple-400'
                      }`}>
                      {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.category && (
                      <span className="px-2.5 py-0.5 bg-[#f67a45]/20 text-[#f67a45] rounded-full text-xs">
                        {formData.category}
                      </span>
                    )}
                    {formData.equipment && (
                      <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {formData.equipment}
                      </span>
                    )}
                  </div>

                  <div className="text-white/70 text-sm mb-3 line-clamp-3">
                    {formData.description || "Exercise description will appear here"}
                  </div>

                  {formData.muscleGroups.length > 0 && (
                    <div className="mb-3">
                      <p className="text-white/50 text-xs mb-1">Muscle Groups:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.muscleGroups.map((muscle, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-white/80 rounded-full text-xs">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>{formData.duration} sec</span>
                    <span>{formData.calories} cal</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-3 ${isSubmitting ? 'bg-gray-500' : 'bg-[#f67a45] hover:bg-[#e56d3d]'} text-white rounded-lg transition-colors w-full flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaPlus size={14} />
                      <span>Create Exercise</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

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

export default AddExercise;
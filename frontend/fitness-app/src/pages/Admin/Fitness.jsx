import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Admin/AdminLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaDumbbell } from 'react-icons/fa';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotification } from '../../hooks/useNotification';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Fitness = () => {
  const [activeTab, setActiveTab] = useState('exercises');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useNotification();

  // State for confirm dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Fetch exercises when component mounts
  useEffect(() => {
    fetchExercises();
  }, []);

  // Function to fetch exercises from API
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EXERCISE.GET_EXERCISES);
      if (response && response.data.exercises) {
        setExercises(response.data.exercises);
      }
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch exercises');
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data
  const workouts = [
    { id: 1, name: 'Full Body HIIT', category: 'HIIT', level: 'Intermediate', exercises: 12, duration: '45 min' },
    { id: 2, name: 'Upper Body Strength', category: 'Strength', level: 'Advanced', exercises: 8, duration: '60 min' },
    { id: 3, name: 'Core Crusher', category: 'Core', level: 'Beginner', exercises: 10, duration: '30 min' },
    { id: 4, name: 'Leg Day Challenge', category: 'Strength', level: 'Advanced', exercises: 9, duration: '50 min' },
    { id: 5, name: 'Cardio Blast', category: 'Cardio', level: 'Intermediate', exercises: 7, duration: '40 min' }
  ];

  const mealPlans = [
    { id: 1, name: 'Weight Loss Plan', category: 'Weight Loss', duration: '4 weeks', meals: 21, calories: '1,800' },
    { id: 2, name: 'Muscle Building', category: 'Muscle Gain', duration: '8 weeks', meals: 35, calories: '2,800' },
    { id: 3, name: 'Keto Diet', category: 'Specialized', duration: '6 weeks', meals: 28, calories: '2,000' },
    { id: 4, name: 'Vegan Nutrition', category: 'Specialized', duration: '4 weeks', meals: 21, calories: '2,200' },
    { id: 5, name: 'Intermittent Fasting', category: 'Weight Loss', duration: '4 weeks', meals: 14, calories: '1,600' }
  ];

  // Filter data based on search query
  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exercise.bodyPart && exercise.bodyPart.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (exercise.equipment && exercise.equipment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMealPlans = mealPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete action with confirmation dialog
  const handleDeleteItem = (item) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        if (activeTab === 'exercises') {
          deleteExercise(item._id);
        } else {
          // For other tabs without API integration yet
          showSuccess(`${item.name} has been deleted successfully`);
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      }
    });
  };

  // Handle exercise deletion
  const deleteExercise = async (exerciseId) => {
    try {
      await axiosInstance.delete(API_PATHS.EXERCISE.DELETE_EXERCISE(exerciseId));
      showSuccess('Exercise deleted successfully');
      // Refresh the exercise list
      fetchExercises();
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to delete exercise');
      console.error('Error deleting exercise:', error);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
    }
  };

  // Handle edit action
  const handleEditExercise = (exercise) => {
    navigate(`/admin/fitness/edit-exercise/${exercise._id}`);
  };

  // Handle view action
  const handleViewItem = (item) => {
    if (activeTab === 'exercises') {
      showInfo(`Viewing exercise: ${item.name}`);
      // You could implement a modal or detailed view here
    } else {
      showInfo(`Viewing ${item.name}`);
    }
  };

  return (
    <AdminLayout pageTitle="Fitness Management">
      {/* Search & Add New Button */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative max-w-lg w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121225] text-white border border-gray-700 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            placeholder={`Search ${activeTab}...`}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            <FaFilter />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/fitness/add-exercise')}
            className="bg-[#f67a45] hover:bg-[#e56d3d] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <FaPlus size={14} />
            <span>Add Exercise</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'exercises'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            <FaDumbbell className="mr-2" size={16} />
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'workouts'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            Workout Plans
          </button>
          <button
            onClick={() => setActiveTab('mealPlans')}
            className={`inline-flex items-center py-4 px-4 text-sm font-medium text-center border-b-2 ${activeTab === 'mealPlans'
                ? 'text-[#f67a45] border-[#f67a45]'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-300'
              }`}
          >
            Meal Plans
          </button>
        </div>
      </div>

      {/* Exercises Tab Content */}
      {activeTab === 'exercises' && (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f67a45]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Body Part</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Equipment</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                      <tr key={exercise._id} className="hover:bg-gray-800/30">
                        <td className="py-3 px-4 whitespace-nowrap text-white">{exercise.name}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-white/70">{exercise.bodyPart}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-white/70">{exercise.equipment}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            exercise.difficulty.toLowerCase() === 'beginner' ? 'bg-green-400/10 text-green-400' :
                            exercise.difficulty.toLowerCase() === 'intermediate' ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'
                          }`}>
                            {exercise.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewItem(exercise)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Exercise"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditExercise(exercise)}
                              className="text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                              title="Edit Exercise"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(exercise)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Exercise"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-white/70">
                        {loading ? 'Loading exercises...' : 'No exercises found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Workouts Tab Content */}
      {activeTab === 'workouts' && (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Exercises</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredWorkouts.length > 0 ? (
                  filteredWorkouts.map((workout) => (
                    <tr key={workout.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 whitespace-nowrap text-white">{workout.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{workout.category}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${workout.level === 'Beginner' ? 'bg-green-400/10 text-green-400' :
                            workout.level === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' :
                              'bg-red-400/10 text-red-400'
                          }`}>
                          {workout.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{workout.exercises}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{workout.duration}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewItem(workout)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Workout"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => { }}
                            className="text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                            title="Edit Workout"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(workout)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Workout"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-white/70">
                      No workouts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Meal Plans Tab Content */}
      {activeTab === 'mealPlans' && (
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meals</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Calories</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredMealPlans.length > 0 ? (
                  filteredMealPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-800/30">
                      <td className="py-3 px-4 whitespace-nowrap text-white">{plan.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{plan.category}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{plan.duration}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{plan.meals}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-white/70">{plan.calories}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewItem(plan)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Meal Plan"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => { }}
                            className="text-[#f67a45] hover:text-[#e56d3d] transition-colors"
                            title="Edit Meal Plan"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(plan)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Meal Plan"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-white/70">
                      No meal plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default Fitness;

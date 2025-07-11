import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import { v4 as uuidv4 } from 'uuid';
import DaysSelector from '../../components/CustomSchedule/DaysSelector';
import ExerciseSelector from '../../components/CustomSchedule/ExerciseSelector';
import DayExercises from '../../components/CustomSchedule/DayExercises';
import { FaPlus, FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const EditSchedule = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [exercises, setExercises] = useState({});
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.WORKOUT.GET_CUSTOM_WORKOUT(scheduleId));
        const schedule = response.data;
        if (schedule) {
          setName(schedule.name || '');
          setDescription(schedule.description || '');
          setSelectedDays(schedule.days || []);
          setExercises(schedule.exercises || {});

          if (schedule.days && schedule.days.length > 0) {
            setCurrentDay(schedule.days[0]);
          }
        } else {
          setError('Schedule not found');
        }
      } catch (err) {
        setError('Failed to load schedule');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  // Handle adding a new exercise to a specific day
  const handleAddExercise = (day, exercise) => {
    setExercises(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), {
        ...exercise,
        id: uuidv4(),
        sets: 3,
        reps: 10
      }]
    }));
    setShowExerciseSelector(false);
  };

  // Handle updating an exercise
  const handleUpdateExercise = (day, exerciseId, updates) => {
    setExercises(prev => {
      const dayExercises = [...(prev[day] || [])];
      const index = dayExercises.findIndex(ex => ex.id === exerciseId);

      if (index !== -1) {
        if (updates.order !== undefined) {
          // Handle reordering
          const [moved] = dayExercises.splice(index, 1);
          dayExercises.splice(updates.order, 0, moved);
        } else {
          // Handle normal update
          dayExercises[index] = { ...dayExercises[index], ...updates };
        }
      }

      return { ...prev, [day]: dayExercises };
    });
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (day, exerciseId) => {
    setExercises(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(ex => ex.id !== exerciseId)
    }));
  };

  // Handle saving the updated schedule
  const handleSaveSchedule = async () => {
    if (!name.trim()) {
      setError('Please enter a schedule name');
      return;
    }

    if (selectedDays.length === 0) {
      setError('Please select at least one day');
      return;
    }

    const hasExercises = selectedDays.some(day =>
      exercises[day] && exercises[day].length > 0
    );

    if (!hasExercises) {
      setError('Please add at least one exercise to your schedule');
      return;
    }

    setIsLoading(true);
    setError('');

    // Update schedule object
    const updatedSchedule = {
      name,
      description,
      days: selectedDays,
      exercises,
    };

    // In a real app, you'd send this to an API
    try {
      await axiosInstance.patch(API_PATHS.WORKOUT.UPDATE_CUSTOM_WORKOUT(scheduleId), updatedSchedule);
      navigate('/custom-schedules');
    } catch (err) {
      setError('Failed to save schedule. Please try again.', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting the schedule
  const handleDeleteSchedule = () => {
    setIsLoading(true);

    // In a real app, you'd send a delete request to an API
    // For this demo, we'll remove from localStorage
    setTimeout(() => {
      try {
        const savedSchedules = JSON.parse(localStorage.getItem('customSchedules') || '[]');
        const filteredSchedules = savedSchedules.filter(s => s.id !== scheduleId);
        localStorage.setItem('customSchedules', JSON.stringify(filteredSchedules));
        navigate('/custom-schedules');
      } catch (err) {
        setError('Failed to delete schedule. Please try again.');
        setIsLoading(false);
        setShowDeleteConfirm(false);
      }
    }, 1000);
  };

  if (initialLoading) {
    return (
      <CalculatorLayout pageTitle="Edit Schedule">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 flex justify-center items-center min-h-[300px]">
          <div className="text-white">Loading schedule...</div>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout pageTitle="Edit Schedule">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Schedule Info */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Schedule Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Schedule Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                placeholder="e.g., Full Body Workout"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#1A1A2F] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f67a45] min-h-[100px]"
                placeholder="Describe your workout schedule..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Days Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Workout Days</h3>
          <DaysSelector
            selectedDays={selectedDays}
            onChange={setSelectedDays}
          />
        </div>

        {/* Exercises */}
        {selectedDays.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg font-bold mb-4">Exercises</h3>

            {/* Tabs for days */}
            <div className="flex flex-wrap gap-2 mb-4 bg-[#1A1A2F] p-2 rounded-lg overflow-x-auto">
              {selectedDays.map(day => (
                <button
                  key={day}
                  className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${currentDay === day
                      ? 'bg-[#f67a45] text-white'
                      : 'bg-transparent text-white hover:bg-[#f67a45]/20'
                    }`}
                  onClick={() => setCurrentDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            {currentDay && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-white font-medium">{currentDay}'s Exercises</h4>
                  <button
                    onClick={() => {
                      setShowExerciseSelector(true);
                    }}
                    className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#f67a45]/30"
                  >
                    <FaPlus size={14} />
                    <span>Add Exercise</span>
                  </button>
                </div>

                <DayExercises
                  exercises={exercises[currentDay] || []}
                  day={currentDay}
                  onUpdate={handleUpdateExercise}
                  onDelete={handleDeleteExercise}
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/custom-schedules')}
              className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 flex items-center gap-2"
            >
              <FaArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-md hover:bg-red-500/30 flex items-center gap-2"
            >
              <FaTrash size={14} />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={handleSaveSchedule}
            disabled={isLoading}
            className="bg-[#f67a45] text-white px-6 py-2 rounded-md hover:bg-[#e56d3d] flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FaSave size={14} />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Select Exercise</h3>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setShowExerciseSelector(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <ExerciseSelector onSelectExercise={(exercise) => handleAddExercise(currentDay, exercise)} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-md p-6">
            <h3 className="text-white text-lg font-bold mb-4">Delete Schedule</h3>
            <p className="text-white/70 mb-6">Are you sure you want to delete this schedule? This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteSchedule}
                disabled={isLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaTrash size={14} />
                )}
                <span>{isLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
};

export default EditSchedule;
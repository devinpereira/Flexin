import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import { FaArrowLeft, FaEdit, FaEye, FaPlay } from 'react-icons/fa';

const ViewSchedule = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Load schedule data
  useEffect(() => {
    try {
      const savedSchedules = JSON.parse(localStorage.getItem('customSchedules') || '[]');
      const loadedSchedule = savedSchedules.find(s => s.id === scheduleId);

      if (loadedSchedule) {
        setSchedule(loadedSchedule);
        if (loadedSchedule.days && loadedSchedule.days.length > 0) {
          setActiveDay(loadedSchedule.days[0]);
        }
      } else {
        setError('Schedule not found');
      }
    } catch (err) {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);

  // Handler to view exercise details
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setViewModalOpen(true);
  };

  // Handler to start workout
  const handleStartWorkout = () => {
    // In a real app, this would navigate to a workout session page
    console.log(`Starting workout for ${activeDay}`);
    alert(`Starting workout for ${activeDay}`);
  };

  if (loading) {
    return (
      <CalculatorLayout pageTitle="View Schedule">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6 flex justify-center items-center min-h-[300px]">
          <div className="text-white">Loading schedule...</div>
        </div>
      </CalculatorLayout>
    );
  }

  if (error || !schedule) {
    return (
      <CalculatorLayout pageTitle="View Schedule">
        <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error || 'Schedule not found'}
          </div>
          <button
            onClick={() => navigate('/custom-schedules')}
            className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 flex items-center gap-2"
          >
            <FaArrowLeft size={14} />
            <span>Back to Schedules</span>
          </button>
        </div>
      </CalculatorLayout>
    );
  }

  return (
    <CalculatorLayout pageTitle="View Schedule">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
        {/* Schedule Info */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-white text-xl font-bold">{schedule.name}</h2>
              {schedule.description && (
                <p className="text-white/70 mt-1">{schedule.description}</p>
              )}
            </div>
            <button
              onClick={() => navigate(`/edit-schedule/${scheduleId}`)}
              className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#f67a45]/30"
            >
              <FaEdit size={14} />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Days Tabs */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Workout Days</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {schedule.days.map(day => (
              <button
                key={day}
                className={`px-4 py-2 rounded-md text-sm ${activeDay === day
                    ? 'bg-[#f67a45] text-white'
                    : 'bg-[#1A1A2F] text-white hover:bg-[#f67a45]/20'
                  }`}
                onClick={() => setActiveDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises for the Active Day */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-bold">{activeDay}'s Exercises</h3>
            <button
              onClick={handleStartWorkout}
              className="bg-[#f67a45] text-white px-4 py-2 rounded-md hover:bg-[#e56d3d] flex items-center gap-2"
            >
              <FaPlay size={14} />
              <span>Start Workout</span>
            </button>
          </div>

          <div className="space-y-3">
            {schedule.exercises[activeDay]?.map((exercise) => (
              <div key={exercise.id} className="bg-[#1A1A2F] rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden mr-4 flex-shrink-0">
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
                    <h4 className="text-white font-medium">{exercise.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                        {exercise.sets} sets
                      </span>
                      <span className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">
                        {exercise.reps} reps
                      </span>
                      {exercise.category && (
                        <span className="bg-[#f67a45]/20 text-[#f67a45] text-xs px-2 py-0.5 rounded-full">
                          {exercise.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewExercise(exercise)}
                  className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
                >
                  <FaEye size={16} />
                </button>
              </div>
            ))}

            {(!schedule.exercises[activeDay] || schedule.exercises[activeDay].length === 0) && (
              <div className="bg-[#1A1A2F] rounded-lg p-6 text-center">
                <p className="text-white/60">No exercises added for {activeDay}</p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-start mt-8">
          <button
            onClick={() => navigate('/custom-schedules')}
            className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 flex items-center gap-2"
          >
            <FaArrowLeft size={14} />
            <span>Back to Schedules</span>
          </button>
        </div>
      </div>

      {/* View Exercise Modal */}
      {viewModalOpen && selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121225] rounded-xl w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Exercise Details</h3>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setViewModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedExercise.image}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/exercises/default.jpg';
                  }}
                />
              </div>

              <h4 className="text-white text-lg font-bold mb-2">{selectedExercise.name}</h4>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1 rounded-full text-sm">
                  {selectedExercise.sets} sets
                </span>
                <span className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1 rounded-full text-sm">
                  {selectedExercise.reps} reps
                </span>
                {selectedExercise.category && (
                  <span className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1 rounded-full text-sm">
                    {selectedExercise.category}
                  </span>
                )}
              </div>

              {selectedExercise.description && (
                <div>
                  <h5 className="text-white font-medium mb-2">Description:</h5>
                  <p className="text-white/70">{selectedExercise.description}</p>
                </div>
              )}

              {selectedExercise.instructions && (
                <div className="mt-4">
                  <h5 className="text-white font-medium mb-2">Instructions:</h5>
                  <p className="text-white/70">{selectedExercise.instructions}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="bg-[#f67a45] text-white px-4 py-2 rounded-md hover:bg-[#e56d3d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
};

export default ViewSchedule;
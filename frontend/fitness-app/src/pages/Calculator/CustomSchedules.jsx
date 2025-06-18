import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalculatorLayout from '../../components/Calculator/CalculatorLayout';
import ScheduleCard from '../../components/CustomSchedule/ScheduleCard';
import { FaPlus, FaTimes } from 'react-icons/fa';

const CustomSchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [showTutorialImages, setShowTutorialImages] = useState(true);

  // Mock data for schedules (in a real app, this would come from an API/database)
  useEffect(() => {
    // Simulate loading schedules
    const savedSchedules = localStorage.getItem('customSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  const handleAddSchedule = () => {
    navigate('/add-schedule');
  };

  const handleViewSchedule = (scheduleId) => {
    navigate(`/edit-schedule/${scheduleId}`);
  };

  return (
    <CalculatorLayout pageTitle="Custom Schedules">
      <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6 md:p-8">
        {schedules.length > 0 ? (
          <div>
            {/* Schedules Grid - Responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {schedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onClick={() => handleViewSchedule(schedule.id)}
                />
              ))}

              {/* Add New Schedule Card - Responsive padding */}
              <div
                className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[200px] sm:min-h-[250px] cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
                onClick={handleAddSchedule}
              >
                <div className="bg-[#f67a45]/20 p-3 sm:p-4 rounded-full mb-2 sm:mb-3">
                  <FaPlus className="text-[#f67a45] text-lg sm:text-xl" />
                </div>
                <h3 className="text-white text-base sm:text-lg font-medium mb-1 sm:mb-2">Add New Schedule</h3>
                <p className="text-white/60 text-xs sm:text-sm">Create a custom workout routine</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Tutorial Images Section with close button - Responsive */}
            {showTutorialImages && (
              <div className="mb-6 sm:mb-8 relative w-full max-w-2xl">
                <button
                  onClick={() => setShowTutorialImages(false)}
                  className="absolute -top-2 -right-2 bg-[#1A1A2F] text-white p-1 rounded-full hover:bg-[#f67a45] transition-colors z-10"
                >
                  <FaTimes size={14} />
                </button>
                <div className="bg-[#1A1A2F] p-3 sm:p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <img
                        src="/src/assets/tutorial/custom-schedule-1.jpg"
                        alt="Create a schedule"
                        className="rounded-lg w-full h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/tutorial/placeholder.jpg';
                        }}
                      />
                      <p className="text-white/70 text-xs sm:text-sm mt-2 text-center">Create your own workout schedule</p>
                    </div>
                    <div>
                      <img
                        src="/src/assets/tutorial/custom-schedule-2.jpg"
                        alt="Customize exercises"
                        className="rounded-lg w-full h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/tutorial/placeholder.jpg';
                        }}
                      />
                      <p className="text-white/70 text-xs sm:text-sm mt-2 text-center">Add and customize exercises</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State Add Schedule Button - Responsive sizing and padding */}
            <div
              className="bg-[#1A1A2F] border border-dashed border-[#f67a45]/50 rounded-lg p-6 sm:p-12 flex flex-col items-center justify-center text-center w-full max-w-md cursor-pointer hover:bg-[#1A1A2F]/70 transition-colors"
              onClick={handleAddSchedule}
            >
              <div className="bg-[#f67a45]/20 p-4 sm:p-6 rounded-full mb-4 sm:mb-6">
                <FaPlus className="text-[#f67a45] text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-white text-lg sm:text-xl font-bold mb-2 sm:mb-3">Add a Schedule</h3>
              <p className="text-white/70 mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">Create your own custom workout schedule tailored to your fitness goals and preferences.</p>
              <button
                className="bg-[#f67a45] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <FaPlus size={12} className="sm:text-[14px]" />
                New Schedule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Alert Component */}
      {showAlert && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center ${alertType === 'success' ? 'bg-green-600' :
              alertType === 'error' ? 'bg-red-600' :
                alertType === 'warning' ? 'bg-yellow-600' :
                  'bg-blue-600'
            }`}>
            {/* Alert content */}
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
};

export default CustomSchedules;
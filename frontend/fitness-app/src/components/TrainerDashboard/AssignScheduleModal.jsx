import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import ConfirmDialog from "../ConfirmDialog";
import Notification from "../Admin/Notification";
import trainerScheduleService from "../../services/trainerScheduleService";

const AssignScheduleModal = ({
  open,
  onClose,
  subscriber,
  onScheduleUpdate,
}) => {
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [editSchedule, setEditSchedule] = useState({ days: [] });
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (open && subscriber) {
      loadData();
    }
  }, [open, subscriber]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Debug subscriber info
      console.log("Subscriber object:", subscriber);
      console.log("Subscriber ID methods:", {
        directId: subscriber?.id,
        userIdField: subscriber?.userId?._id,
        userIdDirect: subscriber?.userId,
        subscriberId: subscriber?._id,
        allKeys: Object.keys(subscriber || {}),
        fullSubscriber: subscriber,
      });

      // Load exercises
      const exercisesResult = await trainerScheduleService.getExercises();
      console.log("Exercises result:", exercisesResult); // Debug log
      if (exercisesResult.success) {
        setExercises(exercisesResult.exercises);
        console.log("Loaded exercises:", exercisesResult.exercises.length); // Debug log
      } else {
        console.error("Failed to load exercises:", exercisesResult.error);
        showNotification("Failed to load exercises", "error");
      }

      // Check if user already has a schedule
      // Extract user ID from various possible structures
      let userId = null;
      if (subscriber.id) {
        userId = subscriber.id;
      } else if (subscriber.userId?._id) {
        userId = subscriber.userId._id;
      } else if (subscriber.userId && typeof subscriber.userId === "string") {
        userId = subscriber.userId;
      } else if (subscriber._id) {
        userId = subscriber._id;
      }

      console.log("Extracted userId:", userId);

      if (userId) {
        console.log("Using userId for schedule lookup:", userId);

        const scheduleResult = await trainerScheduleService.getUserSchedule(
          userId
        );
        console.log("Schedule result:", scheduleResult);

        if (scheduleResult.success && scheduleResult.schedule) {
          console.log("Found existing schedule:", scheduleResult.schedule);
          setCurrentSchedule(scheduleResult.schedule);
          setEditSchedule(scheduleResult.schedule);
        } else {
          console.log("No existing schedule found, creating new structure");
          // Create new schedule structure
          setCurrentSchedule(null);
          setEditSchedule({
            days: [{ day: "Day 1", exercises: [] }],
          });
        }
      } else {
        console.error("No valid user ID found in subscriber:", subscriber);
        showNotification("Invalid subscriber data - missing user ID", "error");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      isVisible: true,
      type,
      message,
    });
  };

  const showConfirmDialog = (title, message, action) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const handleSaveSchedule = async () => {
    if (!editSchedule.days || editSchedule.days.length === 0) {
      showNotification("Please add at least one day to the schedule", "error");
      return;
    }

    console.log("Saving schedule...");
    console.log("Current schedule exists:", !!currentSchedule);
    console.log("Edit schedule data:", editSchedule);

    setSaving(true);
    try {
      // Extract user ID using the same logic as loadData
      let userId = null;
      if (subscriber.id) {
        userId = subscriber.id;
      } else if (subscriber.userId?._id) {
        userId = subscriber.userId._id;
      } else if (subscriber.userId && typeof subscriber.userId === "string") {
        userId = subscriber.userId;
      } else if (subscriber._id) {
        userId = subscriber._id;
      }

      console.log("Using userId for save:", userId);

      if (!userId) {
        showNotification("Invalid user ID", "error");
        return;
      }
      const scheduleData = { days: editSchedule.days };
      console.log("Schedule data to send:", scheduleData);

      let result;
      if (currentSchedule) {
        console.log("Updating existing schedule...");
        result = await trainerScheduleService.updateSchedule(
          userId,
          scheduleData
        );
      } else {
        console.log("Assigning new schedule...");
        result = await trainerScheduleService.assignSchedule(
          userId,
          scheduleData
        );
      }

      console.log("Save result:", result);

      if (result.success) {
        showNotification(
          result.message || "Schedule saved successfully!",
          "success"
        );
        if (onScheduleUpdate) onScheduleUpdate();
        setTimeout(() => onClose(), 1500);
      } else {
        showNotification(result.error || "Failed to save schedule", "error");
      }
    } catch (error) {
      console.error("Error in handleSaveSchedule:", error);
      showNotification("Failed to save schedule", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    // Extract user ID using the same logic as loadData
    let userId = null;
    if (subscriber.id) {
      userId = subscriber.id;
    } else if (subscriber.userId?._id) {
      userId = subscriber.userId._id;
    } else if (subscriber.userId && typeof subscriber.userId === "string") {
      userId = subscriber.userId;
    } else if (subscriber._id) {
      userId = subscriber._id;
    }

    console.log("Deleting schedule for userId:", userId);

    if (!userId) {
      showNotification("Invalid user ID", "error");
      return;
    }
    try {
      const result = await trainerScheduleService.deleteSchedule(userId);
      console.log("Delete result:", result);

      if (result.success) {
        showNotification("Schedule deleted successfully!", "success");
        if (onScheduleUpdate) onScheduleUpdate();
        setTimeout(() => onClose(), 1500);
      } else {
        showNotification(result.error || "Failed to delete schedule", "error");
      }
    } catch (error) {
      console.error("Error in handleDeleteSchedule:", error);
      showNotification("Failed to delete schedule", "error");
    }
  };

  const addDay = () => {
    const newDayNumber = editSchedule.days.length + 1;
    setEditSchedule({
      ...editSchedule,
      days: [
        ...editSchedule.days,
        { day: `Day ${newDayNumber}`, exercises: [] },
      ],
    });
  };

  const removeDay = (dayIndex) => {
    if (editSchedule.days.length <= 1) {
      showNotification("Schedule must have at least one day", "error");
      return;
    }

    const newDays = editSchedule.days.filter((_, index) => index !== dayIndex);
    setEditSchedule({ ...editSchedule, days: newDays });

    if (selectedDay >= newDays.length) {
      setSelectedDay(newDays.length - 1);
    }
  };

  const addExerciseToDay = (exercise) => {
    const newExercise = {
      name: exercise.name,
      sets: 3,
      reps: 10,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
    };

    const newDays = [...editSchedule.days];
    newDays[selectedDay].exercises.push(newExercise);
    setEditSchedule({ ...editSchedule, days: newDays });
    setShowAddExercise(false);
    setExerciseSearch("");
  };

  const updateExercise = (exerciseIndex, field, value) => {
    const newDays = [...editSchedule.days];
    newDays[selectedDay].exercises[exerciseIndex][field] = value;
    setEditSchedule({ ...editSchedule, days: newDays });
  };

  const removeExercise = (exerciseIndex) => {
    const newDays = [...editSchedule.days];
    newDays[selectedDay].exercises.splice(exerciseIndex, 1);
    setEditSchedule({ ...editSchedule, days: newDays });
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (!exerciseSearch.trim()) return true; // Show all if no search term

    const searchLower = exerciseSearch.toLowerCase();
    const name = (exercise.name || "").toLowerCase();
    const bodyPart = (exercise.bodyPart || "").toLowerCase();
    const equipment = (exercise.equipment || "").toLowerCase();
    const difficulty = (exercise.difficulty || "").toLowerCase();
    const primaryMuscles = (exercise.primaryMuscles || [])
      .join(" ")
      .toLowerCase();

    const isMatch =
      name.includes(searchLower) ||
      bodyPart.includes(searchLower) ||
      equipment.includes(searchLower) ||
      difficulty.includes(searchLower) ||
      primaryMuscles.includes(searchLower);

    // Debug log for the first few exercises when searching
    if (exerciseSearch && exercise === exercises[0]) {
      console.log("Search debug for first exercise:", {
        searchTerm: exerciseSearch,
        searchLower,
        exerciseName: name,
        bodyPart,
        equipment,
        difficulty,
        primaryMuscles,
        isMatch,
      });
    }

    return isMatch;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div
        className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col"
        style={{ height: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <h2 className="text-white font-semibold text-lg">
            {currentSchedule ? "Edit" : "Assign"} Schedule -{" "}
            {subscriber?.name || subscriber?.userId?.fullName || "Subscriber"}
          </h2>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-[#121225]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-white">Loading...</div>
            </div>
          ) : (
            <div className="h-full p-6">
              {/* Days Navigation */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto">
                {editSchedule.days.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedDay === index
                          ? "bg-[#f67a45] text-white"
                          : "bg-[#18182f] text-white/70 hover:text-white border border-gray-600"
                      }`}
                      onClick={() => setSelectedDay(index)}
                    >
                      {day.day}
                    </button>
                    {editSchedule.days.length > 1 && (
                      <button
                        className="ml-1 text-red-400 hover:text-red-300"
                        onClick={() => removeDay(index)}
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="px-3 py-2 bg-[#18182f] border border-dashed border-[#f67a45] text-[#f67a45] rounded-lg hover:bg-[#f67a45]/10 transition-colors flex items-center gap-2"
                  onClick={addDay}
                >
                  <FaPlus size={12} />
                  Add Day
                </button>
              </div>

              {/* Selected Day Content */}
              {editSchedule.days[selectedDay] && (
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">
                      {editSchedule.days[selectedDay].day} (
                      {editSchedule.days[selectedDay].exercises.length}{" "}
                      exercises)
                    </h3>
                    <button
                      className="bg-[#f67a45] text-white px-4 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                      onClick={() => setShowAddExercise(true)}
                    >
                      <FaPlus />
                      Add Exercise
                    </button>
                  </div>

                  {/* Exercises List */}
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {editSchedule.days[selectedDay].exercises.length > 0 ? (
                      editSchedule.days[selectedDay].exercises.map(
                        (exercise, index) => (
                          <div
                            key={index}
                            className="bg-[#18182f] rounded-lg p-4 border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-white font-medium">
                                {exercise.name}
                              </h4>
                              <button
                                className="text-red-400 hover:text-red-300"
                                onClick={() => removeExercise(index)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <label className="text-white/60 text-sm">
                                  Sets:
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={exercise.sets}
                                  onChange={(e) =>
                                    updateExercise(
                                      index,
                                      "sets",
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-16 px-2 py-1 bg-[#121225] text-white border border-gray-600 rounded"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <label className="text-white/60 text-sm">
                                  Reps:
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={exercise.reps}
                                  onChange={(e) =>
                                    updateExercise(
                                      index,
                                      "reps",
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-16 px-2 py-1 bg-[#121225] text-white border border-gray-600 rounded"
                                />
                              </div>
                              {exercise.bodyPart && (
                                <span className="text-[#f67a45] text-sm bg-[#f67a45]/20 px-2 py-1 rounded">
                                  {exercise.bodyPart}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center py-8 text-white/60">
                        No exercises added for this day. Click "Add Exercise" to
                        get started.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#232342]">
          <div>
            {currentSchedule && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                onClick={() =>
                  showConfirmDialog(
                    "Delete Schedule",
                    "Are you sure you want to delete this schedule? This action cannot be undone.",
                    handleDeleteSchedule
                  )
                }
              >
                Delete Schedule
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-[#f67a45] text-white px-6 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
              onClick={handleSaveSchedule}
              disabled={saving}
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <FaSave />
                  {currentSchedule ? "Update" : "Assign"} Schedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1A1A2F] rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
              <h3 className="text-white font-semibold">Add Exercise</h3>
              <button
                className="text-white/70 hover:text-white text-xl"
                onClick={() => setShowAddExercise(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full px-4 py-2 bg-[#18182f] text-white border border-gray-600 rounded-lg mb-4"
              />

              {/* Debug info */}
              <div className="text-white/60 text-sm mb-2">
                Total exercises: {exercises.length} | Filtered:{" "}
                {filteredExercises.length}
                {exerciseSearch && ` | Search: "${exerciseSearch}"`}
                <br />
                First exercise name: {exercises[0]?.name || "None"} | Search
                term length: {exerciseSearch.length}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise._id}
                    className="flex items-center justify-between p-3 bg-[#18182f] rounded-lg border border-gray-700 hover:border-[#f67a45] cursor-pointer transition-colors"
                    onClick={() => addExerciseToDay(exercise)}
                  >
                    <div>
                      <h4 className="text-white font-medium">
                        {exercise.name}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        {exercise.bodyPart && (
                          <span className="text-xs bg-[#f67a45]/20 text-[#f67a45] px-2 py-1 rounded">
                            {exercise.bodyPart}
                          </span>
                        )}
                        {exercise.equipment && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {exercise.equipment}
                          </span>
                        )}
                        {exercise.difficulty && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <FaPlus className="text-[#f67a45]" />
                  </div>
                ))}
                {filteredExercises.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    No exercises found. Try a different search term.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          confirmAction();
          setShowConfirm(false);
        }}
        title={confirmTitle}
        message={confirmMessage}
        type="warning"
      />

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
};

export default AssignScheduleModal;

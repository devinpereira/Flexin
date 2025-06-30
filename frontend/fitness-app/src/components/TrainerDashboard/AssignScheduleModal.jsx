import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";
import ConfirmDialog from "../ConfirmDialog";
import Notification from "../Admin/Notification";

// Mock schedules for demonstration
const initialSchedules = [
  {
    id: "s1",
    name: "Beginner Full Body",
    days: ["Day 1", "Day 2", "Day 3"],
    exercises: {
      "Day 1": [
        { id: 1, name: "Incline Barbell Press", sets: 4, reps: 8, image: "/src/assets/exercise1.png" },
        { id: 2, name: "Dumbbell Bench Press", sets: 3, reps: 10, image: "/src/assets/exercise1.png" }
      ],
      "Day 2": [
        { id: 3, name: "Barbell Squat", sets: 5, reps: 5, image: "/src/assets/exercise1.png" }
      ],
      "Day 3": [
        { id: 4, name: "Pull-ups", sets: 4, reps: 8, image: "/src/assets/exercise1.png" }
      ]
    }
  },
  {
    id: "s2",
    name: "Weight Loss Plan",
    days: ["Day 1", "Day 2"],
    exercises: {
      "Day 1": [
        { id: 5, name: "Burpees", sets: 4, reps: 12, image: "/src/assets/exercise1.png" }
      ],
      "Day 2": [
        { id: 6, name: "Running", sets: 1, reps: 30, image: "/src/assets/exercise1.png" }
      ]
    }
  }
];

// Mock exercise list for adding new exercises
const exerciseLibrary = [
  { id: 101, name: "Push-up", image: "/src/assets/exercise1.png" },
  { id: 102, name: "Squat", image: "/src/assets/exercise1.png" },
  { id: 103, name: "Deadlift", image: "/src/assets/exercise1.png" },
  { id: 104, name: "Pull-up", image: "/src/assets/exercise1.png" },
  { id: 105, name: "Plank", image: "/src/assets/exercise1.png" }
];

const AssignScheduleModal = ({ open, onClose, subscriber }) => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editSchedule, setEditSchedule] = useState(null);
  const [editDay, setEditDay] = useState(null);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newScheduleName, setNewScheduleName] = useState("");
  const [addingNewSchedule, setAddingNewSchedule] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => { });
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmType, setConfirmType] = useState("warning");
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    message: "",
    autoClose: true,
    duration: 3000,
  });

  const showAlert = (message, type = "success") => {
    setNotification({
      isVisible: true,
      type,
      message,
      autoClose: true,
      duration: 3000,
    });
  };

  const showConfirmDialog = (title, message, type, action) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmType(type);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  if (!open) return null;

  // Add new schedule
  const handleAddNewSchedule = () => {
    setAddingNewSchedule(true);
    setNewScheduleName("");
    setEditSchedule({
      id: `s${Date.now()}`,
      name: "",
      days: ["Day 1"],
      exercises: { "Day 1": [] }
    });
    setEditMode(true);
    setSelectedSchedule(null);
  };

  // Save new or edited schedule
  const handleSaveSchedule = () => {
    if (!editSchedule.name.trim()) {
      showAlert("Schedule name is required", "error");
      return;
    }
    let updatedSchedules;
    if (addingNewSchedule) {
      updatedSchedules = [...schedules, editSchedule];
      showAlert("Schedule created successfully", "success");
    } else {
      updatedSchedules = schedules.map(s =>
        s.id === editSchedule.id ? editSchedule : s
      );
      showAlert("Schedule updated successfully", "success");
    }
    setSchedules(updatedSchedules);
    setEditMode(false);
    setAddingNewSchedule(false);
    setSelectedSchedule(editSchedule);
    setEditSchedule(null);
  };

  // Delete schedule
  const handleDeleteSchedule = (id) => {
    showConfirmDialog(
      "Delete Schedule",
      "Are you sure you want to delete this schedule? This action cannot be undone.",
      "danger",
      () => {
        setSchedules(schedules.filter(s => s.id !== id));
        setSelectedSchedule(null);
        setEditMode(false);
        setEditSchedule(null);
        showAlert("Schedule deleted successfully", "success");
      }
    );
  };

  // Add new day to schedule
  const handleAddDay = () => {
    const nextDayNum = editSchedule.days.length + 1;
    const newDay = `Day ${nextDayNum}`;
    setEditSchedule({
      ...editSchedule,
      days: [...editSchedule.days, newDay],
      exercises: { ...editSchedule.exercises, [newDay]: [] }
    });
  };

  // Remove day from schedule
  const handleRemoveDay = (day) => {
    const newDays = editSchedule.days.filter(d => d !== day);
    const newExercises = { ...editSchedule.exercises };
    delete newExercises[day];
    setEditSchedule({
      ...editSchedule,
      days: newDays,
      exercises: newExercises
    });
    if (editDay === day) setEditDay(newDays[0] || null);
  };

  // Add exercise to a day
  const handleAddExerciseToDay = (exercise) => {
    setEditSchedule({
      ...editSchedule,
      exercises: {
        ...editSchedule.exercises,
        [editDay]: [
          ...(editSchedule.exercises[editDay] || []),
          { ...exercise, sets: 3, reps: 10, id: Date.now() }
        ]
      }
    });
    setShowAddExercise(false);
  };

  // Edit exercise in a day
  const handleEditExercise = (exIdx, field, value) => {
    const updated = editSchedule.exercises[editDay].map((ex, idx) =>
      idx === exIdx ? { ...ex, [field]: value } : ex
    );
    setEditSchedule({
      ...editSchedule,
      exercises: { ...editSchedule.exercises, [editDay]: updated }
    });
  };

  // Remove exercise from a day
  const handleRemoveExercise = (exIdx) => {
    const updated = editSchedule.exercises[editDay].filter((_, idx) => idx !== exIdx);
    setEditSchedule({
      ...editSchedule,
      exercises: { ...editSchedule.exercises, [editDay]: updated }
    });
  };

  // UI
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col" style={{ height: "92vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <span className="text-white font-semibold text-lg">
            Assign Schedule to {subscriber?.name || "Subscriber"}
          </span>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 bg-[#121225]">
          <div className="p-6">
            {/* Schedules List */}
            {!editMode && (
              <>
                <h3 className="text-white text-lg font-bold mb-4">Select a Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className={`bg-[#18182f] border rounded-lg p-4 cursor-pointer transition-all ${selectedSchedule?.id === schedule.id
                          ? "border-[#f67a45] ring-2 ring-[#f67a45]"
                          : "border-[#f67a45]/20 hover:border-[#f67a45]/50"
                        }`}
                      onClick={() => setSelectedSchedule(schedule)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-semibold mb-2">{schedule.name}</h4>
                        <div className="flex gap-2">
                          <button
                            className="text-[#f67a45] hover:text-[#e56d3d]"
                            title="Edit"
                            onClick={e => {
                              e.stopPropagation();
                              setEditMode(true);
                              setEditSchedule({ ...schedule });
                              setEditDay(schedule.days[0]);
                              setAddingNewSchedule(false);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteSchedule(schedule.id);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {schedule.days.map((day) => (
                          <span
                            key={day}
                            className="bg-[#121225] text-xs text-white/80 px-2 py-1 rounded-full"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/60 text-xs">{Object.values(schedule.exercises).flat().length} exercises</p>
                    </div>
                  ))}
                  {/* Add new schedule card */}
                  <div
                    className="bg-[#18182f] border border-dashed border-[#f67a45]/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#232342] transition-colors"
                    onClick={handleAddNewSchedule}
                  >
                    <div className="bg-[#f67a45]/20 p-3 rounded-full mb-2">
                      <FaPlus className="text-[#f67a45] text-lg" />
                    </div>
                    <p className="text-white text-center">Add New Schedule</p>
                  </div>
                </div>
                {/* Preview and Assign */}
                {selectedSchedule && (
                  <div className="bg-[#18182f] rounded-lg p-4 mt-4">
                    <h4 className="text-white font-semibold mb-2">Preview: {selectedSchedule.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedSchedule.days.map((day) => (
                        <span
                          key={day}
                          className="bg-[#121225] text-xs text-white/80 px-2 py-1 rounded-full"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedSchedule.days.map((day) => (
                        <div key={day}>
                          <div className="text-[#f67a45] font-semibold text-sm mb-1">{day}</div>
                          <div className="flex flex-col gap-1">
                            {selectedSchedule.exercises[day]?.map((ex) => (
                              <div key={ex.id} className="flex items-center gap-2">
                                <img src={ex.image} alt={ex.name} className="w-7 h-7 rounded" />
                                <span className="text-white text-xs">{ex.name}</span>
                                <span className="text-white/60 text-xs">{ex.sets}x{ex.reps}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors font-medium"
                      onClick={() => {
                        showConfirmDialog(
                          "Assign Schedule",
                          `Are you sure you want to assign "${selectedSchedule.name}" to ${subscriber?.name || "subscriber"}?`,
                          "warning",
                          () => {
                            showAlert(`Assigned "${selectedSchedule.name}" to ${subscriber?.name || "subscriber"}`, "success");
                            onClose();
                          }
                        );
                      }}
                    >
                      Assign Schedule
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Edit/New Schedule UI */}
            {editMode && (
              <div className="bg-[#18182f] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    className="text-white/70 hover:text-white"
                    onClick={() => {
                      setEditMode(false);
                      setEditSchedule(null);
                      setAddingNewSchedule(false);
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                  <h4 className="text-white font-semibold">
                    {addingNewSchedule ? "Create New Schedule" : "Edit Schedule"}
                  </h4>
                </div>
                <div className="mb-4">
                  <label className="block text-white/80 text-sm mb-1">Schedule Name</label>
                  <input
                    type="text"
                    value={editSchedule.name}
                    onChange={e => setEditSchedule({ ...editSchedule, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#121225] border border-[#232342] rounded-lg text-white focus:outline-none focus:border-[#f67a45]"
                    placeholder="e.g., Full Body Workout"
                  />
                </div>
                {/* Days Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {editSchedule.days.map(day => (
                    <button
                      key={day}
                      className={`px-4 py-1.5 rounded-full text-sm ${editDay === day
                        ? "bg-[#f67a45] text-white"
                        : "bg-[#121225] text-white/80 border border-[#232342]"
                        }`}
                      onClick={() => setEditDay(day)}
                    >
                      {day}
                      {editSchedule.days.length > 1 && (
                        <span
                          className="ml-2 text-red-400 cursor-pointer"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveDay(day);
                          }}
                          title="Remove day"
                        >
                          &times;
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1.5 rounded-full bg-[#232342] text-white/70 hover:bg-[#f67a45]/20"
                    onClick={handleAddDay}
                  >
                    <FaPlus size={12} /> Add Day
                  </button>
                </div>
                {/* Exercises for selected day */}
                {editDay && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-white font-medium">{editDay} Exercises</h5>
                      <button
                        className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#f67a45]/30"
                        onClick={() => setShowAddExercise(true)}
                      >
                        <FaPlus size={14} />
                        <span>Add Exercise</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editSchedule.exercises[editDay] || []).map((ex, idx) => (
                        <div key={ex.id} className="flex items-center gap-2 bg-[#121225] rounded-lg p-2">
                          <img src={ex.image} alt={ex.name} className="w-8 h-8 rounded" />
                          <input
                            type="text"
                            value={ex.name}
                            onChange={e => handleEditExercise(idx, "name", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-32"
                          />
                          <input
                            type="number"
                            min={1}
                            value={ex.sets}
                            onChange={e => handleEditExercise(idx, "sets", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-12"
                            placeholder="Sets"
                          />
                          <input
                            type="number"
                            min={1}
                            value={ex.reps}
                            onChange={e => handleEditExercise(idx, "reps", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-12"
                            placeholder="Reps"
                          />
                          <button
                            className="text-red-400 hover:text-red-600 ml-2"
                            onClick={() => handleRemoveExercise(idx)}
                            title="Remove"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                      {(editSchedule.exercises[editDay] || []).length === 0 && (
                        <div className="text-white/50 text-xs py-4 text-center">No exercises for this day.</div>
                      )}
                    </div>
                  </div>
                )}
                {/* Save Button */}
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors font-medium"
                    onClick={handleSaveSchedule}
                  >
                    <FaSave className="inline mr-2" /> Save Schedule
                  </button>
                </div>
                {/* Add Exercise Modal */}
                {showAddExercise && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#18182f] rounded-xl p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold">Add Exercise</h4>
                        <button
                          className="text-white/70 hover:text-white text-2xl"
                          onClick={() => setShowAddExercise(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {exerciseLibrary.map(ex => (
                          <div
                            key={ex.id}
                            className="flex items-center gap-3 bg-[#121225] rounded-lg p-2 cursor-pointer hover:bg-[#232342]"
                            onClick={() => handleAddExerciseToDay(ex)}
                          >
                            <img src={ex.image} alt={ex.name} className="w-8 h-8 rounded" />
                            <span className="text-white text-sm">{ex.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Custom Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          confirmAction();
          setShowConfirm(false);
        }}
        title={confirmTitle}
        message={confirmMessage}
        type={confirmType}
      />
      {/* Custom Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification(n => ({ ...n, isVisible: false }))}
        autoClose={notification.autoClose}
        duration={notification.duration}
      />
    </div>
  );
};

export default AssignScheduleModal;

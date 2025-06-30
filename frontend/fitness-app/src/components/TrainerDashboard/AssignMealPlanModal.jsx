import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";
import ConfirmDialog from "../ConfirmDialog";
import Notification from "../Admin/Notification";

const defaultMealTypes = [
  "Breakfast", "Lunch", "Pre-Workout", "Dinner", "Snack"
];

// Mock meal plans for demonstration
const initialMealPlans = [
  {
    id: "mp1",
    name: "Weight Loss Plan",
    days: ["Monday", "Tuesday", "Wednesday"],
    meals: {
      "Monday": [
        {
          id: 1,
          type: "Breakfast",
          time: "7:00 AM",
          meal: "Oatmeal with Berries and Protein Shake",
          calories: 450,
          protein: "30g",
          carbs: "45g",
          fats: "12g",
          recipe: "1. Cook 1 cup oats with water or almond milk\n2. Add 1 cup mixed berries\n3. Add 1 scoop protein powder\n4. Top with honey and cinnamon"
        }
      ],
      "Tuesday": [],
      "Wednesday": []
    }
  }
];

const AssignMealPlanModal = ({ open, onClose, subscriber }) => {
  const [mealPlans, setMealPlans] = useState(initialMealPlans);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [editDay, setEditDay] = useState(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newMeal, setNewMeal] = useState({
    type: "Breakfast",
    time: "",
    meal: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    recipe: ""
  });
  const [newDayName, setNewDayName] = useState("");
  const [addingNewPlan, setAddingNewPlan] = useState(false);
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

  // Add new meal plan
  const handleAddNewPlan = () => {
    setAddingNewPlan(true);
    setEditPlan({
      id: `mp${Date.now()}`,
      name: "",
      days: ["Monday"],
      meals: { "Monday": [] }
    });
    setEditDay("Monday");
    setEditMode(true);
    setSelectedPlan(null);
  };

  // Save new or edited meal plan
  const handleSavePlan = () => {
    if (!editPlan.name.trim()) {
      showAlert("Meal plan name is required", "error");
      return;
    }
    let updatedPlans;
    if (addingNewPlan) {
      updatedPlans = [...mealPlans, editPlan];
      showAlert("Meal plan created successfully", "success");
    } else {
      updatedPlans = mealPlans.map(mp =>
        mp.id === editPlan.id ? editPlan : mp
      );
      showAlert("Meal plan updated successfully", "success");
    }
    setMealPlans(updatedPlans);
    setEditMode(false);
    setAddingNewPlan(false);
    setSelectedPlan(editPlan);
    setEditPlan(null);
  };

  // Delete meal plan
  const handleDeletePlan = (id) => {
    showConfirmDialog(
      "Delete Meal Plan",
      "Are you sure you want to delete this meal plan? This action cannot be undone.",
      "danger",
      () => {
        setMealPlans(mealPlans.filter(mp => mp.id !== id));
        setSelectedPlan(null);
        setEditMode(false);
        setEditPlan(null);
        showAlert("Meal plan deleted successfully", "success");
      }
    );
  };

  // Add new day to meal plan
  const handleAddDay = () => {
    if (!newDayName.trim()) {
      showAlert("Day name is required", "error");
      return;
    }
    if (editPlan.days.includes(newDayName)) {
      showAlert("Day already exists", "error");
      return;
    }
    setEditPlan({
      ...editPlan,
      days: [...editPlan.days, newDayName],
      meals: { ...editPlan.meals, [newDayName]: [] }
    });
    setEditDay(newDayName);
    setShowAddDay(false);
    setNewDayName("");
  };

  // Remove day from meal plan
  const handleRemoveDay = (day) => {
    const newDays = editPlan.days.filter(d => d !== day);
    const newMeals = { ...editPlan.meals };
    delete newMeals[day];
    setEditPlan({
      ...editPlan,
      days: newDays,
      meals: newMeals
    });
    if (editDay === day) setEditDay(newDays[0] || null);
  };

  // Add meal to a day
  const handleAddMealToDay = () => {
    if (!newMeal.meal.trim() || !newMeal.type.trim()) {
      showAlert("Meal name and type are required", "error");
      return;
    }
    setEditPlan({
      ...editPlan,
      meals: {
        ...editPlan.meals,
        [editDay]: [
          ...(editPlan.meals[editDay] || []),
          { ...newMeal, id: Date.now() }
        ]
      }
    });
    setShowAddMeal(false);
    setNewMeal({
      type: "Breakfast",
      time: "",
      meal: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      recipe: ""
    });
  };

  // Edit meal in a day
  const handleEditMeal = (mealIdx, field, value) => {
    const updated = editPlan.meals[editDay].map((m, idx) =>
      idx === mealIdx ? { ...m, [field]: value } : m
    );
    setEditPlan({
      ...editPlan,
      meals: { ...editPlan.meals, [editDay]: updated }
    });
  };

  // Remove meal from a day
  const handleRemoveMeal = (mealIdx) => {
    const updated = editPlan.meals[editDay].filter((_, idx) => idx !== mealIdx);
    setEditPlan({
      ...editPlan,
      meals: { ...editPlan.meals, [editDay]: updated }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1A1A2F] rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col" style={{ height: "92vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232342]">
          <span className="text-white font-semibold text-lg">
            Assign Meal Plan to {subscriber?.name || "Subscriber"}
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
            {/* Meal Plans List */}
            {!editMode && (
              <>
                <h3 className="text-white text-lg font-bold mb-4">Select a Meal Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {mealPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`bg-[#18182f] border rounded-lg p-4 cursor-pointer transition-all ${selectedPlan?.id === plan.id
                        ? "border-[#f67a45] ring-2 ring-[#f67a45]"
                        : "border-[#f67a45]/20 hover:border-[#f67a45]/50"
                        }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-semibold mb-2">{plan.name}</h4>
                        <div className="flex gap-2">
                          <button
                            className="text-[#f67a45] hover:text-[#e56d3d]"
                            title="Edit"
                            onClick={e => {
                              e.stopPropagation();
                              setEditMode(true);
                              setEditPlan({ ...plan });
                              setEditDay(plan.days[0]);
                              setAddingNewPlan(false);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                            onClick={e => {
                              e.stopPropagation();
                              handleDeletePlan(plan.id);
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {plan.days.map((day) => (
                          <span
                            key={day}
                            className="bg-[#121225] text-xs text-white/80 px-2 py-1 rounded-full"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/60 text-xs">{Object.values(plan.meals).flat().length} meals</p>
                    </div>
                  ))}
                  {/* Add new meal plan card */}
                  <div
                    className="bg-[#18182f] border border-dashed border-[#f67a45]/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-[#232342] transition-colors"
                    onClick={handleAddNewPlan}
                  >
                    <div className="bg-[#f67a45]/20 p-3 rounded-full mb-2">
                      <FaPlus className="text-[#f67a45] text-lg" />
                    </div>
                    <p className="text-white text-center">Add New Meal Plan</p>
                  </div>
                </div>
                {/* Preview and Assign */}
                {selectedPlan && (
                  <div className="bg-[#18182f] rounded-lg p-4 mt-4">
                    <h4 className="text-white font-semibold mb-2">Preview: {selectedPlan.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedPlan.days.map((day) => (
                        <span
                          key={day}
                          className="bg-[#121225] text-xs text-white/80 px-2 py-1 rounded-full"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedPlan.days.map((day) => (
                        <div key={day}>
                          <div className="text-[#f67a45] font-semibold text-sm mb-1">{day}</div>
                          <div className="flex flex-col gap-1">
                            {selectedPlan.meals[day]?.map((m) => (
                              <div key={m.id} className="flex items-center gap-2">
                                <span className="text-white text-xs">{m.type}:</span>
                                <span className="text-white text-xs">{m.meal}</span>
                                <span className="text-white/60 text-xs">{m.calories} cal</span>
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
                          "Assign Meal Plan",
                          `Are you sure you want to assign "${selectedPlan.name}" to ${subscriber?.name || "subscriber"}?`,
                          "warning",
                          () => {
                            showAlert(`Assigned "${selectedPlan.name}" to ${subscriber?.name || "subscriber"}`, "success");
                            onClose();
                          }
                        );
                      }}
                    >
                      Assign Meal Plan
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Edit/New Meal Plan UI */}
            {editMode && (
              <div className="bg-[#18182f] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    className="text-white/70 hover:text-white"
                    onClick={() => {
                      setEditMode(false);
                      setEditPlan(null);
                      setAddingNewPlan(false);
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                  <h4 className="text-white font-semibold">
                    {addingNewPlan ? "Create New Meal Plan" : "Edit Meal Plan"}
                  </h4>
                </div>
                <div className="mb-4">
                  <label className="block text-white/80 text-sm mb-1">Meal Plan Name</label>
                  <input
                    type="text"
                    value={editPlan.name}
                    onChange={e => setEditPlan({ ...editPlan, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#121225] border border-[#232342] rounded-lg text-white focus:outline-none focus:border-[#f67a45]"
                    placeholder="e.g., Weight Loss Plan"
                  />
                </div>
                {/* Days Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {editPlan.days.map(day => (
                    <button
                      key={day}
                      className={`px-4 py-1.5 rounded-full text-sm ${editDay === day
                        ? "bg-[#f67a45] text-white"
                        : "bg-[#121225] text-white/80 border border-[#232342]"
                        }`}
                      onClick={() => setEditDay(day)}
                    >
                      {day}
                      {editPlan.days.length > 1 && (
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
                    onClick={() => setShowAddDay(true)}
                  >
                    <FaPlus size={12} /> Add Day
                  </button>
                </div>
                {/* Meals for selected day */}
                {editDay && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-white font-medium">{editDay} Meals</h5>
                      <button
                        className="bg-[#f67a45]/20 text-[#f67a45] px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-[#f67a45]/30"
                        onClick={() => setShowAddMeal(true)}
                      >
                        <FaPlus size={14} />
                        <span>Add Meal</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editPlan.meals[editDay] || []).map((m, idx) => (
                        <div key={m.id} className="flex items-center gap-2 bg-[#121225] rounded-lg p-2">
                          <input
                            type="text"
                            value={m.type}
                            onChange={e => handleEditMeal(idx, "type", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-24"
                            placeholder="Type"
                          />
                          <input
                            type="text"
                            value={m.meal}
                            onChange={e => handleEditMeal(idx, "meal", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-40"
                            placeholder="Meal"
                          />
                          <input
                            type="text"
                            value={m.time}
                            onChange={e => handleEditMeal(idx, "time", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-16"
                            placeholder="Time"
                          />
                          <input
                            type="number"
                            value={m.calories}
                            onChange={e => handleEditMeal(idx, "calories", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-14"
                            placeholder="Cal"
                          />
                          <input
                            type="text"
                            value={m.protein}
                            onChange={e => handleEditMeal(idx, "protein", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-14"
                            placeholder="Protein"
                          />
                          <input
                            type="text"
                            value={m.carbs}
                            onChange={e => handleEditMeal(idx, "carbs", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-14"
                            placeholder="Carbs"
                          />
                          <input
                            type="text"
                            value={m.fats}
                            onChange={e => handleEditMeal(idx, "fats", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-14"
                            placeholder="Fats"
                          />
                          <input
                            type="text"
                            value={m.recipe}
                            onChange={e => handleEditMeal(idx, "recipe", e.target.value)}
                            className="bg-transparent border-b border-[#232342] text-white text-xs px-2 py-1 w-32"
                            placeholder="Recipe"
                          />
                          <button
                            className="text-red-400 hover:text-red-600 ml-2"
                            onClick={() => handleRemoveMeal(idx)}
                            title="Remove"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                      {(editPlan.meals[editDay] || []).length === 0 && (
                        <div className="text-white/50 text-xs py-4 text-center">No meals for this day.</div>
                      )}
                    </div>
                  </div>
                )}
                {/* Save Button */}
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-[#f67a45] text-white px-6 py-2 rounded-full hover:bg-[#e56d3d] transition-colors font-medium"
                    onClick={handleSavePlan}
                  >
                    <FaSave className="inline mr-2" /> Save Meal Plan
                  </button>
                </div>
                {/* Add Meal Modal */}
                {showAddMeal && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#18182f] rounded-xl p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold">Add Meal</h4>
                        <button
                          className="text-white/70 hover:text-white text-2xl"
                          onClick={() => setShowAddMeal(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-white/80 text-xs mb-1">Meal Type</label>
                          <select
                            value={newMeal.type}
                            onChange={e => setNewMeal({ ...newMeal, type: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          >
                            {defaultMealTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs mb-1">Meal Name</label>
                          <input
                            type="text"
                            value={newMeal.meal}
                            onChange={e => setNewMeal({ ...newMeal, meal: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs mb-1">Time</label>
                          <input
                            type="text"
                            value={newMeal.time}
                            onChange={e => setNewMeal({ ...newMeal, time: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-white/80 text-xs mb-1">Calories</label>
                            <input
                              type="number"
                              value={newMeal.calories}
                              onChange={e => setNewMeal({ ...newMeal, calories: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-xs mb-1">Protein</label>
                            <input
                              type="text"
                              value={newMeal.protein}
                              onChange={e => setNewMeal({ ...newMeal, protein: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-xs mb-1">Carbs</label>
                            <input
                              type="text"
                              value={newMeal.carbs}
                              onChange={e => setNewMeal({ ...newMeal, carbs: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-white/80 text-xs mb-1">Fats</label>
                            <input
                              type="text"
                              value={newMeal.fats}
                              onChange={e => setNewMeal({ ...newMeal, fats: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs mb-1">Recipe</label>
                          <textarea
                            value={newMeal.recipe}
                            onChange={e => setNewMeal({ ...newMeal, recipe: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white min-h-[60px]"
                          />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            className="px-4 py-2 border border-gray-400 rounded-full text-white hover:bg-gray-700 transition-colors"
                            onClick={() => setShowAddMeal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors"
                            onClick={handleAddMealToDay}
                          >
                            <FaSave className="inline mr-2" /> Add Meal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Add Day Modal */}
                {showAddDay && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#18182f] rounded-xl p-6 max-w-md w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-semibold">Add Day</h4>
                        <button
                          className="text-white/70 hover:text-white text-2xl"
                          onClick={() => setShowAddDay(false)}
                        >
                          &times;
                        </button>
                      </div>
                      <div>
                        <label className="block text-white/80 text-xs mb-1">Day Name</label>
                        <input
                          type="text"
                          value={newDayName}
                          onChange={e => setNewDayName(e.target.value)}
                          className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                          placeholder="e.g. Thursday"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="px-4 py-2 border border-gray-400 rounded-full text-white hover:bg-gray-700 transition-colors"
                          onClick={() => setShowAddDay(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors"
                          onClick={handleAddDay}
                        >
                          <FaSave className="inline mr-2" /> Add Day
                        </button>
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

export default AssignMealPlanModal;

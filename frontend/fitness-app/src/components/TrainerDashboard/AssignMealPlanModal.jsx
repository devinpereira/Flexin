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
import { getUserInfo } from "../../api/user";

const defaultMealTypes = [
  "Breakfast",
  "Lunch",
  "Pre-Workout",
  "Post-Workout",
  "Dinner",
  "Snack",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AssignMealPlanModal = ({
  open,
  onClose,
  subscriber,
  onMealPlanUpdate,
}) => {
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  const [editMealPlan, setEditMealPlan] = useState({
    week: "default",
    days: new Map(),
  });
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showAddMeal, setShowAddMeal] = useState(false);
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
  const [newMeal, setNewMeal] = useState({
    type: "Breakfast",
    time: "08:00",
    meal: "",
    calories: 0,
    protein: "",
    carbs: "",
    fats: "",
    recipe: "",
  });

  useEffect(() => {
    if (open && subscriber) {
      loadMealPlan();
    }
  }, [open, subscriber]);

  const loadMealPlan = async () => {
    setLoading(true);
    try {
      // Extract user ID from subscriber object
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

      if (!userId) {
        showNotification("User ID not found", "error");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication required", "error");
        return;
      }

      // Get trainer information using getUserInfo
      const userInfo = await getUserInfo();
      console.log("User info:", userInfo);

      // The trainer ID should be in userInfo.trainerId if the user is a trainer
      let trainerId = null;
      if (userInfo.trainerId) {
        trainerId = userInfo.trainerId;
      } else if (userInfo.isTrainer && userInfo._id) {
        // Fallback to user ID if trainerId is not available but user is a trainer
        trainerId = userInfo._id;
      } else {
        // If no trainer field, this user might not be a trainer
        showNotification("User is not a trainer", "error");
        return;
      }

      console.log("Trainer ID:", trainerId);

      // Fetch existing meal plan
      const response = await fetch(
        `/api/v1/meal-plans/${trainerId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.mealPlan) {
          setCurrentMealPlan(data.mealPlan);
          // Convert days object to Map for easier manipulation
          const daysMap = new Map();
          Object.entries(data.mealPlan.days || {}).forEach(([day, meals]) => {
            daysMap.set(day, meals);
          });
          setEditMealPlan({
            week: data.mealPlan.week || "default",
            days: daysMap,
          });
        } else {
          // No existing meal plan, create new structure
          initializeNewMealPlan();
        }
      } else if (response.status === 404) {
        // No meal plan found, create new structure
        initializeNewMealPlan();
      } else {
        showNotification("Failed to load meal plan", "error");
      }
    } catch (error) {
      console.error("Error loading meal plan:", error);
      showNotification("Error loading meal plan", "error");
      initializeNewMealPlan();
    } finally {
      setLoading(false);
    }
  };

  const initializeNewMealPlan = () => {
    const daysMap = new Map();
    daysOfWeek.forEach((day) => {
      daysMap.set(day, []);
    });
    setCurrentMealPlan(null);
    setEditMealPlan({
      week: "default",
      days: daysMap,
    });
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      isVisible: true,
      type,
      message,
      autoClose: true,
      duration: 3000,
    });
  };

  const showConfirmDialog = (title, message, action) => {
    console.log("showConfirmDialog called with:", title, message);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirm(true);
  };

  const handleAddMeal = () => {
    if (!newMeal.meal.trim() || !newMeal.type.trim()) {
      showNotification("Meal name and type are required", "error");
      return;
    }

    if (!newMeal.calories || newMeal.calories <= 0) {
      showNotification("Valid calories are required", "error");
      return;
    }

    if (
      !newMeal.protein.trim() ||
      !newMeal.carbs.trim() ||
      !newMeal.fats.trim()
    ) {
      showNotification("Protein, carbs, and fats are required", "error");
      return;
    }

    if (!newMeal.recipe.trim()) {
      showNotification("Recipe is required", "error");
      return;
    }

    const currentDayMeals = editMealPlan.days.get(selectedDay) || [];
    const updatedMeals = [...currentDayMeals, { ...newMeal, id: Date.now() }];

    const newDaysMap = new Map(editMealPlan.days);
    newDaysMap.set(selectedDay, updatedMeals);

    setEditMealPlan({
      ...editMealPlan,
      days: newDaysMap,
    });

    setShowAddMeal(false);
    setNewMeal({
      type: "Breakfast",
      time: "08:00",
      meal: "",
      calories: 0,
      protein: "",
      carbs: "",
      fats: "",
      recipe: "",
    });
    showNotification("Meal added successfully", "success");
  };

  const handleRemoveMeal = (dayName, mealIndex) => {
    showConfirmDialog(
      "Remove Meal",
      "Are you sure you want to remove this meal?",
      () => {
        const currentDayMeals = editMealPlan.days.get(dayName) || [];
        const updatedMeals = currentDayMeals.filter(
          (_, index) => index !== mealIndex
        );

        const newDaysMap = new Map(editMealPlan.days);
        newDaysMap.set(dayName, updatedMeals);

        setEditMealPlan({
          ...editMealPlan,
          days: newDaysMap,
        });
        showNotification("Meal removed successfully", "success");
      }
    );
  };

  const handleSaveMealPlan = async () => {
    setSaving(true);
    try {
      // Extract user ID from subscriber object
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

      if (!userId) {
        showNotification("User ID not found", "error");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Authentication required", "error");
        return;
      }

      // Convert Map back to object for API
      const daysObject = {};
      editMealPlan.days.forEach((meals, day) => {
        if (meals.length > 0) {
          daysObject[day] = meals;
        }
      });

      // Check if there are any meals to save
      if (Object.keys(daysObject).length === 0) {
        showNotification("Please add at least one meal before saving", "error");
        return;
      }

      const mealPlanData = {
        userId,
        week: editMealPlan.week,
        days: daysObject,
      };

      let response;
      if (currentMealPlan) {
        // Update existing meal plan
        response = await fetch(`/api/v1/meal-plans/${currentMealPlan._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealPlanData),
        });
      } else {
        // Create new meal plan
        response = await fetch("/api/v1/meal-plans/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mealPlanData),
        });
      }

      if (response.ok) {
        const data = await response.json();
        setCurrentMealPlan(data.mealPlan);
        showNotification(
          currentMealPlan
            ? "Meal plan updated successfully"
            : "Meal plan created successfully",
          "success"
        );
        if (onMealPlanUpdate) {
          onMealPlanUpdate(data.mealPlan);
        }
      } else {
        const errorData = await response.json();
        showNotification(
          errorData.message || "Failed to save meal plan",
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      showNotification("Error saving meal plan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMealPlan = async () => {
    console.log("Delete meal plan clicked", currentMealPlan);
    if (!currentMealPlan) return;

    showConfirmDialog(
      "Delete Meal Plan",
      "Are you sure you want to delete this meal plan? This action cannot be undone.",
      async () => {
        console.log("Delete confirmed, executing delete operation");
        try {
          const token = localStorage.getItem("token");
          console.log("Token:", token ? "exists" : "missing");
          console.log("Deleting meal plan with ID:", currentMealPlan._id);

          const response = await fetch(
            `/api/v1/meal-plans/${currentMealPlan._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Delete response status:", response.status);

          if (response.ok) {
            console.log("Delete successful");
            setCurrentMealPlan(null);
            initializeNewMealPlan();
            showNotification("Meal plan deleted successfully", "success");
            if (onMealPlanUpdate) {
              onMealPlanUpdate(null);
            }
          } else {
            const errorData = await response.json();
            console.log("Delete failed:", errorData);
            showNotification(
              errorData.message || "Failed to delete meal plan",
              "error"
            );
          }
        } catch (error) {
          console.error("Error deleting meal plan:", error);
          showNotification("Error deleting meal plan", "error");
        }
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#18182f] rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            Assign Meal Plan -{" "}
            {subscriber?.name || subscriber?.userId?.name || "User"}
          </h3>
          <button
            className="text-white/70 hover:text-white text-2xl"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f67a45]"></div>
          </div>
        ) : (
          <div className="flex h-[70vh]">
            {/* Days Sidebar */}
            <div className="w-48 border-r border-[#232342] pr-4">
              <h4 className="text-white font-semibold mb-4">Days of Week</h4>
              <div className="space-y-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedDay === day
                        ? "bg-[#f67a45] text-white"
                        : "bg-[#121225] text-white/80 hover:bg-[#232342]"
                    }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="font-medium">{day}</div>
                    <div className="text-xs opacity-80">
                      {editMealPlan.days.get(day)?.length || 0} meals
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pl-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold text-lg">
                  {selectedDay} - Meals
                </h4>
                <button
                  className="px-4 py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                  onClick={() => setShowAddMeal(true)}
                >
                  <FaPlus /> Add Meal
                </button>
              </div>

              {/* Meals List */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {(editMealPlan.days.get(selectedDay) || []).map(
                  (meal, index) => (
                    <div
                      key={index}
                      className="bg-[#121225] rounded-lg p-4 border border-[#232342]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-[#f67a45] text-white text-xs px-2 py-1 rounded">
                              {meal.type}
                            </span>
                            <span className="text-white/80 text-sm">
                              {meal.time}
                            </span>
                          </div>
                          <h5 className="text-white font-medium mb-2">
                            {meal.meal}
                          </h5>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="text-white/80">
                              <span className="text-white/60">Calories:</span>{" "}
                              {meal.calories}
                            </div>
                            <div className="text-white/80">
                              <span className="text-white/60">Protein:</span>{" "}
                              {meal.protein}
                            </div>
                            <div className="text-white/80">
                              <span className="text-white/60">Carbs:</span>{" "}
                              {meal.carbs}
                            </div>
                            <div className="text-white/80">
                              <span className="text-white/60">Fats:</span>{" "}
                              {meal.fats}
                            </div>
                          </div>
                          {meal.recipe && (
                            <div className="mt-2 text-white/70 text-sm">
                              <span className="text-white/60">Recipe:</span>{" "}
                              {meal.recipe}
                            </div>
                          )}
                        </div>
                        <button
                          className="text-red-400 hover:text-red-300 ml-4"
                          onClick={() => handleRemoveMeal(selectedDay, index)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  )
                )}

                {(!editMealPlan.days.get(selectedDay) ||
                  editMealPlan.days.get(selectedDay).length === 0) && (
                  <div className="text-center text-white/60 py-8">
                    No meals added for {selectedDay}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between mt-6 pt-4 border-t border-[#232342]">
          <div>
            {currentMealPlan && (
              <button
                className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                onClick={handleDeleteMealPlan}
              >
                <FaTrash /> Delete Meal Plan
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              className="px-6 py-2 border border-gray-400 rounded-lg text-white hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                saving
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#f67a45] hover:bg-[#e56d3d]"
              }`}
              onClick={handleSaveMealPlan}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Meal Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
          <div className="bg-[#18182f] rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-semibold">
                Add Meal to {selectedDay}
              </h4>
              <button
                className="text-white/70 hover:text-white text-2xl"
                onClick={() => setShowAddMeal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Meal Type
                </label>
                <select
                  value={newMeal.type}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, type: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                >
                  {defaultMealTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Meal Name *
                </label>
                <input
                  type="text"
                  value={newMeal.meal}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, meal: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Time</label>
                <input
                  type="time"
                  value={newMeal.time}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, time: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Calories *
                  </label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) =>
                      setNewMeal({
                        ...newMeal,
                        calories: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                    placeholder="450"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Protein *
                  </label>
                  <input
                    type="text"
                    value={newMeal.protein}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, protein: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                    placeholder="30g"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Carbs *
                  </label>
                  <input
                    type="text"
                    value={newMeal.carbs}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, carbs: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                    placeholder="45g"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Fats *
                  </label>
                  <input
                    type="text"
                    value={newMeal.fats}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, fats: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white"
                    placeholder="12g"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Recipe *
                </label>
                <textarea
                  value={newMeal.recipe}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, recipe: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-[#121225] border border-[#232342] text-white min-h-[80px]"
                  placeholder="1. Grill chicken breast for 6-8 minutes each side..."
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 border border-gray-400 rounded-lg text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setShowAddMeal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#f67a45] rounded-lg text-white hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
                  onClick={handleAddMeal}
                >
                  <FaPlus /> Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={() => {
          console.log(
            "ConfirmDialog onConfirm clicked, executing confirmAction"
          );
          confirmAction();
          setShowConfirm(false);
        }}
        onClose={() => setShowConfirm(false)}
      />

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
        autoClose={notification.autoClose}
        duration={notification.duration}
      />
    </div>
  );
};

export default AssignMealPlanModal;

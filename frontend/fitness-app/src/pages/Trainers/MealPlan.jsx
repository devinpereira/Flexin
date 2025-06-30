import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainerLayout from "../../components/Trainers/TrainerLayout";
import { FaPrint } from "react-icons/fa";
import { BsCalendarWeek } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { BiChat } from "react-icons/bi";
import { RiVipDiamondLine } from "react-icons/ri";
import { getMealPlan } from "../../api/mealPlan";
import { getTrainerById } from "../../api/trainer"; // <-- Add this import

const MealPlan = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState("Monday");
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const printContent = useRef(null);

  // State for fetched data
  const [weeklyMealPlans, setWeeklyMealPlans] = useState({});
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get userId from localStorage or your auth context
  const userId = localStorage.getItem("userId");
  console.log("User ID from localStorage:", userId);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        // Fetch meal plan
        const data = await getMealPlan(trainerId, userId);
        setWeeklyMealPlans(data.mealPlan?.days || {});
        const days = Object.keys(data.mealPlan?.days || {});
        if (days.length > 0) setActiveDay(days[0]);

        // Fetch trainer info
        const trainerData = await getTrainerById(trainerId);
        setTrainer(trainerData);
      } catch (err) {
        setError("No meal plan found for you and this trainer yet.");
        setWeeklyMealPlans({});
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [trainerId, userId]);

  const days = Object.keys(weeklyMealPlans);

  // Handle printing the meal plan
  const handlePrint = () => {
    const printArea = document.createElement("div");
    printArea.innerHTML = `
      <html>
        <head>
          <title>Weekly Meal Plan for ${trainer?.name || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f67a45; padding-bottom: 10px; }
            .day-section { margin-bottom: 30px; }
            .day-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; background-color: #f0f0f0; padding: 5px 10px; }
            .meal-item { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd; }
            .meal-type { font-weight: bold; margin-bottom: 5px; }
            .meal-time { color: #666; font-size: 12px; margin-bottom: 5px; }
            .meal-name { margin-bottom: 5px; }
            .meal-nutrition { font-size: 12px; color: #666; margin-bottom: 5px; }
            .recipe { font-size: 12px; white-space: pre-line; padding-left: 10px; border-left: 2px solid #f67a45; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Weekly Meal Plan</h1>
            <p>Trainer: ${trainer?.name || ""} - ${trainer?.specialty || ""}</p>
          </div>
          ${days
            .map(
              (day) => `
            <div class="day-section">
              <div class="day-title">${day}</div>
              ${(weeklyMealPlans[day] || [])
                .map(
                  (meal) => `
                <div class="meal-item">
                  <div class="meal-type">${meal.type} - <span class="meal-time">${meal.time}</span></div>
                  <div class="meal-name">${meal.meal}</div>
                  <div class="meal-nutrition">
                    Calories: ${meal.calories} | Protein: ${meal.protein} | Carbs: ${meal.carbs} | Fats: ${meal.fats}
                  </div>
                  <div class="recipe">
                    ${meal.recipe}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(printArea.innerHTML);
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error)
    return (
      <div className="text-yellow-400 bg-[#23233a] rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">No Meal Plan Found</h2>
        <p>
          {error}
          <br />
          Please contact your trainer to get started!
        </p>
      </div>
    );

  return (
    <TrainerLayout pageTitle={`${trainer?.name || ""}'s Meal Plan`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Left side - Meal Plan content */}
        <div className="lg:col-span-3">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
                Weekly Meal Plan
              </h2>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 text-white bg-gray-700/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-gray-600/60 transition-colors text-sm"
              >
                <FaPrint size={14} />
                <span>Print</span>
              </button>
            </div>
            {/* Days navigation */}
            <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hidden">
              <div className="flex space-x-2 min-w-max">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap ${
                      activeDay === day
                        ? "bg-white text-[#121225]"
                        : "bg-transparent text-white border border-white/30"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            {/* Meals for selected day */}
            <div className="space-y-3 sm:space-y-4">
              {(weeklyMealPlans[activeDay] || []).map((meal) => (
                <div key={meal._id} className="bg-white rounded-lg p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between mb-2">
                    <h3 className="font-bold text-[#121225] text-base sm:text-lg">
                      {meal.type}
                    </h3>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {meal.time}
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                    {meal.meal}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      Calories: {meal.calories}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      Protein: {meal.protein}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      Carbs: {meal.carbs}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded">
                      Fats: {meal.fats}
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => setViewingRecipe(meal)}
                      className="text-[#f67a45] hover:underline text-xs sm:text-sm mr-3 sm:mr-4"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right side - Trainer info and actions */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4">
                <img
                  src={trainer?.image}
                  alt={trainer?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/profile1.png";
                  }}
                />
              </div>
              <h3 className="text-white text-lg sm:text-xl font-medium">
                {trainer.name}
              </h3>
              <p className="text-gray-400 mb-2 text-sm sm:text-base">
                {trainer.specialty}
              </p>
              <a
                onClick={() => navigate(`/trainers/${trainerId}`)}
                className="text-[#f67a45] hover:underline text-sm cursor-pointer"
              >
                View Profile
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-3">
              <button
                onClick={() => navigate(`/schedule/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BsCalendarWeek size={14} />
                <span>Schedule</span>
              </button>
              <button className="bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2 text-sm">
                <GiMeal size={14} />
                <span>Meal Plan</span>
              </button>
              <button
                onClick={() => navigate(`/chat/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <BiChat size={14} />
                <span>Chat</span>
              </button>
              <button
                onClick={() => navigate(`/subscription/${trainerId}`)}
                className="bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <RiVipDiamondLine size={14} />
                <span>Subscription</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Recipe Viewing Modal */}
      {viewingRecipe && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {viewingRecipe.type}: {viewingRecipe.meal}
              </h3>
              <button
                onClick={() => setViewingRecipe(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-3 sm:mb-4">
              <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Recipe:
              </h4>
              <pre className="text-gray-700 whitespace-pre-line text-xs sm:text-sm">
                {viewingRecipe.recipe}
              </pre>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                Calories: {viewingRecipe.calories}
              </div>
              <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                Protein: {viewingRecipe.protein}
              </div>
              <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                Carbs: {viewingRecipe.carbs}
              </div>
              <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                Fats: {viewingRecipe.fats}
              </div>
            </div>
            <button
              onClick={() => setViewingRecipe(null)}
              className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </TrainerLayout>
  );
};

export default MealPlan;

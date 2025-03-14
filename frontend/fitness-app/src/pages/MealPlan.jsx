import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FaUserFriends, FaPrint } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdEdit, MdSave } from 'react-icons/md';
import { BsCalendarWeek } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

const MealPlan = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [activeDay, setActiveDay] = useState('Monday');
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  
  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "John Smith",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning"
  };

  // Initialize meal plan data with state
  const [weeklyMealPlans, setWeeklyMealPlans] = useState({
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
      },
      { 
        id: 2, 
        type: "Lunch", 
        time: "12:30 PM",
        meal: "Grilled Chicken Salad with Quinoa", 
        calories: 550, 
        protein: "40g", 
        carbs: "35g", 
        fats: "18g",
        recipe: "1. Grill 6oz chicken breast with herbs\n2. Cook 1/2 cup quinoa\n3. Add mixed greens, cherry tomatoes\n4. Dress with olive oil and lemon juice"
      },
      { 
        id: 3, 
        type: "Pre-Workout", 
        time: "4:00 PM",
        meal: "Banana and Protein Bar", 
        calories: 250, 
        protein: "15g", 
        carbs: "30g", 
        fats: "8g",
        recipe: "1. One medium banana\n2. One protein bar (15g protein minimum)"
      },
      { 
        id: 4, 
        type: "Dinner", 
        time: "7:30 PM",
        meal: "Salmon with Sweet Potato and Broccoli", 
        calories: 650, 
        protein: "45g", 
        carbs: "40g", 
        fats: "22g",
        recipe: "1. Bake 6oz salmon fillet with lemon\n2. Roast 1 medium sweet potato\n3. Steam 1 cup broccoli florets\n4. Season with herbs and spices"
      }
    ],
    "Tuesday": [
      { 
        id: 5, 
        type: "Breakfast", 
        time: "7:00 AM",
        meal: "Scrambled Eggs with Avocado Toast", 
        calories: 520, 
        protein: "28g", 
        carbs: "35g", 
        fats: "25g",
        recipe: "1. Scramble 3 whole eggs\n2. Toast 2 slices whole grain bread\n3. Spread 1/2 avocado on toast\n4. Season with salt and pepper"
      },
      { 
        id: 6, 
        type: "Lunch", 
        time: "12:30 PM",
        meal: "Turkey Wrap with Vegetables", 
        calories: 480, 
        protein: "35g", 
        carbs: "40g", 
        fats: "15g",
        recipe: "1. Use whole grain wrap\n2. Add 5oz turkey breast\n3. Add lettuce, tomato, cucumber\n4. Dress with hummus or mustard"
      },
      { 
        id: 7, 
        type: "Pre-Workout", 
        time: "4:00 PM",
        meal: "Greek Yogurt with Honey and Nuts", 
        calories: 300, 
        protein: "20g", 
        carbs: "25g", 
        fats: "12g",
        recipe: "1. 1 cup Greek yogurt\n2. Add 1 tbsp honey\n3. Add 1 oz mixed nuts\n4. Optional: add cinnamon"
      },
      { 
        id: 8, 
        type: "Dinner", 
        time: "7:30 PM",
        meal: "Lean Beef Stir Fry with Brown Rice", 
        calories: 600, 
        protein: "42g", 
        carbs: "50g", 
        fats: "18g",
        recipe: "1. Stir fry 5oz lean beef\n2. Add bell peppers, onions, broccoli\n3. Serve with 1/2 cup brown rice\n4. Season with soy sauce or teriyaki"
      }
    ],
    "Wednesday": [
      { 
        id: 9, 
        type: "Breakfast", 
        time: "7:00 AM",
        meal: "Protein Pancakes with Berries", 
        calories: 480, 
        protein: "25g", 
        carbs: "55g", 
        fats: "14g",
        recipe: "1. Mix 1 scoop protein powder with pancake mix\n2. Cook pancakes on low heat\n3. Top with 1 cup mixed berries\n4. Add small amount maple syrup"
      },
      { 
        id: 10, 
        type: "Lunch", 
        time: "12:30 PM",
        meal: "Tuna Salad with Whole Grain Bread", 
        calories: 520, 
        protein: "38g", 
        carbs: "42g", 
        fats: "16g",
        recipe: "1. Mix 1 can tuna with light mayo\n2. Add diced celery and onions\n3. Serve with 2 slices whole grain bread\n4. Add lettuce and tomato"
      }
    ]
  });
  
  const days = Object.keys(weeklyMealPlans);


  // Handle saving edited meal
  const handleSaveMeal = () => {
    if (!editingMeal) return;
    
    // Create a new copy of weekly meal plans
    const updatedMealPlans = {...weeklyMealPlans};
    
    // Find the day that contains the meal
    for (const day of days) {
      const mealIndex = updatedMealPlans[day].findIndex(meal => meal.id === editingMeal.id);
      
      if (mealIndex !== -1) {
        // Update the meal in the array
        updatedMealPlans[day][mealIndex] = editingMeal;
        break;
      }
    }
    
    // Update state and close modal
    setWeeklyMealPlans(updatedMealPlans);
    setEditingMeal(null);
  };

  // Handle editing a meal field
  const handleEditField = (field, value) => {
    if (!editingMeal) return;
    
    setEditingMeal({
      ...editingMeal,
      [field]: value
    });
  };

  // Handle printing the meal plan
  const handlePrint = () => {
    const printArea = document.createElement('div');
    printArea.innerHTML = `
      <html>
        <head>
          <title>Weekly Meal Plan for ${trainer.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #f67a45;
              padding-bottom: 10px;
            }
            .day-section {
              margin-bottom: 30px;
            }
            .day-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              background-color: #f0f0f0;
              padding: 5px 10px;
            }
            .meal-item {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #ddd;
            }
            .meal-type {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .meal-time {
              color: #666;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .meal-name {
              margin-bottom: 5px;
            }
            .meal-nutrition {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .recipe {
              font-size: 12px;
              white-space: pre-line;
              padding-left: 10px;
              border-left: 2px solid #f67a45;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Weekly Meal Plan</h1>
            <p>Trainer: ${trainer.name} - ${trainer.specialty}</p>
          </div>
          ${days.map(day => `
            <div class="day-section">
              <div class="day-title">${day}</div>
              ${weeklyMealPlans[day].map(meal => `
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
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printArea.innerHTML);
    printWindow.document.close();
    
    // Trigger print when content is loaded
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      }
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto pt-8 px-4 flex">
        {/* Left Navigation */}
        <div className="fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              {/* My Trainers */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('My Trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>
              
              {/* Explore */}
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('Explore');
                }}
              >
                <MdExplore size={20} />
                <span>Explore</span>
              </a>

              <div className="mt-32 border-t border-white/20 pt-6">
                <div className="flex items-center gap-3">
                  <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                  <span className="text-white">Account</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="ml-[300px] flex-1">
          <button 
            onClick={() => navigate(`/schedule/${trainerId}`)}
            className="mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Schedule</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left side - Meal Plan content */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-white text-2xl font-bold">Weekly Meal Plan</h2>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-white bg-gray-700/50 px-4 py-2 rounded-full hover:bg-gray-600/60 transition-colors"
                  >
                    <FaPrint size={16} />
                    <span>Print</span>
                  </button>
                </div>
                
                {/* Hidden printable section */}
                <div id="printable-meal-plan" className="hidden">
                  {/* This is populated during print */}
                </div>
                
                {/* Days navigation */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-6 py-2 rounded-full ${
                        activeDay === day
                          ? 'bg-white text-[#121225]'
                          : 'bg-transparent text-white border border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                {/* Meals for selected day */}
                <div className="space-y-4">
                  {weeklyMealPlans[activeDay]?.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg p-4">
                      <div className="flex flex-wrap items-center justify-between mb-2">
                        <h3 className="font-bold text-[#121225] text-lg">{meal.type}</h3>
                        <span className="text-gray-500 text-sm">{meal.time}</span>
                      </div>
                      
                      <p className="text-gray-700 font-medium mb-2">{meal.meal}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="bg-gray-100 px-3 py-1 rounded">
                          Calories: {meal.calories}
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded">
                          Protein: {meal.protein}
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded">
                          Carbs: {meal.carbs}
                        </div>
                        <div className="bg-gray-100 px-3 py-1 rounded">
                          Fats: {meal.fats}
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setViewingRecipe(meal)}
                          className="text-[#f67a45] hover:underline text-sm mr-4"
                        >
                          View Recipe
                        </button>
                        <button
                          onClick={() => setEditingMeal({...meal})}
                          className="text-[#f67a45] hover:underline text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right side - Trainer info and actions */}
            <div className="lg:col-span-1">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img 
                      src={trainer.image} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/profile1.png';
                      }}
                    />
                  </div>
                  <h3 className="text-white text-xl font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2">{trainer.specialty}</p>
                  <a 
                    onClick={() => navigate(`/trainer-profile/${trainerId}`)}
                    className="text-[#f67a45] hover:underline text-sm cursor-pointer"
                  >
                  View Profile
                  </a>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate(`/schedule/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BsCalendarWeek />
                    <span>Schedule</span>
                  </button>
                  
                  <button className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2">
                    <GiMeal />
                    <span>Meal Plan</span>
                  </button>
                      
                  <button 
                    onClick={() => navigate(`/chat/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <BiChat />
                    <span>Chat</span>
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/subscription/${trainerId}`)}
                    className="w-full bg-gray-700/50 text-white py-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                  <RiVipDiamondLine />
                  <span>Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Recipe Viewing Modal */}
{viewingRecipe && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{viewingRecipe.type}: {viewingRecipe.meal}</h3>
        <button 
          onClick={() => setViewingRecipe(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Recipe:</h4>
        <pre className="text-gray-700 whitespace-pre-line">{viewingRecipe.recipe}</pre>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="bg-gray-100 px-3 py-1 rounded">
          Calories: {viewingRecipe.calories}
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded">
          Protein: {viewingRecipe.protein}
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded">
          Carbs: {viewingRecipe.carbs}
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded">
          Fats: {viewingRecipe.fats}
        </div>
      </div>
      
      <button 
        onClick={() => setViewingRecipe(null)}
        className="w-full bg-[#f67a45] text-white py-2 rounded-full hover:bg-[#e56d3d] transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}

{/* Meal Editing Modal */}
{editingMeal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Edit {editingMeal.type}</h3>
        <button 
          onClick={() => setEditingMeal(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Meal Name</label>
          <input 
            type="text" 
            value={editingMeal.meal} 
            onChange={(e) => handleEditField('meal', e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Time</label>
          <input 
            type="text" 
            value={editingMeal.time} 
            onChange={(e) => handleEditField('time', e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Calories</label>
            <input 
              type="number" 
              value={editingMeal.calories} 
              onChange={(e) => handleEditField('calories', parseInt(e.target.value))}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Protein</label>
            <input 
              type="text" 
              value={editingMeal.protein} 
              onChange={(e) => handleEditField('protein', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Carbs</label>
            <input 
              type="text" 
              value={editingMeal.carbs} 
              onChange={(e) => handleEditField('carbs', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Fats</label>
            <input 
              type="text" 
              value={editingMeal.fats} 
              onChange={(e) => handleEditField('fats', e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Recipe</label>
          <textarea 
            value={editingMeal.recipe} 
            onChange={(e) => handleEditField('recipe', e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f67a45] min-h-[100px]"
          />
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={() => setEditingMeal(null)}
            className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSaveMeal}
            className="px-6 py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors flex items-center gap-2"
          >
            <MdSave size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
)}
</div>
);
};

export default MealPlan;
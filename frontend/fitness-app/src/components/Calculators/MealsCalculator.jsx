import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';

// Basic food database - in a real app, this would come from an API
const foodDatabase = [
  { id: 1, name: 'Chicken Breast', calories: 165, fat: 3.6, carbs: 0, protein: 31 },
  { id: 2, name: 'Brown Rice', calories: 112, fat: 0.9, carbs: 23, protein: 2.6 },
  { id: 3, name: 'Broccoli', calories: 34, fat: 0.4, carbs: 7, protein: 2.8 },
  { id: 4, name: 'Salmon', calories: 208, fat: 13, carbs: 0, protein: 22 },
  { id: 5, name: 'Sweet Potato', calories: 86, fat: 0.1, carbs: 20, protein: 1.6 },
  { id: 6, name: 'Egg', calories: 78, fat: 5.3, carbs: 0.6, protein: 6.3 },
  { id: 7, name: 'Avocado', calories: 160, fat: 15, carbs: 9, protein: 2 },
  { id: 8, name: 'Greek Yogurt', calories: 59, fat: 0.4, carbs: 3.6, protein: 10 },
  { id: 9, name: 'Banana', calories: 89, fat: 0.3, carbs: 23, protein: 1.1 },
  { id: 10, name: 'Oats', calories: 389, fat: 6.9, carbs: 66, protein: 16.9 },
  { id: 11, name: 'Protein Powder (Whey)', calories: 120, fat: 2, carbs: 3, protein: 24 },
  { id: 12, name: 'Almond Milk', calories: 13, fat: 1.1, carbs: 0.6, protein: 0.4 },
  { id: 13, name: 'Spinach', calories: 23, fat: 0.4, carbs: 3.6, protein: 2.9 },
  { id: 14, name: 'Ground Beef (Lean)', calories: 250, fat: 15, carbs: 0, protein: 26 },
  { id: 15, name: 'Quinoa', calories: 120, fat: 1.9, carbs: 21, protein: 4.4 },
];

const MealsCalculator = () => {
  // State for UI
  const [expanded, setExpanded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showCustomFoodForm, setShowCustomFoodForm] = useState(false);
  
  // State for food selection
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [foodWeight, setFoodWeight] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  
  // State for custom food
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    fat: '',
    carbs: '',
    protein: ''
  });
  
  // State for calculator results
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0
  });
  
  // Load last result on mount
  useEffect(() => {
    try {
      const mealsHistory = JSON.parse(localStorage.getItem('mealsHistory')) || [];
      if (mealsHistory.length > 0) {
        const lastMeal = mealsHistory[mealsHistory.length - 1];
        setLastResult(lastMeal.totals);
      }
    } catch (error) {
      console.error('Error loading meals history:', error);
    }
  }, []);
  
  // Calculate nutrition totals when selected foods change
  useEffect(() => {
    if (selectedFoods.length === 0) {
      setNutritionTotals({ calories: 0, fat: 0, carbs: 0, protein: 0 });
      return;
    }
    
    const totals = selectedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        fat: acc.fat + food.fat,
        carbs: acc.carbs + food.carbs,
        protein: acc.protein + food.protein
      };
    }, { calories: 0, fat: 0, carbs: 0, protein: 0 });
    
    // Round to 1 decimal place
    setNutritionTotals({
      calories: Math.round(totals.calories * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      protein: Math.round(totals.protein * 10) / 10
    });
  }, [selectedFoods]);

  // Handle adding a food to the meal
  const handleAddFood = () => {
    if (selectedFoodId === 'custom') {
      // Validate custom food inputs
      if (!customFood.name || !customFood.calories || !customFood.fat || !customFood.carbs || !customFood.protein || !foodWeight) {
        alert('Please fill all fields for your custom food');
        return;
      }
      
      const weight = parseFloat(foodWeight);
      if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight');
        return;
      }
      
      // Add custom food with calculated nutrition based on weight
      const newFood = {
        id: `custom-${Date.now()}`,
        name: customFood.name,
        weight,
        caloriesPer100g: parseFloat(customFood.calories),
        fatPer100g: parseFloat(customFood.fat),
        carbsPer100g: parseFloat(customFood.carbs),
        proteinPer100g: parseFloat(customFood.protein),
        calories: (parseFloat(customFood.calories) * weight) / 100,
        fat: (parseFloat(customFood.fat) * weight) / 100,
        carbs: (parseFloat(customFood.carbs) * weight) / 100,
        protein: (parseFloat(customFood.protein) * weight) / 100
      };
      
      setSelectedFoods([...selectedFoods, newFood]);
      resetFoodForm();
      
    } else if (selectedFoodId && foodWeight) {
      const weight = parseFloat(foodWeight);
      if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid weight');
        return;
      }
      
      const selectedFood = foodDatabase.find(food => food.id === parseInt(selectedFoodId));
      if (!selectedFood) return;
      
      // Add selected food with calculated nutrition based on weight
      const newFood = {
        id: `${selectedFood.id}-${Date.now()}`,
        name: selectedFood.name,
        weight,
        caloriesPer100g: selectedFood.calories,
        fatPer100g: selectedFood.fat,
        carbsPer100g: selectedFood.carbs,
        proteinPer100g: selectedFood.protein,
        calories: (selectedFood.calories * weight) / 100,
        fat: (selectedFood.fat * weight) / 100,
        carbs: (selectedFood.carbs * weight) / 100,
        protein: (selectedFood.protein * weight) / 100
      };
      
      setSelectedFoods([...selectedFoods, newFood]);
      resetFoodForm();
    } else {
      alert('Please select a food and enter a weight');
    }
  };
  
  // Handle removing a food from the meal
  const handleRemoveFood = (foodId) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
  };
  
  // Reset the food selection form
  const resetFoodForm = () => {
    setSelectedFoodId('');
    setFoodWeight('');
    setCustomFood({
      name: '',
      calories: '',
      fat: '',
      carbs: '',
      protein: ''
    });
    setShowCustomFoodForm(false);
  };
  
  // Handle food selection change
  const handleFoodChange = (e) => {
    const value = e.target.value;
    setSelectedFoodId(value);
    
    if (value === 'custom') {
      setShowCustomFoodForm(true);
    } else {
      setShowCustomFoodForm(false);
    }
  };
  
  // Handle changes to custom food inputs
  const handleCustomFoodChange = (e) => {
    const { name, value } = e.target;
    setCustomFood(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save the current meal calculation
  const handleSaveMeal = () => {
    if (selectedFoods.length === 0) {
      alert('Please add at least one food to save this meal');
      return;
    }
    
    try {
      const mealsHistory = JSON.parse(localStorage.getItem('mealsHistory')) || [];
      mealsHistory.push({
        date: new Date().toISOString(),
        foods: selectedFoods,
        totals: nutritionTotals
      });
      localStorage.setItem('mealsHistory', JSON.stringify(mealsHistory));
      setLastResult(nutritionTotals);
      
      alert('Meal saved successfully!');
    } catch (error) {
      console.error('Error saving meal history:', error);
      alert('Failed to save meal');
    }
  };
  
  // Clear all selected foods
  const handleClearMeal = () => {
    setSelectedFoods([]);
    resetFoodForm();
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Header */}
      <div 
        className="bg-[#121225] text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-bold">Meals Calculator</h3>
        <div className="flex items-center gap-3">
          {lastResult && (
            <span className="bg-white/10 px-3 py-1 rounded-lg text-sm">
              Last Meal: <span className="font-bold">{lastResult.calories}</span> calories
            </span>
          )}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Inputs */}
          <div className="flex-1 p-6">
            <h4 className="text-[#121225] font-medium mb-4">Add Foods to Your Meal</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="food">
                  Select Food
                </label>
                <select
                  id="food"
                  value={selectedFoodId}
                  onChange={handleFoodChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                >
                  <option value="">Select a food</option>
                  {foodDatabase.map(food => (
                    <option key={food.id} value={food.id}>
                      {food.name} ({food.calories} cal per 100g)
                    </option>
                  ))}
                  <option value="custom">+ Add Custom Food</option>
                </select>
              </div>
              
              {showCustomFoodForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-3">Custom Food Details (per 100g)</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="customName">
                        Food Name
                      </label>
                      <input
                        type="text"
                        id="customName"
                        name="name"
                        value={customFood.name}
                        onChange={handleCustomFoodChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                        placeholder="e.g. Homemade Granola"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="customCalories">
                          Calories (kcal)
                        </label>
                        <input
                          type="number"
                          id="customCalories"
                          name="calories"
                          value={customFood.calories}
                          onChange={handleCustomFoodChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                          placeholder="per 100g"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="customFat">
                          Fat (g)
                        </label>
                        <input
                          type="number"
                          id="customFat"
                          name="fat"
                          value={customFood.fat}
                          onChange={handleCustomFoodChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                          placeholder="per 100g"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="customCarbs">
                          Carbs (g)
                        </label>
                        <input
                          type="number"
                          id="customCarbs"
                          name="carbs"
                          value={customFood.carbs}
                          onChange={handleCustomFoodChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                          placeholder="per 100g"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 text-xs font-medium mb-1" htmlFor="customProtein">
                          Protein (g)
                        </label>
                        <input
                          type="number"
                          id="customProtein"
                          name="protein"
                          value={customFood.protein}
                          onChange={handleCustomFoodChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                          placeholder="per 100g"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="weight">
                  Weight/Amount
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="weight"
                    value={foodWeight}
                    onChange={(e) => setFoodWeight(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                    placeholder="Enter amount"
                    min="1"
                  />
                  <span className="bg-gray-100 px-4 py-2 border-t border-r border-b border-gray-300 rounded-r-lg flex items-center text-gray-500">
                    grams
                  </span>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleAddFood}
                  className="w-full bg-[#f67a45] text-white px-5 py-2 rounded-lg hover:bg-[#e56d3d] transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus size={12} />
                  Add Food to Meal
                </button>
              </div>
              
              {/* Selected Foods List */}
              <div className="mt-6">
                <h4 className="text-[#121225] font-medium mb-3">
                  Foods in Meal 
                  {selectedFoods.length > 0 && <span className="text-sm text-gray-500"> ({selectedFoods.length})</span>}
                </h4>
                
                {selectedFoods.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No foods added yet</p>
                    <p className="text-sm text-gray-400 mt-1">Select foods above to build your meal</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {selectedFoods.map(food => (
                      <div key={food.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-500">{food.weight}g • {Math.round(food.calories)} cal</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFood(food.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedFoods.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveMeal}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1"
                    >
                      Save Meal
                    </button>
                    <button
                      onClick={handleClearMeal}
                      className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Dividing Line */}
          <div className="hidden md:block w-[1px] bg-gray-200 mx-2"></div>
          
          {/* Right Side - Results */}
          <div className="flex-1 p-6 bg-gray-50">
            <h4 className="text-[#121225] font-medium mb-4">Nutrition Breakdown</h4>
            
            {selectedFoods.length > 0 ? (
              <div className="space-y-6">
                {/* Total Calories Card */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                  <h5 className="text-lg text-gray-600 mb-1">Total Calories</h5>
                  <div className="text-4xl font-bold text-[#f67a45]">
                    {Math.round(nutritionTotals.calories)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    kcal
                  </div>
                </div>
                
                {/* Macros Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Fat */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-xl font-bold text-gray-700">
                      {nutritionTotals.fat}g
                    </div>
                    <div className="mt-1 text-sm text-gray-500">Fat</div>
                    <div className="mt-2 h-1 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(nutritionTotals.fat * 9 / nutritionTotals.calories) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.round((nutritionTotals.fat * 9 / nutritionTotals.calories) * 100)}%
                    </div>
                  </div>
                  
                  {/* Carbs */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-xl font-bold text-gray-700">
                      {nutritionTotals.carbs}g
                    </div>
                    <div className="mt-1 text-sm text-gray-500">Carbs</div>
                    <div className="mt-2 h-1 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: `${(nutritionTotals.carbs * 4 / nutritionTotals.calories) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.round((nutritionTotals.carbs * 4 / nutritionTotals.calories) * 100)}%
                    </div>
                  </div>
                  
                  {/* Protein */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-xl font-bold text-gray-700">
                      {nutritionTotals.protein}g
                    </div>
                    <div className="mt-1 text-sm text-gray-500">Protein</div>
                    <div className="mt-2 h-1 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-purple-400 rounded-full"
                        style={{ width: `${(nutritionTotals.protein * 4 / nutritionTotals.calories) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {Math.round((nutritionTotals.protein * 4 / nutritionTotals.calories) * 100)}%
                    </div>
                  </div>
                </div>
                
                {/* Macros Breakdown Chart (Visual representation) */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h5 className="text-base font-medium text-gray-700 mb-3">Macronutrient Breakdown</h5>
                  
                  <div className="h-8 rounded-lg overflow-hidden flex">
                    <div 
                      className="bg-yellow-400 h-full" 
                      style={{ width: `${(nutritionTotals.fat * 9 / nutritionTotals.calories) * 100}%` }}
                      title={`Fat: ${nutritionTotals.fat}g`}
                    ></div>
                    <div 
                      className="bg-blue-400 h-full" 
                      style={{ width: `${(nutritionTotals.carbs * 4 / nutritionTotals.calories) * 100}%` }}
                      title={`Carbs: ${nutritionTotals.carbs}g`}
                    ></div>
                    <div 
                      className="bg-purple-400 h-full" 
                      style={{ width: `${(nutritionTotals.protein * 4 / nutritionTotals.calories) * 100}%` }}
                      title={`Protein: ${nutritionTotals.protein}g`}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                      <span className="text-gray-600">Fat</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                      <span className="text-gray-600">Carbs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
                      <span className="text-gray-600">Protein</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>* Percentages represent caloric contribution of each macronutrient.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center">
                <div className="text-gray-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h5 className="text-gray-500 font-medium">No Foods Added Yet</h5>
                  <p className="text-gray-400 mt-2">
                    Add foods to your meal from the left to see the nutritional breakdown here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealsCalculator;
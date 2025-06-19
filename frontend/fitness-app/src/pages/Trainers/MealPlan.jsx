import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { FaUserFriends, FaPrint, FaPlus } from 'react-icons/fa';
import { MdExplore, MdArrowBack, MdSave } from 'react-icons/md';
import { BsCalendarWeek } from 'react-icons/bs';
import { GiMeal } from 'react-icons/gi';
import { BiChat } from 'react-icons/bi';
import { RiVipDiamondLine } from 'react-icons/ri';

const MealPlan = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('My Trainers');
  const [activeDay, setActiveDay] = useState('Monday');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const printRef = useRef(null);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeSection]);

  // Handle window resize to close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle printing meal plan
  const handlePrint = () => {
    const printContent = document.getElementById('printable-meal-plan');
    const WinPrint = window.open('', '', 'width=900,height=650');
    
    WinPrint.document.write(`
      <html>
        <head>
          <title>Weekly Meal Plan</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .meal { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; }
            h1 { color: #333; }
            h2 { color: #555; }
            .meal-header { display: flex; justify-content: space-between; }
            .nutrition { display: flex; gap: 10px; margin-top: 10px; }
            .nutrition span { background: #f5f5f5; padding: 3px 8px; border-radius: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  // Mock trainer data
  const trainer = {
    id: trainerId,
    name: "John Smith",
    image: "/src/assets/trainer.png",
    specialty: "Strength & Conditioning"
  };

  // Mock meal plan data - for each day of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Weekly meal plan data
  const weeklyMealPlans = {
    Monday: [
      {
        id: 1,
        type: "Breakfast",
        time: "7:00 AM",
        meal: "Protein Oatmeal with Berries",
        calories: 350,
        protein: "24g",
        carbs: "45g",
        fats: "10g",
        recipe: "1. Cook 1/2 cup of rolled oats with 1 cup of water or milk\n2. Stir in 1 scoop of protein powder\n3. Top with 1/2 cup of mixed berries, 1 tbsp of honey, and 1 tbsp of sliced almonds"
      },
      {
        id: 2,
        type: "Snack",
        time: "10:00 AM",
        meal: "Greek Yogurt with Honey",
        calories: 150,
        protein: "15g",
        carbs: "12g",
        fats: "3g",
        recipe: "1. Mix 1 cup of non-fat Greek yogurt with 1 tbsp of honey\n2. Add cinnamon to taste"
      },
      {
        id: 3,
        type: "Lunch",
        time: "1:00 PM",
        meal: "Grilled Chicken Salad",
        calories: 400,
        protein: "35g",
        carbs: "20g",
        fats: "15g",
        recipe: "1. Grill 5oz chicken breast seasoned with salt, pepper, and garlic\n2. Prepare a bed of mixed greens, cherry tomatoes, cucumber, and bell peppers\n3. Add 1 tbsp of olive oil and 1 tbsp of balsamic vinegar as dressing"
      },
      {
        id: 4,
        type: "Snack",
        time: "4:00 PM",
        meal: "Protein Shake with Banana",
        calories: 250,
        protein: "25g",
        carbs: "30g",
        fats: "2g",
        recipe: "1. Blend 1 scoop of protein powder with 1 medium banana, 1 cup of almond milk, and ice"
      },
      {
        id: 5,
        type: "Dinner",
        time: "7:00 PM",
        meal: "Salmon with Sweet Potato and Broccoli",
        calories: 450,
        protein: "30g",
        carbs: "35g",
        fats: "20g",
        recipe: "1. Bake 5oz salmon fillet with lemon, dill, and a drizzle of olive oil\n2. Roast 1 medium sweet potato, cubed, with a sprinkle of cinnamon\n3. Steam 1 cup of broccoli and season with garlic and lemon"
      }
    ],
    // Simplified data for other days
    Tuesday: [
      {
        id: 6,
        type: "Breakfast",
        time: "7:00 AM",
        meal: "Vegetable Omelet with Toast",
        calories: 380,
        protein: "22g",
        carbs: "30g",
        fats: "18g",
        recipe: "1. Whisk 3 eggs and cook with diced bell peppers, spinach, and onions\n2. Serve with 1 slice of whole grain toast"
      },
      {
        id: 7,
        type: "Lunch",
        time: "1:00 PM",
        meal: "Turkey Wrap with Avocado",
        calories: 420,
        protein: "28g",
        carbs: "35g",
        fats: "16g",
        recipe: "1. Use a whole grain wrap filled with 4oz sliced turkey, 1/4 avocado, lettuce, tomato\n2. Add mustard or hummus as a spread"
      }
    ],
    Wednesday: [
      {
        id: 8,
        type: "Breakfast",
        time: "7:00 AM",
        meal: "Protein Pancakes",
        calories: 340,
        protein: "25g",
        carbs: "40g",
        fats: "8g",
        recipe: "1. Mix 1 scoop protein powder, 1 banana, 2 eggs, and 1/4 cup oats\n2. Cook as pancakes and top with berries"
      }
    ],
    Thursday: [
      {
        id: 9,
        type: "Breakfast",
        time: "7:00 AM",
        meal: "Smoothie Bowl",
        calories: 320,
        protein: "20g",
        carbs: "45g",
        fats: "5g",
        recipe: "1. Blend frozen berries, 1 banana, protein powder, and almond milk\n2. Top with granola and chia seeds"
      }
    ],
    Friday: [
      {
        id: 10,
        type: "Breakfast",
        time: "7:00 AM",
        meal: "Breakfast Burrito",
        calories: 400,
        protein: "25g",
        carbs: "35g",
        fats: "18g",
        recipe: "1. Scramble 2 eggs with diced vegetables\n2. Wrap in a whole wheat tortilla with 1/4 avocado and salsa"
      }
    ],
    Saturday: [
      {
        id: 11,
        type: "Breakfast",
        time: "8:00 AM",
        meal: "Avocado Toast with Eggs",
        calories: 350,
        protein: "18g",
        carbs: "30g",
        fats: "20g",
        recipe: "1. Toast 2 slices of whole grain bread\n2. Top with mashed avocado, salt, pepper, and 2 poached eggs"
      }
    ],
    Sunday: [
      {
        id: 12,
        type: "Breakfast",
        time: "8:00 AM",
        meal: "Protein French Toast",
        calories: 380,
        protein: "22g",
        carbs: "45g",
        fats: "10g",
        recipe: "1. Whisk 2 eggs with 1 scoop protein powder, cinnamon, and vanilla\n2. Dip 2 slices of whole grain bread and cook\n3. Top with berries and a drizzle of maple syrup"
      }
    ]
  };

  // Handle editing a meal field
  const handleEditField = (field, value) => {
    setEditingMeal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle saving edited meal
  const handleSaveMeal = () => {
    // In a real app, this would update the database
    console.log("Saving meal:", editingMeal);
    setEditingMeal(null);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#f67a45] text-white p-4 rounded-full shadow-lg"
        >
          <FaUserFriends size={24} />
        </button>
      </div>
      
      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03020d] rounded-t-3xl transition-transform duration-300 transform ${
        isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 pt-2">
          <div className="flex flex-col space-y-4">
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'My Trainers'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/trainers');
              }}
            >
              <FaUserFriends size={20} />
              <span>My Trainers</span>
            </a>
            
            <a
              href="#"
              className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all ${
                activeSection === 'Explore'
                  ? 'bg-[#f67a45] text-white font-medium'
                  : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
              }`}
              onClick={(e) => {
                e.preventDefault();
                navigate('/explore');
              }}
            >
              <MdExplore size={20} />
              <span>Explore</span>
            </a>
            
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center gap-3 px-6 py-2">
                <img src="/src/assets/profile1.png" className="w-10 h-10 rounded-full" alt="Profile" />
                <span className="text-white">Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto pt-4 sm:pt-8 px-4">
        {/* Desktop Side Navigation */}
        <div className="hidden md:block fixed left-0 top-50 z-10 h-screen">
          <nav className="bg-[#03020d] rounded-tr-[30px] w-[275px] p-6 h-full">
            <div className="space-y-6 mt-8">
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'My Trainers'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/trainers');
                }}
              >
                <FaUserFriends size={20} />
                <span>My Trainers</span>
              </a>
              
              <a
                href="#"
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-200 ${
                  activeSection === 'Explore'
                    ? 'bg-[#f67a45] text-white font-medium'
                    : 'text-white hover:bg-[#f67a45]/10 hover:text-[#f67a45]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/explore');
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
        <div className="w-full md:ml-[275px] lg:ml-[300px]">
          <button 
            onClick={() => navigate(`/trainer-profile/${trainerId}`)}
            className="mb-4 sm:mb-6 text-white flex items-center gap-2 hover:text-[#f67a45]"
          >
            <MdArrowBack size={20} />
            <span>Back to Trainer Profile</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Meal Plan Content */}
            <div className="lg:col-span-3">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-8 mb-6 sm:mb-8">
                <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Weekly Meal Plan</h2>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-white bg-gray-700/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-gray-600/60 transition-colors text-sm"
                  >
                    <FaPrint size={14} />
                    <span>Print</span>
                  </button>
                </div>
                
                {/* Hidden element for printing */}
                <div id="printable-meal-plan" className="hidden">
                  <h1>Weekly Meal Plan</h1>
                  <h2>{activeDay}</h2>
                  {weeklyMealPlans[activeDay]?.map((meal) => (
                    <div key={meal.id} className="meal">
                      <div className="meal-header">
                        <h3>{meal.type}: {meal.meal}</h3>
                        <span>{meal.time}</span>
                      </div>
                      <p><strong>Recipe:</strong> {meal.recipe}</p>
                      <div className="nutrition">
                        <span>Calories: {meal.calories}</span>
                        <span>Protein: {meal.protein}</span>
                        <span>Carbs: {meal.carbs}</span>
                        <span>Fats: {meal.fats}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Day selector */}
                <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#f67a45]/30 scrollbar-track-transparent">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap ${
                        activeDay === day
                          ? 'bg-white text-[#121225]'
                          : 'bg-transparent text-white border border-white/30'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                
                {/* Meals for the selected day */}
                <div className="space-y-3 sm:space-y-4">
                  {weeklyMealPlans[activeDay]?.map((meal) => (
                    <div key={meal.id} className="bg-white rounded-lg p-3 sm:p-4">
                      <div className="flex flex-wrap items-center justify-between mb-2">
                        <h3 className="font-bold text-[#121225] text-base sm:text-lg">{meal.type}</h3>
                        <span className="text-gray-500 text-xs sm:text-sm">{meal.time}</span>
                      </div>
                      
                      <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">{meal.meal}</p>
                      
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
                        <button
                          onClick={() => setEditingMeal({...meal})}
                          className="text-[#f67a45] hover:underline text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar - Trainer Info */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 sm:mb-4">
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
                  <h3 className="text-white text-lg sm:text-xl font-medium">{trainer.name}</h3>
                  <p className="text-gray-400 mb-2 text-sm sm:text-base">{trainer.specialty}</p>
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

      {/* Recipe Modal */}
      {viewingRecipe && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">{viewingRecipe.type}: {viewingRecipe.meal}</h3>
              <button 
                onClick={() => setViewingRecipe(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-3 sm:mb-4">
              <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">Recipe:</h4>
              <pre className="text-gray-700 whitespace-pre-line text-xs sm:text-sm">{viewingRecipe.recipe}</pre>
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

      {/* Edit Meal Modal */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full mx-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">Edit {editingMeal.type}</h3>
              <button 
                onClick={() => setEditingMeal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Meal Name</label>
                <input 
                  type="text" 
                  value={editingMeal.meal} 
                  onChange={(e) => handleEditField('meal', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Time</label>
                <input 
                  type="text" 
                  value={editingMeal.time} 
                  onChange={(e) => handleEditField('time', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Calories</label>
                  <input 
                    type="number" 
                    value={editingMeal.calories} 
                    onChange={(e) => handleEditField('calories', parseInt(e.target.value))}
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Protein</label>
                  <input 
                    type="text" 
                    value={editingMeal.protein} 
                    onChange={(e) => handleEditField('protein', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Carbs</label>
                  <input 
                    type="text" 
                    value={editingMeal.carbs} 
                    onChange={(e) => handleEditField('carbs', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Fats</label>
                  <input 
                    type="text" 
                    value={editingMeal.fats} 
                    onChange={(e) => handleEditField('fats', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Recipe</label>
                <textarea 
                  value={editingMeal.recipe} 
                  onChange={(e) => handleEditField('recipe', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#f67a45] min-h-[80px] sm:min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button 
                  onClick={() => setEditingMeal(null)}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={handleSaveMeal}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#f67a45] rounded-full text-white hover:bg-[#e56d3d] transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                >
                  <MdSave size={14} />
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

import MealPlan from '../models/MealPlan.js';
import Trainer from '../models/Trainer.js';
import User from '../models/User.js';

// Get meal plan for a user (optionally by week)
export const getMealPlan = async (req, res) => {
  try {
    const { trainerId, userId } = req.params;
    const { week } = req.query;
    const query = { trainerId, userId };
    if (week) query.week = week;
    
    const mealPlan = await MealPlan.findOne(query)
      .populate('trainerId', 'name email')
      .populate('userId', 'name email');
      
    if (!mealPlan) {
      return res.status(404).json({ 
        message: 'Meal plan not found for the specified trainer, user, and week.' 
      });
    }
    
    res.json({ message: 'Meal plan fetched successfully.', mealPlan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch meal plan.', error: err.message });
  }
};

// Create a new meal plan - Trainer only
export const createMealPlan = async (req, res) => {
  try {
    const { userId, week, days } = req.body;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;

    // Validation
    if (!userId || !week || !days) {
      return res.status(400).json({ 
        message: 'User ID, week, and days are required.' 
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if meal plan already exists for this trainer, user, and week
    const existingMealPlan = await MealPlan.findOne({ trainerId, userId, week });
    if (existingMealPlan) {
      return res.status(409).json({ 
        message: 'Meal plan already exists for this user and week. Use update instead.' 
      });
    }

    // Validate days structure
    if (typeof days !== 'object' || Object.keys(days).length === 0) {
      return res.status(400).json({ 
        message: 'Days must be a non-empty object with meal plans.' 
      });
    }

    // Validate meal structure for each day
    for (const [day, meals] of Object.entries(days)) {
      if (!Array.isArray(meals)) {
        return res.status(400).json({ 
          message: `Meals for ${day} must be an array.` 
        });
      }
      
      for (const meal of meals) {
        const requiredFields = ['type', 'time', 'meal', 'calories', 'protein', 'carbs', 'fats', 'recipe'];
        for (const field of requiredFields) {
          if (!meal[field]) {
            return res.status(400).json({ 
              message: `Missing ${field} in meal for ${day}.` 
            });
          }
        }
      }
    }

    const mealPlan = new MealPlan({ trainerId, userId, week, days });
    await mealPlan.save();
    
    await mealPlan.populate('userId', 'name email');
    await mealPlan.populate('trainerId', 'name email');

    res.status(201).json({ 
      message: 'Meal plan created successfully.', 
      mealPlan 
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create meal plan.', error: err.message });
  }
};

// Update an existing meal plan - Trainer only
export const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { days, week } = req.body;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;

    // Find the meal plan and verify trainer ownership
    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found.' });
    }

    if (mealPlan.trainerId.toString() !== trainerId.toString()) {
      return res.status(403).json({ 
        message: 'You are not authorized to update this meal plan.' 
      });
    }

    // Validate days structure if provided
    if (days) {
      if (typeof days !== 'object' || Object.keys(days).length === 0) {
        return res.status(400).json({ 
          message: 'Days must be a non-empty object with meal plans.' 
        });
      }

      // Validate meal structure for each day
      for (const [day, meals] of Object.entries(days)) {
        if (!Array.isArray(meals)) {
          return res.status(400).json({ 
            message: `Meals for ${day} must be an array.` 
          });
        }
        
        for (const meal of meals) {
          const requiredFields = ['type', 'time', 'meal', 'calories', 'protein', 'carbs', 'fats', 'recipe'];
          for (const field of requiredFields) {
            if (!meal[field]) {
              return res.status(400).json({ 
                message: `Missing ${field} in meal for ${day}.` 
              });
            }
          }
        }
      }
    }

    const updateData = {};
    if (days) updateData.days = days;
    if (week) updateData.week = week;

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).populate('userId', 'name email').populate('trainerId', 'name email');

    res.json({ 
      message: 'Meal plan updated successfully.', 
      mealPlan: updatedMealPlan 
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update meal plan.', error: err.message });
  }
};

// Delete a meal plan - Trainer only
export const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get trainer ID from the Trainer model using user ID
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      return res.status(403).json({ 
        success: false, 
        message: "User is not a trainer" 
      });
    }
    
    const trainerId = trainer._id;

    const mealPlan = await MealPlan.findById(id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found.' });
    }

    if (mealPlan.trainerId.toString() !== trainerId.toString()) {
      return res.status(403).json({ 
        message: 'You are not authorized to delete this meal plan.' 
      });
    }

    await MealPlan.findByIdAndDelete(id);
    res.json({ message: 'Meal plan deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete meal plan.', error: err.message });
  }
};


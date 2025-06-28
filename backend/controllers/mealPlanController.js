import MealPlan from '../models/MealPlan.js';

// Get meal plan for a user (optionally by week)
export const getMealPlan = async (req, res) => {
  try {
    const { trainerId, userId } = req.params;
    const { week } = req.query;
    const query = { trainerId, userId };
    if (week) query.week = week;
    const mealPlan = await MealPlan.findOne(query);
    if (!mealPlan)
      return res.status(404).json({ message: 'Meal plan not found for the specified trainer, user, and week.' });
    res.json({ message: 'Meal plan fetched successfully.', mealPlan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch meal plan.', error: err.message });
  }
};

// Create a new meal plan
export const createMealPlan = async (req, res) => {
  try {
    const { trainerId, userId, week, days } = req.body;
    const mealPlan = new MealPlan({ trainerId, userId, week, days });
    await mealPlan.save();
    res.status(201).json({ message: 'Meal plan created successfully.', mealPlan });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create meal plan.', error: err.message });
  }
};

// Update an existing meal plan
export const updateMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.body;
    const mealPlan = await MealPlan.findByIdAndUpdate(id, { days }, { new: true });
    if (!mealPlan)
      return res.status(404).json({ message: 'Meal plan not found for update.' });
    res.json({ message: 'Meal plan updated successfully.', mealPlan });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update meal plan.', error: err.message });
  }
};

// Delete a meal plan
export const deleteMealPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findByIdAndDelete(id);
    if (!mealPlan)
      return res.status(404).json({ message: 'Meal plan not found for deletion.' });
    res.json({ message: 'Meal plan deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete meal plan.', error: err.message });
  }
};
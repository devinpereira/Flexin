import express from 'express';
import {
    getMealPlan,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan
} from '../controllers/mealPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get meal plan for a user (optionally by week)
router.get('/:trainerId/:userId', protect, getMealPlan);

// Create a new meal plan (trainer only)
router.post('/', protect, createMealPlan);

// Update a meal plan by ID (trainer only)
router.put('/:id', protect, updateMealPlan);

// Delete a meal plan by ID (trainer only)
router.delete('/:id', protect, deleteMealPlan);

export default router;